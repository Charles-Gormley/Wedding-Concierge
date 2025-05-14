"use client"

import { useEffect } from "react"
import { useProgress } from "@/hooks/use-progress"

interface ProgressBarProps {
  sessionId: string
  autoStart?: boolean
  className?: string
  height?: number
  showPercentage?: boolean
  onComplete?: () => void
  forceComplete?: boolean // Add this prop
}

export default function ProgressBar({
  sessionId,
  autoStart = true,
  className = "",
  height = 8,
  showPercentage = true,
  onComplete,
  forceComplete = false, // Add default value
}: ProgressBarProps) {
  const { progress, isComplete, startPolling, stopPolling, resetProgress, completeProgress } = useProgress(sessionId)

  // Auto-start polling if enabled
  useEffect(() => {
    if (autoStart && sessionId) {
      startPolling()
    }

    return () => {
      stopPolling()
    }
  }, [autoStart, sessionId])

  // Force complete if requested
  useEffect(() => {
    if (forceComplete) {
      completeProgress()
    }
  }, [forceComplete])

  // Call onComplete callback when progress reaches 100%
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete()
    }
  }, [isComplete, onComplete])

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" style={{ height }}>
        <div
          className="bg-black dark:bg-white h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showPercentage && <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">{progress}%</div>}
    </div>
  )
}
