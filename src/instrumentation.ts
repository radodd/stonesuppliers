// Next.js Instrumentation Hook
//
// This file is loaded once per server process startup (not per request).
// It initialises Sentry on the correct runtime before any request is handled.
//
// Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Automatically captures all server-side request errors (API routes, Server Actions,
// Server Components) without manual try/catch. This is a Next.js 15+ built-in hook.
export const onRequestError = Sentry.captureRequestError;
