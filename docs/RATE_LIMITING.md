# Distributed Rate Limiting with Upstash Redis

## The Problem: In-Memory State in Serverless

The contact form and quote request flow both previously used an in-memory rate limiter:

```typescript
// The broken implementation
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const entry = rateLimitMap.get(ip);
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}
```

This works correctly in a traditional server running as a persistent process (like an Express app on a VPS). In that model, the process stays alive and the `Map` accumulates state across all requests.

**Vercel (and all serverless platforms) work differently.** Each incoming request may be handled by a fresh function instance — a "cold start." When that happens, a new `Map` is created with zero entries. Multiple instances can run simultaneously to handle concurrent traffic, and each has its own isolated copy of the `Map`. The result is that a single IP can submit the contact form unlimited times, flooding the client's inbox.

This was not a hypothetical risk — it was a live security gap.

---

## The Solution: Upstash Redis

### Why Redis?

Rate limiting requires a single shared counter that all function instances can read and update atomically. Redis is the standard tool for this because:

- **Atomic operations** — Redis commands like `INCR` and `EXPIRE` execute as a unit, preventing race conditions where two instances both read a count of 4, both decide it's under the limit, and both allow the request through.
- **Millisecond TTLs** — Rate limit windows need to expire on a precise schedule. Redis has native key expiry.
- **Sub-millisecond reads** — Checking a counter adds negligible latency to the request.

### Why Upstash Specifically?

Traditional Redis requires a persistent TCP connection, which is incompatible with serverless functions (functions are stateless, short-lived, and cannot maintain open connections between requests). Upstash solves this by exposing Redis over **HTTP REST** — every read and write is a regular HTTPS request, which works identically in serverless, Edge Functions, and local development.

Alternatives considered:

| Option | Problem |
|---|---|
| Redis Cloud / ElastiCache | Requires TCP connection — incompatible with serverless cold starts |
| Vercel KV (also Upstash under the hood) | Valid alternative but adds Vercel vendor lock-in; direct Upstash gives more control |
| Custom database counter | Much higher latency (SQL round-trip); not designed for high-frequency atomic increments |
| In-memory (previous) | Not shared across instances — broken in production |

Upstash's free tier handles 10,000 requests/day, which is far more than a B2B contact form will ever generate.

### Why `@upstash/ratelimit`?

The `@upstash/ratelimit` SDK is maintained by Upstash and is the community standard for Next.js rate limiting. It abstracts the sliding window algorithm into a single function call, handles key management, and provides built-in analytics. Building this manually on top of raw Redis commands would require implementing the sliding window logic correctly, which is non-trivial.

---

## Fixed vs. Sliding Window

The previous implementation used a **fixed window**: reset the counter every 60 seconds on a fixed clock boundary. This has a known vulnerability: a user can send 5 requests just before the window resets, then 5 more immediately after, effectively sending 10 requests in a very short span.

The new implementation uses a **sliding window**: each IP gets 5 requests in any rolling 60-second period. The window moves with time, so the "burst at the boundary" attack is impossible.

```
Fixed window (vulnerable):
  |--- window 1 ---|--- window 2 ---|
  ...XXXXX | XXXXX...
            ^ 10 requests in <1 second across the boundary

Sliding window (safe):
  At any given moment, look back 60 seconds.
  If there are already 5 requests in that window, deny.
```

---

## What Changed

### New file: `src/lib/rateLimit.ts`

A single shared module that both email paths import. Having one definition prevents the policy (5 req / 60s) from drifting between the Server Action and the API route.

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "stonesuppliers:ratelimit",
  analytics: true,
});
```

The `prefix` field namespaces all Redis keys written by this project (e.g., `stonesuppliers:ratelimit:203.0.113.5`). This matters because the Upstash database is shared with another project — without a prefix, both projects would write to the same key namespace and accidentally share rate limit state.

### Updated: `src/app/actions/sendEmail.ts`

The Server Action (called directly from the contact/quote form client component):

```typescript
// Before
if (isRateLimited(ip)) {
  return { success: false, error: "Too many requests..." };
}

// After
const { success: rateLimitOk } = await ratelimit.limit(ip);
if (!rateLimitOk) {
  return { success: false, error: "Too many requests. Please try again later." };
}
```

### Updated: `src/app/api/resend/route.ts`

The HTTP route handler (same change, same result):

```typescript
// Before
if (isRateLimited(ip)) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}

// After
const { success: rateLimitOk } = await ratelimit.limit(ip);
if (!rateLimitOk) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}
```

---

## Required Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | `.env.local` + Vercel dashboard | Redis database endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | `.env.local` + Vercel dashboard | Authentication token |

Both values come from the Upstash console → your database → Details tab. `Redis.fromEnv()` reads them automatically — no manual wiring needed.

---

## Verifying It Works

With env vars set locally:

1. Start the dev server: `npm run dev`
2. Submit the contact form 6 times within 60 seconds
3. The 6th submission should return the "Too many requests" error
4. Open the Upstash console → Data Browser and confirm you see a key like `stonesuppliers:ratelimit:*`

In production, Vercel populates `x-forwarded-for` on every request, so IP extraction is reliable. The rate limiter falls back to the string `"unknown"` if neither `x-forwarded-for` nor `x-real-ip` is present (this only happens in misconfigured proxy setups and is not a concern on Vercel).

---

## Packages Added

```
@upstash/ratelimit   — sliding window rate limit primitives
@upstash/redis       — HTTP-based Redis client (serverless-compatible)
```
