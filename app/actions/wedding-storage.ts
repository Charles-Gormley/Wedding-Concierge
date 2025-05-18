import { getVercelAuthHeaders } from '@/utils/vercel-auth';
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
    
    const authHeaders = await getVercelAuthHeaders();
    
    const response = await fetch(`${baseUrl}/api/wedding-storage`, {
      method: 'POST',
      headers: authHeaders,
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
    
    const authHeaders = await getVercelAuthHeaders();
    
    const response = await fetch(`${baseUrl}/api/wedding-storage?weddingId=${weddingId}`, {
      headers: authHeaders,
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