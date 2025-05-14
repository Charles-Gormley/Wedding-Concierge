"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"

export default function EmailCollection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email submitted:", email)
    setEmail("")
  }

  return (
    <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
      <div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-light text-gray-900 dark:text-white">
          Save the Headache on Your Wedding Day
        </h2>
        <p className="mt-2 text-center text-sm font-light text-gray-600 dark:text-gray-300">
          Join our wedding concierge SMS chat service
        </p>
      </div>
      <form className="mt-8 space-y-6" action="https://submit-form.com/FykLFzrw2" method="POST">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-charcoal-light rounded-t-md focus:outline-none focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white focus:z-10 text-base sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 sm:py-2 px-4 border border-transparent text-base sm:text-sm font-medium rounded-md text-white bg-black dark:bg-white dark:text-charcoal hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
          >
            Get Early Access
          </button>
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/new-wedding"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            Already have access? Create a new wedding
          </Link>
        </div>
      </form>
    </div>
  )
}
