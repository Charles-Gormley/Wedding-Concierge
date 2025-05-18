import { headers } from 'next/headers';

export async function getVercelAuthHeaders() {
  const headersList = await headers();
  const vercelToken = process.env.VERCEL_AUTH_TOKEN;
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${vercelToken}`,
    'x-vercel-protection-bypass': '1',
    'x-vercel-deployment-url': headersList.get('x-vercel-deployment-url') || '',
    'x-vercel-ip': headersList.get('x-vercel-ip') || '',
    'x-vercel-ip-country': headersList.get('x-vercel-ip-country') || '',
    'x-vercel-ip-country-region': headersList.get('x-vercel-ip-country-region') || '',
    'x-vercel-ip-city': headersList.get('x-vercel-ip-city') || '',
    'x-vercel-ip-latitude': headersList.get('x-vercel-ip-latitude') || '',
    'x-vercel-ip-longitude': headersList.get('x-vercel-ip-longitude') || '',
  };
} 