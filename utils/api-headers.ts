import { getVercelAuthHeaders } from './vercel-auth';

export async function getApiHeaders(apiKey?: string) {
  const vercelHeaders = await getVercelAuthHeaders();
  
  return {
    ...vercelHeaders,
    ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
  };
} 