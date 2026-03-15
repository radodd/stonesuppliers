// ─────────────────────────────────────────────────────────────────────────────
// Rate Limit Test Endpoint
//
// A lightweight endpoint for verifying the Upstash rate limiter without
// triggering actual email sends. Shares the same ratelimit instance as the
// real email routes, so hitting this 5+ times proves the limiter works.
//
// Only active outside production — returns 404 in the production environment.
//
// Usage:
//   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/test-rate-limit
//   (run this 6 times — first 5 return 200, 6th returns 429)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1";

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  return NextResponse.json(
    {
      allowed: success,
      limit,
      remaining,
      resetAt: new Date(reset).toISOString(),
    },
    { status: success ? 200 : 429 }
  );
}
