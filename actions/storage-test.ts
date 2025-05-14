"use server"

// API key for storage API - should match the one in the API route
const API_KEY = process.env.DYNAMODB_API_KEY || "your-super-complex-api-key-here-make-it-very-long-and-random"

// Function to test storage connectivity
export async function testStorageConnection(): Promise<{
  success: boolean
  message: string
  details?: any
}> {
  try {
    // Prepare the API request
    const apiUrl = "/api/storage-test"

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()

      return {
        success: false,
        message: `Storage connection test failed: ${response.status} - ${response.statusText}`,
        details: errorData,
      }
    }

    const result = await response.json()

    return {
      success: true,
      message: "Storage connection test successful",
      details: result.details,
    }
  } catch (error) {
    return {
      success: false,
      message: `Error testing storage connection: ${error instanceof Error ? error.message : String(error)}`,
      details: error,
    }
  }
}
