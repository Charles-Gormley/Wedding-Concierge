"use server"

import { headers } from "next/headers"

// API key for storage API - should match the one in the API route
const API_KEY = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "your-super-complex-api-key-here-make-it-very-long-and-random"

// Maximum number of retry attempts
const MAX_RETRIES = 3

// Base delay for exponential backoff (in milliseconds)
const BASE_DELAY = 1000

// Function to save wedding data with retry logic
export async function saveWeddingDataWithRetry(
  weddingName: string,
  weddingData: string,
  weddingId: string,
): Promise<void> {
  let retryCount = 0
  let lastError: Error | null = null

  while (retryCount < MAX_RETRIES) {
    try {
      if (retryCount > 0) {
        // Calculate delay with exponential backoff
        const delay = BASE_DELAY * Math.pow(2, retryCount - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      await saveWeddingData(weddingName, weddingData, weddingId)
      return
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      retryCount++
    }
  }

  // If we've exhausted all retries, throw the last error
  if (lastError) {
    throw lastError
  } else {
    throw new Error(`Failed to save wedding data after ${MAX_RETRIES} attempts`)
  }
}

// Core function to save wedding data via API
// This stores the raw text in DynamoDB for faster retrieval by LLMs
// Core function to save wedding data via API
async function saveWeddingData(weddingName: string, weddingData: string, weddingId: string): Promise<void> {
  try {
    console.log(
      `Saving wedding data to DynamoDB for wedding ID: ${weddingId}, data length: ${weddingData.length} characters`,
    )
    // Validate parameters
    if (!weddingName) {
      throw new Error("Wedding name is required")
    }

    if (!weddingData) {
      throw new Error("Wedding data is required")
    }

    if (!weddingId) {
      throw new Error("Wedding ID is required")
    }

    // Get the current request's origin
    const headersList = await headers()
    const host = headersList.get('host') || process.env.BASE_URL || 'localhost:3000'

    if (!host) {
      console.error("Host header is missing and no BASE_URL environment variable is set")
    }

    // Use http for localhost, https for everything else
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`
    const apiUrl = `${baseUrl}/api/wedding-storage`
    
    const requestBody = {
      weddingName,
      weddingId,
      weddingData,
    }

    console.log("API URL:", apiUrl)
    console.log("Request headers:", {
      "Content-Type": "application/json",
      "x-vercel-protection-bypass": `${API_KEY}`,
    })
    console.log("Request body:", JSON.stringify(requestBody, null, 2))

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-protection-bypass": `${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log("Raw response:", responseText)

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText)
        throw new Error(`Storage API request failed: ${response.status} - ${JSON.stringify(errorData)}`)
      } catch (parseError) {
        throw new Error(`Storage API request failed: ${response.status} - ${responseText}`)
      }
    }

    try {
      const data = JSON.parse(responseText)
      console.log("Parsed response data:", data)
      return
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError)
      throw new Error(`Invalid JSON response: ${responseText}`)
    }
  } catch (error) {
    // Log additional error details
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      })
      throw error
    } else {
      throw new Error(String(error))
    }
  }
}

// Function to get wedding data by ID
export async function getWeddingDataById(weddingId: string): Promise<any> {
  try {
    // Validate parameters
    if (!weddingId) {
      throw new Error("Wedding ID is required")
    }

    // Prepare the API request
    const apiUrl = "/api/dynamodb"
    const requestBody = {
      operation: "getItem",
      params: {
        tableName: process.env.DYNAMODB_TABLE,
        key: {
          wedding_id: weddingId,
        },
      },
    }

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`DynamoDB API request failed: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const result = await response.json()
    return result.item
  } catch (error) {
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error(String(error))
    }
  }
}
