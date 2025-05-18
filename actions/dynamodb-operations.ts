"use server"

import { getApiHeaders } from '@/utils/api-headers';

// API key for DynamoDB API - should match the one in the API route
const API_KEY = process.env.DYNAMODB_API_KEY || "your-super-complex-api-key-here-make-it-very-long-and-random"

// Maximum number of retry attempts
const MAX_RETRIES = 3

// Base delay for exponential backoff (in milliseconds)
const BASE_DELAY = 1000

// Function to save data to DynamoDB with retry logic
export async function saveWeddingToDynamoDBWithRetry(
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

      await saveWeddingToDynamoDB(weddingName, weddingData, weddingId)
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
    throw new Error(`Failed to save to DynamoDB after ${MAX_RETRIES} attempts`)
  }
}

// Core function to save data to DynamoDB via API
async function saveWeddingToDynamoDB(weddingName: string, weddingData: string, weddingId: string): Promise<void> {
  try {
    // Validate parameters
    if (!weddingName) {
      throw new Error("Wedding name is required for DynamoDB save")
    }

    if (!weddingData) {
      throw new Error("Wedding data is required for DynamoDB save")
    }

    if (!weddingId) {
      throw new Error("Wedding ID is required for DynamoDB save")
    }

    // Check environment variables
    if (!process.env.DYNAMODB_TABLE) {
      throw new Error("DYNAMODB_TABLE environment variable is not defined")
    }

    // Prepare the item to save
    // Using wedding_id as the primary key (partition key)
    const item = {
      wedding_id: weddingId, // Primary key
      wedding_name: weddingName, // Now just a regular attribute
      created_at: new Date().toISOString(),
      wedding_data: weddingData,
    }

    // Prepare the API request
    const apiUrl = "/api/dynamodb"
    const requestBody = {
      operation: "putItem",
      params: {
        tableName: process.env.DYNAMODB_TABLE,
        item: item,
      },
    }

    const headers = await getApiHeaders(API_KEY);

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`DynamoDB API request failed: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    await response.json()
    return
  } catch (error) {
    // Log additional error details
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error(String(error))
    }
  }
}

// Function to get wedding data by ID
export async function getWeddingById(weddingId: string): Promise<any> {
  try {
    // Validate parameters
    if (!weddingId) {
      throw new Error("Wedding ID is required")
    }

    // Check environment variables
    if (!process.env.DYNAMODB_TABLE) {
      throw new Error("DYNAMODB_TABLE environment variable is not defined")
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

    const headers = await getApiHeaders(API_KEY);

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
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
