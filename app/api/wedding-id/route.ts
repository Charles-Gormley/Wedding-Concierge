import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching wedding ID for user:", userId);

    const command = new QueryCommand({
      TableName: "wedding-concierge-indices",
      IndexName: "user_id-index",
      KeyConditionExpression: "user_id = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ProjectionExpression: "wedding_id, wedding_name",
    });

    const response = await client.send(command);
    console.log("DynamoDB response:", response);

    if (!response.Items || response.Items.length === 0) {
      console.log("No wedding found for user:", userId);
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const wedding = response.Items[0];
    if (!wedding.wedding_id || !wedding.wedding_name) {
      console.log("Wedding data is incomplete for user:", userId);
      return NextResponse.json({ error: "Wedding data incomplete" }, { status: 404 });
    }

    console.log("Found wedding:", wedding);
    return NextResponse.json({ 
      weddingId: wedding.wedding_id,
      weddingName: wedding.wedding_name
    });
  } catch (error) {
    console.error("Error fetching wedding data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 