'use client';

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { AuthButtons } from "./SignInButton"
import { useUser } from "@clerk/nextjs"

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 bg-white dark:bg-charcoal shadow-sm z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl sm:text-2xl font-light text-black dark:text-white">
              WeddingConcierge
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isSignedIn && (
              <Link
                href="/dashboard"
                className="text-sm text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                Dashboard
              </Link>
            )}
            <AuthButtons />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
