'use server'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export async function getWeddingData(weddingId: string) {
  try {
    console.log("Fetching wedding name for ID:", weddingId);
    console.log("Using table name:", "wedding-concierge-indices");

    const command = new GetCommand({
      TableName: "wedding-concierge-indices",
      Key: {
        wedding_id: weddingId
      },
      ProjectionExpression: "wedding_name"
    });

    console.log("DynamoDB command:", JSON.stringify(command.input, null, 2));

    const response = await client.send(command);
    console.log("DynamoDB raw response:", JSON.stringify(response, null, 2));

    if (!response.Item) {
      console.log("No wedding found for ID:", weddingId);
      throw new Error("Wedding not found", { cause: response.$metadata });
    }

    if (!response.Item.wedding_name) {
      console.log("Wedding found but name is missing:", response.Item);
      throw new Error("Wedding name is missing", { cause: response.$metadata });
    }

    return {
      weddingId,
      weddingName: response.Item.wedding_name
    };
  } catch (error) {
    console.error("Error fetching wedding data:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    throw error;
  }
} 