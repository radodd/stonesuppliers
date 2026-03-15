# Observability — Error Monitoring & Rate Limit Verification

## Overview

Two critical production systems were added in this phase:

1. **Sentry** — captures every unhandled error on both server and client and sends it to a dashboard with full stack traces, user context, and source-mapped code
2. **Rate Limit Testing** — a dedicated endpoint to verify the Upstash Redis limiter is working without triggering real email sends

---

## Sentry

### Why Sentry?

Before Sentry, every unhandled error in the app produced a `console.error()` call that was:
- **Invisible in production** — nobody reads server logs in real time
- **Stacktrace-less** — Next.js minifies production bundles, making raw errors unreadable
- **Silent on the client** — browser errors were never captured at all

Sentry changes this. Every error — whether thrown in a Server Component, an API route, a Server Action, or a React component — is captured, enriched with context (browser, OS, URL, user session), de-minified using source maps, and delivered to a dashboard where you can set up alerts (email, Slack, PagerDuty).

### How the Sentry SDK Is Structured in Next.js

Next.js runs code in three distinct runtimes. Sentry requires a separate entry point for each:

| File | Runtime | When it runs |
|---|---|---|
| `sentry.client.config.ts` | Browser | Loaded in the user's browser |
| `sentry.server.config.ts` | Node.js | API routes, Server Actions, Server Components |
| `sentry.edge.config.ts` | Edge | Middleware, Edge API routes |

The `src/instrumentation.ts` file is Next.js's built-in hook for initialising third-party integrations. It runs once at server startup and imports the correct Sentry config based on which runtime is active (`NEXT_RUNTIME === "nodejs"` vs `"edge"`). This is the official Next.js 13+ pattern — not a workaround.

The `sentry.client.config.ts` is automatically picked up by the Sentry webpack plugin (configured in `next.config.mjs`) and injected into the browser bundle.

### What `withSentryConfig` Does in `next.config.mjs`

Wrapping the Next.js config with `withSentryConfig` adds three things at build time:

1. **Source map upload** — Uploads your compiled source maps to Sentry using `SENTRY_AUTH_TOKEN`. This is what turns `at chunk-abc123.js:1:45893` into `at materialsService.ts:67`. Without this, stack traces in production are useless.

2. **Source map hiding** — Deletes source maps from the public bundle after uploading them to Sentry. Your code is not publicly readable, but Sentry can still de-minify errors.

3. **Auto-instrumentation** — Wraps `fetch()`, database calls, and Next.js data fetching to create performance traces automatically.

### `error.tsx` — Before and After

```typescript
// Before: error is logged locally and disappears
useEffect(() => {
  console.error(error); // only visible in browser devtools
}, [error]);

// After: error is sent to Sentry with full context
useEffect(() => {
  Sentry.captureException(error); // appears in Sentry dashboard within seconds
}, [error]);
```

### Required Environment Variables

| Variable | Where to get it | Notes |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry → Project → Settings → Client Keys | Safe to expose publicly (it's a URL, not a secret) |
| `SENTRY_AUTH_TOKEN` | Sentry → Settings → Auth Tokens | Keep secret — used to upload source maps at build time |
| `SENTRY_ORG` | Your org slug in the Sentry URL | e.g. `my-company` |
| `SENTRY_PROJECT` | Your project slug in Sentry | e.g. `stonesuppliers` |

Add all four to Vercel → Settings → Environment Variables for Production and Preview.

### Setting Up a Sentry Project

1. Sign up or log in at [sentry.io](https://sentry.io)
2. Create a new project → select **Next.js** as the platform
3. Copy the DSN from the onboarding page (or Settings → Client Keys)
4. Create an auth token at Settings → Account → API → Auth Tokens → scope: `project:releases` and `org:read`
5. Add all four env vars to `.env.local` and Vercel

---

## Testing Sentry

### Dedicated test endpoint: `/api/test-error`

Active in `development` and `preview` environments only — returns 404 in production.

**1. Start the dev server**
```bash
npm run dev
```

**2. Trigger a test error**
```bash
curl http://localhost:3000/api/test-error
```

**3. Verify in Sentry**
Open your Sentry project dashboard. Within 10–30 seconds you should see an event titled:
> `Error: Sentry test error — intentionally thrown to verify event ingestion`

It will include:
- The full stack trace pointing to `test-error/route.ts`
- The runtime environment (`nodejs`)
- The URL and HTTP method

If you don't see it after 60 seconds, check:
- Is `NEXT_PUBLIC_SENTRY_DSN` set in `.env.local`?
- Is the DSN the correct format: `https://<key>@<org>.ingest.sentry.io/<project-id>`?
- Are there any errors in the Next.js terminal output?

---

## Testing Rate Limiting

### Dedicated test endpoint: `/api/test-rate-limit`

Active in `development` and `preview` environments only. Shares the exact same `ratelimit` instance as the real email routes, so this confirms the limiter is working end-to-end.

**Prerequisite:** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` must be set in `.env.local`.

**Run the test (one-liner — fires 7 requests and prints each HTTP status code):**
```bash
for i in {1..7}; do
  echo -n "Request $i: "
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/test-rate-limit
done
```

**Expected output:**
```
Request 1: 200
Request 2: 200
Request 3: 200
Request 4: 200
Request 5: 200
Request 6: 429
Request 7: 429
```

**To see the full JSON response (remaining count, reset time):**
```bash
curl http://localhost:3000/api/test-rate-limit
```
```json
{
  "allowed": true,
  "limit": 5,
  "remaining": 4,
  "resetAt": "2026-03-13T10:32:00.000Z"
}
```

After being rate limited:
```json
{
  "allowed": false,
  "limit": 5,
  "remaining": 0,
  "resetAt": "2026-03-13T10:32:00.000Z"
}
```

**To reset the counter between test runs**, open the Upstash console → Data Browser → find the key `stonesuppliers:ratelimit:127.0.0.1` → delete it. The next request will start a fresh window.

### Why a dedicated test endpoint instead of hitting `/api/resend` directly?

Hitting the real email endpoint to test rate limiting would attempt to send actual emails on each of the first 5 requests. The test endpoint shares the same rate limiter instance but has no side effects — it just checks and returns the limiter state.

---

## Architecture Diagram

```
Request arrives
      │
      ▼
ratelimit.limit(ip)
      │
      ├── allowed ──► continue to handler
      │
      └── denied ───► 429 Too Many Requests
                      (state stored in Upstash Redis,
                       shared across all Vercel instances)

Unhandled error occurs anywhere in the app
      │
      ▼
Sentry.captureException(error)   ← error.tsx (client)
      │                          ← server via instrumentation.ts
      ▼
Sentry dashboard → alert → email/Slack
```
