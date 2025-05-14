"use server"

import { cookies } from "next/headers"

// Define the progress tracker interface
export interface ProgressUpdate {
  progress: number
  taskId: string
}

// Define the task weights - how much each task contributes to overall progress
export const TASK_WEIGHTS = {
  INIT: 5, // Initial setup
  DOCUMENT_PROCESSING: 30, // Processing all documents (AI + S3)
  COMBINE_TEXT: 5, // Combining all text
  UPLOAD_COMBINED_TEXT: 10, // Uploading combined text to S3
  CREATE_MASTER_DOC: 20, // Creating master document with OpenAI
  FINAL_UPLOADS: 30, // Uploading master doc to S3 and saving to DynamoDB
}

// Calculate total weight for normalization
const TOTAL_WEIGHT = Object.values(TASK_WEIGHTS).reduce((sum, weight) => sum + weight, 0)

// Progress tracker class
class ProgressTracker {
  private progressMap: Map<string, number> = new Map()
  private sessionId: string

  constructor(sessionId: string) {
    this.sessionId = sessionId
  }

  // Update progress for a specific task
  updateProgress(taskId: string, completionPercentage = 100): void {
    // Store the task completion percentage
    this.progressMap.set(taskId, completionPercentage)

    // Calculate overall progress
    this.saveProgress()
  }

  // Calculate and save the overall progress
  private saveProgress(): void {
    let totalProgress = 0
    let totalWeightAccounted = 0

    // Calculate weighted progress
    for (const [taskId, percentage] of this.progressMap.entries()) {
      const weight = TASK_WEIGHTS[taskId as keyof typeof TASK_WEIGHTS] || 0
      totalProgress += (percentage / 100) * weight
      totalWeightAccounted += weight
    }

    // Normalize to overall percentage (0-100)
    const normalizedProgress = Math.min(Math.round((totalProgress / TOTAL_WEIGHT) * 100), 100)

    // Save to cookies with 5-minute expiration
    cookies().set(`progress_${this.sessionId}`, normalizedProgress.toString(), {
      maxAge: 300, // 5 minutes
      path: "/",
    })
  }
}

// Create a new progress tracker or get an existing one
export function getProgressTracker(sessionId: string): ProgressTracker {
  return new ProgressTracker(sessionId)
}

// Function to get the current progress
export async function getCurrentProgress(sessionId: string): Promise<number> {
  const progressCookie = cookies().get(`progress_${sessionId}`)
  return progressCookie ? Number.parseInt(progressCookie.value, 10) : 0
}

// Decorator-like function to track progress of a function
export function withProgress<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  taskId: keyof typeof TASK_WEIGHTS,
  sessionId: string,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const tracker = getProgressTracker(sessionId)

    // Mark task as started (0% complete)
    tracker.updateProgress(taskId, 0)

    try {
      // Execute the original function
      const result = await fn(...args)

      // Mark task as completed (100% complete)
      tracker.updateProgress(taskId, 100)

      return result
    } catch (error) {
      // Mark task as failed (still count it as partially complete)
      tracker.updateProgress(taskId, 50)
      throw error
    }
  }
}

// Function to reset progress
export async function resetProgress(sessionId: string): Promise<void> {
  cookies().set(`progress_${sessionId}`, "0", {
    maxAge: 300,
    path: "/",
  })
}

// Function to force progress to 100%
export async function completeProgress(sessionId: string): Promise<void> {
  cookies().set(`progress_${sessionId}`, "100", {
    maxAge: 300,
    path: "/",
  })
}

// API route to get current progress
export async function getProgress(sessionId: string): Promise<ProgressUpdate> {
  const progress = await getCurrentProgress(sessionId)
  return {
    progress,
    taskId: progress === 100 ? "COMPLETED" : "IN_PROGRESS",
  }
}
