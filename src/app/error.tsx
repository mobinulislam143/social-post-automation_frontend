"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <h1 className="text-xl font-bold text-gray-900">Something went wrong</h1>
      <p className="text-sm text-gray-500 max-w-sm">
        An unexpected error occurred. Please try again or contact support if the issue persists.
      </p>
      <Button
        onClick={reset}
        className="h-10 px-6 bg-brand hover:bg-brand-dark text-white rounded-xl cursor-pointer"
      >
        Try again
      </Button>
    </div>
  );
}
