import { type NextRequest, NextResponse } from "next/server"
import { signAwsRequest } from "@/utils/aws-signature-v4"

// Create a secure API key - this should be stored in an environment variable
const API_KEY = process.env.DYNAMODB_API_KEY || "your-super-complex-api-key-here-make-it-very-long-and-random"

export async function POST(request: NextRequest) {
  try {
    console.log("Preparing Auth Request")
    // Verify API key
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
      console.log("Unauthorized access attempt to DynamoDB API")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { operation, params } = body

    console.log("Preparing operation:", operation)

    // Handle different operations
    if (operation === "putItem") {
      const { tableName, item } = params

      if (!tableName || !item) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
      }

      console.log("Preparing item for DynamoDB")

      // Convert JavaScript object to DynamoDB format
      const dynamoItem: Record<string, any> = {}

      // Ensure wedding_id is present for the primary key
      if (!item.wedding_id) {
        return NextResponse.json({ error: "Missing wedding_id (primary key)" }, { status: 400 })
      }

      for (const [key, value] of Object.entries(item)) {
        if (typeof value === "string") {
          dynamoItem[key] = { S: value }
        } else if (typeof value === "number") {
          dynamoItem[key] = { N: value.toString() }
        } else if (typeof value === "boolean") {
          dynamoItem[key] = { BOOL: value }
        } else if (value === null) {
          dynamoItem[key] = { NULL: true }
        } else if (Array.isArray(value)) {
          // Simple array handling - assumes all elements are strings
          dynamoItem[key] = { L: value.map((item) => ({ S: item.toString() })) }
        } else if (typeof value === "object") {
          // Simple object handling - converts to string
          dynamoItem[key] = { S: JSON.stringify(value) }
        }
      }

      // Prepare the DynamoDB request
      const dynamoRequest = {
        TableName: tableName,
        Item: dynamoItem,
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

      console.log("Signing DynamoDB request")

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

      console.log("Making direct HTTP request to DynamoDB")

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

      console.log("DynamoDB request successful")

      return NextResponse.json({
        success: true,
        message: "Item saved successfully",
      })
    } else if (operation === "getItem") {
      // Add getItem operation that uses wedding_id as the key
      const { tableName, key } = params

      if (!tableName || !key || !key.wedding_id) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
      }

      // Prepare the DynamoDB request
      const dynamoRequest = {
        TableName: tableName,
        Key: {
          wedding_id: { S: key.wedding_id },
        },
      }

      const requestBody = JSON.stringify(dynamoRequest)

      // Prepare headers for signing
      const headers = {
        "Content-Type": "application/x-amz-json-1.0",
        "X-Amz-Target": "DynamoDB_20120810.GetItem",
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
            error: "Failed to get item from DynamoDB",
            details: errorText,
          },
          { status: 500 },
        )
      }

      const result = await dynamoResponse.json()

      return NextResponse.json({
        success: true,
        item: result.Item,
      })
    }

    // Handle other operations as needed (query, etc.)

    return NextResponse.json({ error: "Unsupported operation" }, { status: 400 })
  } catch (error) {
    console.error("Error in DynamoDB API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
