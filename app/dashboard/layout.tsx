'use client';

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Home, CreditCard, HelpCircle, MessageSquare, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface WeddingData {
  weddingId: string;
  weddingName: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeddingData() {
      if (!user?.id) {
        console.log("No user ID available");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching wedding data for user:", user.id);
        const response = await fetch('/api/wedding-id');
        const data = await response.json();
        
        if (response.ok) {
          console.log("Successfully fetched wedding data:", data);
          setWeddingData(data);
        } else {
          console.error('Failed to fetch wedding data:', data.error);
          setError(data.error || 'Failed to fetch wedding data');
          setWeddingData(null);
        }
      } catch (error) {
        console.error('Error fetching wedding data:', error);
        setError('Error fetching wedding data');
        setWeddingData(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (user?.id) {
      fetchWeddingData();
    } else {
      setIsLoading(false);
    }
  }, [user?.id]);

  const chatLink = weddingData 
    ? `/chat/${weddingData.weddingId}` 
    : '#';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex fixed left-0 top-16 bottom-16 w-72 flex-col bg-white dark:bg-charcoal-light border-r border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-light text-black dark:text-white">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.emailAddresses[0]?.emailAddress}</p>
        </div>
        <nav className="flex-1 px-3">
          <Link
            href="/dashboard"
            className="flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-charcoal rounded-lg transition-colors"
          >
            <Home className="w-5 h-5 mr-3" />
            Home
          </Link>
          <Link
            href={chatLink}
            className={`flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-charcoal rounded-lg transition-colors ${!weddingData ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Chat Portal
            {isLoading && <span className="ml-2 text-xs text-gray-400">Loading...</span>}
            {error && <span className="ml-2 text-xs text-red-400">{error}</span>}
          </Link>
          <Link
            href="/dashboard/billing"
            className="flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-charcoal rounded-lg transition-colors"
          >
            <CreditCard className="w-5 h-5 mr-3" />
            Billing & Subscription
          </Link>
          <Link
            href="/dashboard/help"
            className="flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-charcoal rounded-lg transition-colors"
          >
            <HelpCircle className="w-5 h-5 mr-3" />
            Help
          </Link>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-charcoal-light border-t border-gray-200 dark:border-gray-700">
        <nav className="flex justify-around p-2">
          <Link
            href="/dashboard"
            className="flex flex-col items-center px-3 py-2 text-gray-700 dark:text-gray-200"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href={chatLink}
            className={`flex flex-col items-center px-3 py-2 text-gray-700 dark:text-gray-200 ${!weddingData ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs mt-1">Chat</span>
            {isLoading && <span className="text-[10px] text-gray-400">Loading...</span>}
            {error && <span className="text-[10px] text-red-400">{error}</span>}
          </Link>
          <Link
            href="/dashboard/billing"
            className="flex flex-col items-center px-3 py-2 text-gray-700 dark:text-gray-200"
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs mt-1">Billing</span>
          </Link>
          <Link
            href="/dashboard/help"
            className="flex flex-col items-center px-3 py-2 text-gray-700 dark:text-gray-200"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs mt-1">Help</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-72 pt-16 pb-16 overflow-auto">
        {children}
      </div>
    </div>
  );
} 