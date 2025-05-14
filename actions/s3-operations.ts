"use server"

import { debugLog } from "./debug-utils"

// Simple fetch-based S3 upload with basic authentication
export async function uploadToS3WithFetch(content: string | Buffer, key: string, contentType: string): Promise<string> {
  try {
    debugLog(`[S3] Starting S3 upload with fetch for: ${key}`)

    // Validate AWS credentials
    if (!process.env.AWS_S3_BUCKET) {
      debugLog("[S3] ERROR: AWS_S3_BUCKET is not defined")
      throw new Error("AWS S3 bucket is not defined")
    }

    if (!process.env.AWS_REGION) {
      debugLog("[S3] ERROR: AWS_REGION is not defined")
      throw new Error("AWS_REGION is not defined")
    }

    if (!process.env.AWS_ACCESS_KEY_ID) {
      debugLog("[S3] ERROR: AWS_ACCESS_KEY_ID is not defined")
      throw new Error("AWS_ACCESS_KEY_ID is not defined")
    }

    if (!process.env.AWS_SECRET_ACCESS_KEY) {
      debugLog("[S3] ERROR: AWS_SECRET_ACCESS_KEY is not defined")
      throw new Error("AWS_SECRET_ACCESS_KEY is not defined")
    }

    // Create the S3 URL
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    debugLog(`[S3] Using URL: ${url}`)

    // Create basic auth credentials
    const credentials = Buffer.from(`${process.env.AWS_ACCESS_KEY_ID}:${process.env.AWS_SECRET_ACCESS_KEY}`).toString(
      "base64",
    )

    // Create headers with basic auth
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      Authorization: `Basic ${credentials}`,
    }

    debugLog(`[S3] Headers prepared with basic auth`)

    // Make a direct PUT request to S3
    const response = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: content,
    })

    if (!response.ok) {
      const errorText = await response.text()
      debugLog(`[S3] ERROR: S3 upload failed with status ${response.status}`)
      debugLog(`[S3] ERROR details: ${errorText}`)
      throw new Error(`S3 upload failed: ${response.status} - ${errorText}`)
    }

    debugLog(`[S3] S3 upload with fetch successful for: ${key}`)
    return url
  } catch (error: any) {
    debugLog("[S3] Detailed Fetch Error", {
      message: error.message,
      errorStack: error.stack,
      errorCause: error.cause || "N/A",
    })
    throw error
  }
}

// Simple fetch-based S3 fetch with basic authentication
export async function fetchFromS3WithFetch(key: string): Promise<string> {
  try {
    debugLog(`[S3] Fetching from S3 with fetch: ${key}`)

    // Validate AWS credentials
    if (!process.env.AWS_S3_BUCKET) {
      debugLog("[S3] ERROR: AWS_S3_BUCKET is not defined")
      throw new Error("AWS S3 bucket is not defined")
    }

    if (!process.env.AWS_REGION) {
      debugLog("[S3] ERROR: AWS_REGION is not defined")
      throw new Error("AWS_REGION is not defined")
    }

    if (!process.env.AWS_ACCESS_KEY_ID) {
      debugLog("[S3] ERROR: AWS_ACCESS_KEY_ID is not defined")
      throw new Error("AWS_ACCESS_KEY_ID is not defined")
    }

    if (!process.env.AWS_SECRET_ACCESS_KEY) {
      debugLog("[S3] ERROR: AWS_SECRET_ACCESS_KEY is not defined")
      throw new Error("AWS_SECRET_ACCESS_KEY is not defined")
    }

    // Create the S3 URL
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    debugLog(`[S3] Using URL: ${url}`)

    // Create basic auth credentials
    const credentials = Buffer.from(`${process.env.AWS_ACCESS_KEY_ID}:${process.env.AWS_SECRET_ACCESS_KEY}`).toString(
      "base64",
    )

    // Create headers with basic auth
    const headers: Record<string, string> = {
      Authorization: `Basic ${credentials}`,
    }

    debugLog(`[S3] Headers prepared with basic auth`)

    // Make a direct GET request to S3
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      debugLog(`[S3] ERROR: S3 fetch failed with status ${response.status}`)
      debugLog(`[S3] ERROR details: ${errorText}`)
      throw new Error(`Failed to fetch from S3: ${response.status} - ${errorText}`)
    }

    const text = await response.text()
    debugLog(`[S3] Text fetched successfully with fetch, length: ${text.length}`)
    return text
  } catch (error) {
    debugLog(`[S3] ERROR fetching from S3 with fetch: ${key}`, error)
    throw error
  }
}
