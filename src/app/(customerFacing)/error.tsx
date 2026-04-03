"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <h2 className="text-2xl font-bold text-primary">Something went wrong</h2>
      <p className="text-secondary-text max-w-md">
        We ran into an unexpected error. Please try again or contact us if the
        problem persists.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" navigateTo="/contact">
          Contact us
        </Button>
      </div>
    </div>
  );
}
