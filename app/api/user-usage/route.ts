import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Query the wedding-concierge-indices table using the GSI on user_id
    const command = new QueryCommand({
      TableName: "wedding-concierge-indices",
      IndexName: "user_id-index", // Name of the GSI
      KeyConditionExpression: "user_id = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });

    const { Items } = await docClient.send(command);
    const userData = Items?.[0]; 

    return NextResponse.json({
      totalMessages: userData?.total_messages || 0,
      usedMessages: userData?.used_messages || 0,
      weddingTier: userData?.wedding_tier || "free",
    });
  } catch (error) {
    console.error("[USER_USAGE]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 