'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function PaymentContent() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      if (!isLoaded) return;

      try {
        const paymentIntentId = searchParams.get('paymentIntentId');
        let priceId;

        if (paymentIntentId) {
          // Retrieve the stored payment intent
          const response = await fetch(`/api/payment-intent?paymentIntentId=${paymentIntentId}`);
          if (!response.ok) throw new Error('Invalid payment intent');
          
          const data = await response.json();
          priceId = data.priceId;
        } else {
          priceId = searchParams.get('priceId');
        }

        if (!priceId) {
          throw new Error('No price ID provided');
        }

        // Create checkout session
        const checkoutResponse = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId }),
        });

        if (!checkoutResponse.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { url } = await checkoutResponse.json();
        router.push(url);
      } catch (error) {
        console.error('Payment processing error:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded && userId) {
      processPayment();
    }
  }, [isLoaded, userId, searchParams, router]);

  if (!isLoaded) {
    return null; // Loading state
  }

  if (!userId) {
    return null; // Middleware will handle redirection
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-charcoal dark:to-charcoal-light py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Error
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {error}
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="rounded-full bg-[#E8D4B9] hover:bg-[#E8D4B9]/90 text-gray-900 font-medium py-3 px-6 transition-colors"
          >
            Return to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-charcoal dark:to-charcoal-light py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Processing Payment
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {isLoading ? 'Preparing your checkout session...' : 'Redirecting to payment...'}
        </p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-charcoal dark:to-charcoal-light py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading...
          </h1>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
} 