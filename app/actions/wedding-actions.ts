'use server'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getVercelAuthHeaders } from '@/utils/vercel-auth';
import { headers } from 'next/headers';

interface WeddingData {
  weddingId: string;
  userId: string;
  // Add other wedding data fields as needed
}

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

export async function createWedding(data: WeddingData) {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || process.env.BASE_URL || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const authHeaders = await getVercelAuthHeaders();
    
    const response = await fetch(`${baseUrl}/api/wedding-storage`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create wedding: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating wedding:', error);
    throw error;
  }
}

export async function getWedding(weddingId: string) {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || process.env.BASE_URL || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const authHeaders = await getVercelAuthHeaders();
    
    const response = await fetch(`${baseUrl}/api/wedding-storage?weddingId=${weddingId}`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      throw new Error(`Failed to get wedding: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting wedding:', error);
    throw error;
  }
} 