"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Loader2 } from "lucide-react"
import { processChatMessage } from "@/actions/chat-actions"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatInterface({ weddingId, weddingName }: { weddingId: string; weddingName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Welcome to ${weddingName}'s wedding chat! How can I help you today?`,
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom, messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    // Add user message to chat
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Focus back on input after sending
    inputRef.current?.focus()

    try {
      // Call the server action to process the message
      const result = await processChatMessage(input, weddingId)

      const assistantMessage: Message = {
        role: "assistant",
        content: result.success ? result.content : "I'm sorry, there was an error processing your request.",
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error processing chat message:", error)

      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, there was an error processing your request. Please try again.",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-gray-50 dark:bg-charcoal">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 text-sm sm:text-base ${
                message.role === "user"
                  ? "bg-black text-white dark:bg-white dark:text-charcoal"
                  : "bg-gray-200 text-black dark:bg-charcoal-light dark:text-white"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-charcoal-light text-black dark:text-white px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-black dark:bg-white text-white dark:text-charcoal hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  )
}
