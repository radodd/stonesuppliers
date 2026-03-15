import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─────────────────────────────────────────────────────────────────────────────
// Distributed rate limiter backed by Upstash Redis.
//
// Unlike module-level Map state, this works correctly in serverless environments
// (Vercel, Edge Functions) where each cold start is a fresh process. Redis is
// the shared source of truth across all concurrent instances.
//
// Policy: 5 requests per IP per 60-second sliding window.
// Prefix: namespaces keys so this project doesn't collide with other projects
//         sharing the same Upstash database.
//
// Required env vars:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
// ─────────────────────────────────────────────────────────────────────────────

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "stonesuppliers:ratelimit",
  analytics: true,
});
