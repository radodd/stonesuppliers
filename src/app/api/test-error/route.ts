// ─────────────────────────────────────────────────────────────────────────────
// Sentry Test Endpoint
//
// Intentionally throws an error so you can verify Sentry is receiving events.
// Only active outside production — returns 404 in the production environment.
//
// Usage:
//   GET http://localhost:3000/api/test-error
//   GET https://your-staging-url.vercel.app/api/test-error
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  throw new Error(
    "Sentry test error — intentionally thrown to verify event ingestion"
  );
}
