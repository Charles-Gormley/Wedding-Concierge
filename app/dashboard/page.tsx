'use client';

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface UserUsageData {
  totalMessages: number;
  usedMessages: number;
  weddingTier: string;
}

export default function Dashboard() {
  const { user } = useUser();
  const [usageData, setUsageData] = useState<UserUsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return;

      try {
        const response = await fetch('/api/user-usage', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUsageData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user?.id]);

  return (
    <div className="min-h-screen">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-light text-black dark:text-white mb-6 sm:mb-8">
          Welcome back, {user?.firstName}!
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl">
          <Card className="bg-white dark:bg-charcoal-light shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-black dark:text-white">Total Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-light text-black dark:text-white">
                {loading ? '...' : usageData?.totalMessages || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All-time messages</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-charcoal-light shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-black dark:text-white">Available Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-light text-black dark:text-white">
                {loading ? '...' : (usageData?.totalMessages || 0) - (usageData?.usedMessages || 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {usageData?.weddingTier ? `${usageData.weddingTier.charAt(0).toUpperCase() + usageData.weddingTier.slice(1)} Tier` : 'Free Tier'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 