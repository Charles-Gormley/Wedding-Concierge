import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-charcoal shadow-sm mt-auto border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
        <div className="flex items-start">
          <Link
            href="/privacy-policy"
            className="text-xs sm:text-sm text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white font-light"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="ml-4 sm:ml-6 text-xs sm:text-sm text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white font-light"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
