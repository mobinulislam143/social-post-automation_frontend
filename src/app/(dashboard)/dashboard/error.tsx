"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">Failed to load this page</h2>
      <p className="text-sm text-gray-500 max-w-sm">
        Something went wrong while loading the dashboard. Try refreshing.
      </p>
      <Button
        onClick={reset}
        className="h-10 px-5 bg-brand hover:bg-brand-dark text-white rounded-xl gap-2 cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" /> Retry
      </Button>
    </div>
  );
}
