import { getApiHeaders } from '@/utils/api-headers';
import { headers } from 'next/headers';

interface WeddingData {
  weddingId: string;
  userId: string;
  // Add other wedding data fields as needed
}

export async function saveWeddingData(data: WeddingData) {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || process.env.BASE_URL || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const apiHeaders = await getApiHeaders();
    
    const response = await fetch(`${baseUrl}/api/wedding-storage`, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to save wedding data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving wedding data:', error);
    throw error;
  }
}

export async function getWeddingData(weddingId: string) {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || process.env.BASE_URL || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const apiHeaders = await getApiHeaders();
    
    const response = await fetch(`${baseUrl}/api/wedding-storage?weddingId=${weddingId}`, {
      headers: apiHeaders,
    });

    if (!response.ok) {
      throw new Error(`Failed to get wedding data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting wedding data:', error);
    throw error;
  }
} 