"use server"

// Debug logging function
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[DEBUG ${timestamp}] ${message}`)
  if (data !== undefined) {
    console.log(JSON.stringify(data, null, 2))
  }
}

// Function to process a chat message using the external API
export async function processChatMessage(message: string, weddingId: string) {
  try {
    debugLog(`Processing chat message for wedding ID: ${weddingId}`)
    debugLog(`Message: ${message}`)

    // Validate parameters
    if (!message || !weddingId) {
      debugLog("ERROR: Message or wedding ID is missing")
      throw new Error("Message or wedding ID is missing")
    }

    // Construct the API URL with the wedding ID
    const apiUrl = `http://velia-server.eba-3emhfy2q.us-east-1.elasticbeanstalk.com/chat/${weddingId}`

    debugLog(`Sending request to external chat API: ${apiUrl}`)

    // Make the API request with "question" as the key
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: message }), // Changed from { message } to { question: message }
    })

    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text()
      debugLog(`ERROR: External API request failed: ${response.status} - ${errorText}`)
      throw new Error(`External API request failed: ${response.status} - ${response.statusText}`)
    }

    // Parse the response
    const result = await response.json()
    console.log(result)

    // Check if the response contains the expected answer field
    if (!result || !result.answer) {
      debugLog("ERROR: External API response did not contain an answer")
      throw new Error("External API response did not contain an answer")
    }

    const answer = result.answer
    debugLog(`Chat response received successfully, length: ${answer.length}`)

    return {
      success: true,
      content: answer,
    }
  } catch (error) {
    debugLog("ERROR processing chat message:", error)
    return {
      success: false,
      content: "I'm sorry, there was an error processing your request. Please try again.",
    }
  }
}
