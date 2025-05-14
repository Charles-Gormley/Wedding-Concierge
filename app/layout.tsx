import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "../components/header"
import Footer from "../components/footer"
import { ThemeProvider } from "@/contexts/theme-context"
import GoogleTagManagerHead from "../components/GoogleTagManagerHead"
import GoogleTagManagerBody from "../components/GoogleTagManagerBody"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} font-sans`}>
        <head>
          <GoogleTagManagerHead />
        </head>
        <body className="flex flex-col min-h-screen bg-white dark:bg-charcoal text-black dark:text-white">
          <ThemeProvider>
            <GoogleTagManagerBody />
            <Header />
            <main className="flex-grow flex items-center justify-center">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

export const metadata = {
  generator: 'v0.dev'
};
