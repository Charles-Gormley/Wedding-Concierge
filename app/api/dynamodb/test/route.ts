import { type NextRequest, NextResponse } from "next/server"
import { signAwsRequest } from "@/utils/aws-signature-v4"

// Create a secure API key - this should be stored in an environment variable
const API_KEY = process.env.DYNAMODB_API_KEY || "your-super-complex-api-key-here-make-it-very-long-and-random"

export async function GET(request: NextRequest) {
  try {
    // Verify API key
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
      console.log("Unauthorized access attempt to DynamoDB test API")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if table name is provided
    const tableName = process.env.DYNAMODB_TABLE
    if (!tableName) {
      return NextResponse.json({ error: "DYNAMODB_TABLE environment variable is not defined" }, { status: 400 })
    }

    // Check required environment variables
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json({ error: "Missing AWS configuration" }, { status: 500 })
    }

    // Prepare the DynamoDB request for DescribeTable
    const dynamoRequest = {
      TableName: tableName,
    }

    const requestBody = JSON.stringify(dynamoRequest)

    // Prepare headers for signing
    const headers = {
      "Content-Type": "application/x-amz-json-1.0",
      "X-Amz-Target": "DynamoDB_20120810.DescribeTable",
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
          success: false,
          error: "DynamoDB connection test failed",
          details: errorText,
        },
        { status: 500 },
      )
    }

    // Parse the response
    const result = await dynamoResponse.json()

    return NextResponse.json({
      success: true,
      message: "DynamoDB connection test successful",
      details: {
        tableName: result.Table?.TableName,
        status: result.Table?.TableStatus,
        itemCount: result.Table?.ItemCount,
      },
    })
  } catch (error) {
    console.error("Error in DynamoDB test API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "DynamoDB connection test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
