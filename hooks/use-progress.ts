"use client"

import { useState, useEffect } from "react"
import { getProgress } from "@/actions/progress-tracker"

export function useProgress(sessionId: string) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isPolling, setIsPolling] = useState(false)

  // Start polling for progress updates
  const startPolling = () => {
    if (!isPolling) {
      setIsPolling(true)
      setProgress(0)
      setIsComplete(false)
    }
  }

  // Stop polling
  const stopPolling = () => {
    setIsPolling(false)
  }

  // Reset progress
  const resetProgress = () => {
    setProgress(0)
    setIsComplete(false)
  }

  // Poll for progress updates
  useEffect(() => {
    if (!isPolling || !sessionId) return

    let timeoutId: NodeJS.Timeout

    const pollProgress = async () => {
      try {
        const update = await getProgress(sessionId)
        setProgress(update.progress)

        if (update.progress >= 100) {
          setIsComplete(true)
          setIsPolling(false)
        } else {
          // Continue polling every 500ms
          timeoutId = setTimeout(pollProgress, 500)
        }
      } catch (error) {
        console.error("Error polling progress:", error)
        // Retry on error after a delay
        timeoutId = setTimeout(pollProgress, 1000)
      }
    }

    // Start polling
    pollProgress()

    // Cleanup
    return () => {
      clearTimeout(timeoutId)
    }
  }, [isPolling, sessionId])

  // Force progress to 100% (useful for better UX)
  const completeProgress = () => {
    setProgress(100)
    setIsComplete(true)
    setIsPolling(false)
  }

  return {
    progress,
    isComplete,
    startPolling,
    stopPolling,
    resetProgress,
    completeProgress, // Add this new function
  }
}
