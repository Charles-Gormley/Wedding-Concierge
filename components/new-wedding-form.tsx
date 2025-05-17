"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Loader2 } from "lucide-react"
import { processWeddingSubmission } from "@/actions/wedding-actions"

export default function NewWeddingForm() {
  const router = useRouter()
  const [weddingName, setWeddingName] = useState("")
  const [weddingDetails, setWeddingDetails] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!weddingName.trim()) {
      alert("Please enter a wedding name")
      return
    }

    setIsSubmitting(true)
    setProcessingStatus("Starting document processing...")

    try {
      // Create FormData object
      const formData = new FormData()
      formData.append("weddingName", weddingName)
      formData.append("weddingDetails", weddingDetails)

      // Add all files to FormData
      files.forEach((file) => {
        formData.append("files", file)
      })

      setProcessingStatus("Uploading files and processing documents...")

      // Call the server action
      const result = await processWeddingSubmission(formData)

      if (result.success) {
        setProcessingStatus("Processing complete! Redirecting to your wedding chat...")

        // Redirect to the chat page for the new wedding
        setTimeout(() => {
          router.push(`/chat/${result.weddingId}`)
        }, 1500)
      } else {
        setProcessingStatus("")
        alert(`Error: ${result.error}`)
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error creating wedding:", error)
      setProcessingStatus("")
      alert("There was an error creating your wedding. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-charcoal shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:shadow-[-6px_6px_14px_0_rgba(255,255,255,0.1)] rounded-lg">
      <h2 className="text-2xl font-light text-center mb-6 text-black dark:text-white">Create a New Wedding</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="wedding-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Wedding Name
          </label>
          <input
            id="wedding-name"
            type="text"
            value={weddingName}
            onChange={(e) => setWeddingName(e.target.value)}
            placeholder="e.g., Sarah and Michael's Wedding"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white bg-white dark:bg-charcoal-light"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="wedding-details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Wedding Details
          </label>
          <textarea
            id="wedding-details"
            value={weddingDetails}
            onChange={(e) => setWeddingDetails(e.target.value)}
            placeholder="Enter any important details about the wedding (date, venue, special requests, etc.)"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white bg-white dark:bg-charcoal-light"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wedding Documents</label>
          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 focus-within:outline-none"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    disabled={isSubmitting}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, XLSX, JPG, PNG up to 10MB each</p>
            </div>
          </div>

          {files.length > 0 && (
            <ul className="mt-3 divide-y divide-gray-200 dark:divide-gray-700">
              {files.map((file, index) => (
                <li key={index} className="py-2 flex justify-between items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                  {!isSubmitting && (
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {isSubmitting && processingStatus && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{processingStatus}</span>
          </div>
        )}

        <div className="pt-4 space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black dark:bg-white dark:text-charcoal hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Create Wedding"}
          </button>

          {!isSubmitting && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
