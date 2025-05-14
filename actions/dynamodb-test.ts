"use server"

import { debugLog } from "./debug-utils"

// API key for DynamoDB API - should match the one in the API route
const API_KEY = process.env.DYNAMODB_API_KEY || "your-super-complex-api-key-here-make-it-very-long-and-random"

// Function to test DynamoDB connectivity
export async function testDynamoDBConnection(): Promise<{
  success: boolean
  message: string
  details?: any
}> {
  try {
    debugLog("[DYNAMODB_TEST] Starting DynamoDB connection test")

    // Prepare the API request
    const apiUrl = "/api/dynamodb/test"

    debugLog(`[DYNAMODB_TEST] Calling DynamoDB test API`)

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      debugLog(`[DYNAMODB_TEST] Error response:`, errorData)

      return {
        success: false,
        message: `DynamoDB connection test failed: ${response.status} - ${response.statusText}`,
        details: errorData,
      }
    }

    const result = await response.json()
    debugLog(`[DYNAMODB_TEST] Table description received successfully`)

    return {
      success: true,
      message: "DynamoDB connection test successful",
      details: result.details,
    }
  } catch (error) {
    debugLog(`[DYNAMODB_TEST] Error testing DynamoDB connection:`, error)

    return {
      success: false,
      message: `Error testing DynamoDB connection: ${error instanceof Error ? error.message : String(error)}`,
      details: error,
    }
  }
}
