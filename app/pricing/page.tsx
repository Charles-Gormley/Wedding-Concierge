'use client';

import { Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const products = [
  {
    name: "Wedding Concierge – Basic Package",
    priceId: "price_1RQeivPK0tCPoCBSI7J0u7Yy",
    price: "$79",
    description: "Essential AI chat interface for basic wedding information",
    features: [
      "AI chat interface for wedding information",
      "Basic automated answers to common questions",
      "Limited wedding details setup",
      "Basic venue information",
      "Email support"
    ],
    image: "https://i.imgur.com/6Mvijcm.png",
    available: true
  },
  {
    name: "Wedding Concierge – Premium Package",
    priceId: "price_1RQeivPK0tCPoCBSI7J0u7Yy", // Replace with actual price ID
    price: "$125",
    description: "Complete AI concierge with voice and SMS for stress-free wedding communication",
    features: [
      "Everything in Basic Package",
      "Unlimited guest access to chat interface",
      "SMS text message support for guests",
      "Voice call interface for complex questions",
      "Custom AI personality and tone matching",
      "Priority response queue for VIP guests"
    ],
    image: "https://i.imgur.com/6Mvijcm.png",
    available: false
  },
  {
    name: "Wedding Concierge – Ultimate Package",
    priceId: "price_1RQeivPK0tCPoCBSI7J0u7Yy", // Replace with actual price ID
    price: "$135",
    description: "Complete wedding concierge solution with multi-platform support and advanced features",
    features: [
      "Everything in Premium Package",
      "Multi-platform integration (WhatsApp, etc.)",
      "Advanced natural language understanding",
      "Real-time translation for international guests",
      "Custom API access for venue/vendor integration",
      "Dedicated support team during wedding week"
    ],
    image: "https://i.imgur.com/6Mvijcm.png",
    available: false
  }
];

const Product = ({ name, price, priceId, description, features, image, available }: { 
  name: string; 
  price: string; 
  priceId: string; 
  description: string;
  features: string[];
  image: string;
  available: boolean;
}) => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLoaded) return;

      if (!userId) {
        // Redirect to sign in page with return URL
        router.push(`/sign-up`);
        return;
      }

      // Create payment intent and redirect to sign in
      const response = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }

      const { paymentIntentId } = await response.json();

      // If already authenticated, proceed to payment
      router.push(`/payment?priceId=${priceId}`);
    } catch (error) {
      console.error('Payment initiation error:', error);
      // TODO: Show error to user in UI
      alert(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-2xl border ${
      available 
        ? 'border-gray-200 dark:border-charcoal-light bg-white dark:bg-charcoal shadow-lg hover:shadow-xl' 
        : 'border-gray-100 dark:border-charcoal-light bg-gray-50 dark:bg-charcoal-light'
    } transition-all duration-300`}>
      {!available && (
        <div className="absolute top-4 right-4 bg-gray-200 dark:bg-charcoal-light text-gray-600 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
          Coming Soon
        </div>
      )}
      <div className="p-8">
        <div className="flex items-center justify-between">
          <h3 className={`text-2xl font-semibold ${
            available ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-400'
          }`}>{name}</h3>
          <div className={`text-3xl font-bold ${
            available ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-400'
          }`}>{price}</div>
        </div>
        <p className={`mt-4 ${
          available ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400'
        }`}>{description}</p>
        <ul className="mt-8 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className={`h-5 w-5 mr-2 ${
                available ? 'text-[#E8D4B9]' : 'text-gray-300 dark:text-gray-500'
              }`} />
              <span className={`${
                available ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400'
              }`}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto p-8 pt-0">
        {available ? (
          <form onSubmit={handleGetStarted}>
            <input type="hidden" name="priceId" value={priceId} />
            <button 
              type="submit"
              disabled={isLoading || !isLoaded}
              className="w-full rounded-full bg-[#E8D4B9] hover:bg-[#E8D4B9]/90 active:bg-[#E8D4B9]/80 text-gray-900 font-medium py-3 px-6 transition-colors shadow-[0_0_15px_rgba(232,212,185,0.5)] hover:shadow-[0_0_20px_rgba(232,212,185,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Get Started'}
            </button>
          </form>
        ) : (
          <button 
            disabled
            className="w-full rounded-full bg-gray-200 dark:bg-charcoal-light text-gray-400 dark:text-gray-400 font-medium py-3 px-6 cursor-not-allowed"
          >
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-charcoal dark:to-charcoal-light py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Your AI Wedding Concierge
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Let your AI concierge handle guest questions, so you can enjoy your special day without interruptions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Product key={product.name} {...product} />
          ))}
        </div>

        <div className="mt-8">
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-charcoal-light bg-white dark:bg-charcoal shadow-lg hover:shadow-xl transition-all duration-300 h-[calc(100%/8)]">
            <div className="p-8 flex items-center justify-between h-full">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Wedding Planners & Venues</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Partner with us to offer AI concierge services to your clients</p>
              </div>
              <a 
                href="/contact-sales"
                className="rounded-full bg-[#E8D4B9] hover:bg-[#E8D4B9]/90 active:bg-[#E8D4B9]/80 text-gray-900 font-medium py-3 px-6 transition-colors shadow-[0_0_15px_rgba(232,212,185,0.5)] hover:shadow-[0_0_20px_rgba(232,212,185,0.6)]"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Have questions about our AI concierge? <a href="#" className="text-[#E8D4B9] hover:text-[#E8D4B9]/80">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
} 