import { type NextRequest, NextResponse } from "next/server"
import { signAwsRequest } from "@/utils/aws-signature-v4"

// Create a secure API key - this should be stored in an environment variable
const API_KEY = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

if (!API_KEY) {
  throw new Error("DYNAMODB_API_KEY is not defined")
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
      console.log("Unauthorized access attempt to Wedding Storage API")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { weddingName, weddingId, weddingData } = body

    if (!weddingName || !weddingId || !weddingData) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Check environment variables
    if (!process.env.DYNAMODB_TABLE) {
      console.log("DYNAMODB_TABLE environment variable is not defined")
      return NextResponse.json({ error: "Storage configuration error" }, { status: 500 })
    }

    // Prepare the item for DynamoDB
    // Using wedding_id as the primary key (partition key)
    const item = {
      wedding_id: { S: weddingId }, // Primary key
      wedding_name: { S: weddingName }, // Now just a regular attribute
      created_at: { S: new Date().toISOString() },
      wedding_data: { S: weddingData },
    }

    // Prepare the DynamoDB request
    const dynamoRequest = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: item,
    }

    const requestBody = JSON.stringify(dynamoRequest)

    // Prepare headers for signing
    const headers = {
      "Content-Type": "application/x-amz-json-1.0",
      "X-Amz-Target": "DynamoDB_20120810.PutItem",
    }

    // Check required environment variables
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json({ error: "Missing AWS configuration" }, { status: 500 })
    }

    // Sign the request
    const signedHeaders = await signAwsRequest({
      method: "POST",
      service: "dynamodb",
      region: process.env.AWS_REGION,
      endpoint: `https://dynamodb.${process.env.AWS_REGION}.amazonaws.com`,
      headers,
      body: requestBody,
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    })

    // Make a direct HTTP request to DynamoDB
    const dynamoResponse = await fetch(`https://dynamodb.${process.env.AWS_REGION}.amazonaws.com`, {
      method: "POST",
      headers: signedHeaders,
      body: requestBody,
    })

    // Check if the request was successful
    if (!dynamoResponse.ok) {
      const errorText = await dynamoResponse.text()
      console.error("DynamoDB API error:", errorText)
      return NextResponse.json(
        {
          error: "Failed to save to DynamoDB",
          details: errorText,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Wedding data saved successfully",
    })
  } catch (error) {
    console.error("Error in Wedding Storage API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
