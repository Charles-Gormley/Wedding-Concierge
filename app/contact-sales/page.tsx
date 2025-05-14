'use client';

import { useState } from 'react';

export default function ContactSales() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    // For now, we'll just show the success message
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Partner with Us
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Offer AI concierge services to your wedding clients and enhance their experience
          </p>
        </div>

        <div className="mb-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            What to Expect
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
              <h4 className="font-medium text-gray-900 dark:text-white">Custom Integration</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Seamless integration with your wedding planning and venue management systems
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
              <h4 className="font-medium text-gray-900 dark:text-white">Volume Discounts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Competitive pricing for wedding planners and venues managing multiple events
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
              <h4 className="font-medium text-gray-900 dark:text-white">Dedicated Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Priority support and training for your wedding planning team
              </p>
            </div>
          </div>
        </div>

        {!submitted ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Business Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-[#E8D4B9] focus:ring-[#E8D4B9]"
                  placeholder="your@business.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-[#E8D4B9] hover:bg-[#E8D4B9]/90 active:bg-[#E8D4B9]/80 text-gray-900 font-medium py-3 px-6 transition-colors shadow-[0_0_15px_rgba(232,212,185,0.5)] hover:shadow-[0_0_20px_rgba(232,212,185,0.6)]"
              >
                Request Partnership Details
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Thank You for Your Interest
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our partnership team will review your request and get back to you within 24 hours with custom pricing options and integration details for your wedding business.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 