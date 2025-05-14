'use client';

import { SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function AuthButtons() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex items-center gap-4">
      {!isSignedIn ? (
        <SignUpButton mode="modal">
          <Button 
            className="rounded-full bg-[#E8D4B9] hover:bg-[#E8D4B9]/90 active:bg-[#E8D4B9]/80 text-gray-900 transition-colors shadow-[0_0_15px_rgba(232,212,185,0.5)] hover:shadow-[0_0_20px_rgba(232,212,185,0.6)]"
          >
            Get Started
          </Button>
        </SignUpButton>
      ) : (
        <UserButton afterSignOutUrl="/" />
      )}
    </div>
  );
} 