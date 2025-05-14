import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function createUser(userId: string, email: string) {
  const command = new PutCommand({
    TableName: "wedding-concierge-users",
    Item: {
      userId,
      email,
      accountType: "free",
      createdAt: new Date().toISOString(),
    },
  });

  try {
    await docClient.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error };
  }
}

export async function getUser(userId: string) {
  const command = new GetCommand({
    TableName: "wedding-concierge-users",
    Key: { userId },
  });

  try {
    const response = await docClient.send(command);
    return { success: true, user: response.Item };
  } catch (error) {
    console.error("Error getting user:", error);
    return { success: false, error };
  }
} 