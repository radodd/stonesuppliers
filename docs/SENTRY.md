# Sentry Error Monitoring

A complete reference for how Sentry is integrated into this project.

---

## Why Sentry

Before Sentry, every `console.error(error)` call in the app was a silent production failure — visible only if a developer had DevTools open at that exact moment. Errors on a visitor's phone at 3am were invisible.

Sentry replaces that with:

- **Full stack traces** decoded back to original TypeScript lines (via source maps)
- **Session Replay** — a 60-second video-like recording of what the user did before the crash
- **Performance traces** — how long each page, query, and Server Action takes
- **Alerts** — Slack/email notification the first time a new error type appears
- **Error grouping** — see how many users hit the same bug, not 1,000 separate entries

The visitor experience is unchanged. The "Something went wrong" page still appears. Sentry works silently in the background.

---

## Architecture — 3 Runtimes, 3 Config Files

Next.js runs code in three distinct runtimes. Each gets its own Sentry init:

| Runtime | When it runs | Config file |
|---|---|---|
| **Node.js** | Server Components, API Routes, Server Actions | `sentry.server.config.ts` |
| **Edge** | Middleware, Edge API routes | `sentry.edge.config.ts` |
| **Browser** | Client Components, browser JS | `sentry.client.config.ts` |

A fourth file, `src/instrumentation.ts`, is the Next.js startup hook that loads the correct server/edge config before the first request is handled.

A fifth file, `src/instrumentation-client.ts`, is the browser-side equivalent — it initialises the client config and hooks into Next.js router transitions.

---

## Config Files

### `sentry.server.config.ts`
Initialises Sentry for the Node.js runtime. Features enabled:
- Performance tracing (`tracesSampleRate`)
- Log forwarding (`enableLogs: true`) — `console.log/warn/error` calls are forwarded to Sentry
- PII collection (`sendDefaultPii: true`) — includes IP addresses and user-agent strings

### `sentry.edge.config.ts`
Same config as server, for the Edge runtime (middleware, edge routes).

### `sentry.client.config.ts`
Initialises Sentry in the browser. Additional features:
- **Session Replay** — records 10% of all sessions, 100% of sessions that contain an error
- Router transition capture via `onRouterTransitionStart`

### `src/instrumentation.ts`
Next.js 15 startup hook. Loads the correct Sentry config at server boot:
```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') await import('../sentry.server.config');
  if (process.env.NEXT_RUNTIME === 'edge') await import('../sentry.edge.config');
}

// Automatically captures all server-side request errors without manual try/catch
export const onRequestError = Sentry.captureRequestError;
```

### `src/instrumentation-client.ts`
Browser-side startup hook. Loads `sentry.client.config.ts` and captures router transitions as performance spans.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Yes | The ingest URL. Safe to expose publicly — it's an ingest endpoint, not a secret. All 5 Sentry files read from this. |
| `SENTRY_AUTH_TOKEN` | Build-time only | Used by `withSentryConfig` to upload source maps to Sentry during `npm run build`. Keep this private — add to Vercel env vars, not committed to git. |

### Getting `SENTRY_AUTH_TOKEN`
1. Go to [sentry.io](https://sentry.io) → Settings → Auth Tokens → Create New Token
2. Required scopes: `project:releases`, `org:read`
3. Add to `.env.local` and Vercel → Settings → Environment Variables (Production + Preview)

---

## Build Integration — `next.config.mjs`

The entire Next.js config is wrapped with `withSentryConfig()`:

```typescript
withSentryConfig(nextConfig, {
  org: "personal-projects-is",
  project: "javascript-nextjs",
  tunnelRoute: "/monitoring",       // Routes Sentry traffic through Next.js to bypass ad-blockers
  widenClientFileUpload: true,      // Uploads larger source map coverage
  silent: !process.env.CI,         // Suppresses output unless running in CI
  webpack: {
    automaticVercelMonitors: true,  // Auto-wraps Vercel Cron jobs with Sentry monitors
    treeshake: { removeDebugLogging: true }, // Strips Sentry debug logs from production bundle
  },
})
```

**Source maps:** `withSentryConfig` automatically uploads source maps to Sentry during build (requires `SENTRY_AUTH_TOKEN`). The maps are then deleted from the public bundle so minified code is not exposed.

**Tunnel route:** All browser requests to `https://*.sentry.io` are instead sent to `/monitoring` on your own domain. This avoids ad-blockers that block third-party tracking endpoints.

---

## Error Boundaries

Next.js has two levels of error boundary:

| File | Scope | What it catches |
|---|---|---|
| `src/app/global-error.tsx` | Entire app | Crashes in the root layout (rare — layout-level failures) |
| `src/app/(customerFacing)/error.tsx` | All customer-facing routes | Crashes in any page under `/materials`, `/contact`, `/about`, `/services` |

Both call `Sentry.captureException(error)` inside a `useEffect`. The error boundary's JSX (the "Something went wrong" UI) is shown to the visitor regardless — `captureException` is invisible to the user and just sends the error data to Sentry.

---

## Testing in Dev

**Verify the connection:**
1. Start dev server: `npm run dev`
2. Hit: `http://localhost:3000/api/test-error`
3. Check your [Sentry Issues dashboard](https://sentry.io/issues/) — the event should appear within 30 seconds

**Verify source maps (production build):**
```bash
npm run build
```
Look for `Sentry: Uploaded source maps` in build output. Then open a Sentry event and confirm the stack trace shows your original TypeScript lines, not minified bundle code.

---

## Sampling Rates

| Config | Setting | Meaning |
|---|---|---|
| `tracesSampleRate` | `1.0` in dev, `0.1` in production | % of requests that generate a performance trace |
| `replaysSessionSampleRate` | `0.1` | 10% of all browser sessions are recorded |
| `replaysOnErrorSampleRate` | `1.0` | 100% of sessions that contain an error are recorded |

Performance traces have a cost (Sentry quota). `tracesSampleRate: 1` in production means every single request generates a trace — fine for low traffic, but reduce to `0.1` once the site is live.

---

## Production Checklist

Before going live:

- [ ] `NEXT_PUBLIC_SENTRY_DSN` added to Vercel Production env vars
- [ ] `SENTRY_AUTH_TOKEN` added to Vercel Production env vars
- [ ] Run `npm run build` and confirm source map upload succeeds
- [ ] Trigger a test error on staging → confirm it appears in Sentry dashboard
- [ ] Confirm `/api/test-error` returns 404 in production (it's gated by `NODE_ENV === "production"`)
- [ ] Review `sendDefaultPii: true` with client — this sends visitor IP addresses to Sentry (may require GDPR/privacy policy update)
- [ ] Consider lowering `tracesSampleRate` from `1.0` to `0.1` once real traffic begins

---

## Sentry Dashboard Links

- **Issues:** https://personal-projects-is.sentry.io/issues/?project=4508184429920256
- **Performance:** https://personal-projects-is.sentry.io/performance/?project=4508184429920256
- **Replays:** https://personal-projects-is.sentry.io/replays/?project=4508184429920256
