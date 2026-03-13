# Refactoring: Monorepo → Single Next.js App

**Date:** March 2026
**Branch:** `staging`

---

## Overview

The project was originally structured as a monorepo with two separate applications:

- `api/` — Express.js server (3 active endpoints)
- `frontend/` — Next.js 14 app

Deployment via `vercel.json` routed `/api/*` to Express and `/*` to the Next.js frontend. This refactor eliminated Express entirely, collapsed the project into a single flat Next.js 16 app at the repo root, and removed ~1,000 lines of dead code.

---

## Phase 1: Express API → Next.js Route Handlers

**Why:** Express served only 3 live endpoints. All were thin wrappers around Supabase queries with no authentication, no complex middleware, and no reason to exist as a separate process.

### New files created

| File | Replaces |
|------|----------|
| `src/app/api/materials/route.ts` | `GET /api/materials` (Express) |
| `src/app/api/materials/[slug]/route.ts` | `GET /api/materials/slug/:slug` (Express) |
| `src/app/api/resend/route.ts` | `POST /api/resend` (Express) |
| `src/lib/supabaseServer.ts` | `api/src/supabaseClient.ts` |
| `src/lib/getMaterialBySlug.ts` | Previously broken/missing utility |

### Key changes
- All DTO transformation logic (`toListDTO`, `toDetailDTO`, `transformCategories`) ported verbatim from `api/src/controllers/materials.ts`
- Cache headers preserved: `s-maxage=3600, stale-while-revalidate=86400`
- URL path change: old Express route was `/api/materials/slug/:slug`, new route is `/api/materials/:slug` (no `slug` literal segment)
- Removed `NEXT_PUBLIC_BASE_URL` prefix from all fetch calls — same-origin requests no longer need it
- Removed `credentials: "include"` and `Origin` header from fetch calls (no longer cross-origin)
- Updated `params` to be a `Promise<{ slug: string }>` per Next.js 15/16 requirement

### Files updated
- `src/components/ProductGridSection.tsx` — fetch URL
- `src/app/(customerFacing)/materials/[slug]/page.tsx` — fetch URL + `use(params)`
- `src/app/(customerFacing)/materials/[slug]/layout.tsx` — fixed broken import + `await params`
- `src/components/form/apiClient.tsx` — fetch URL

### Deleted
- Entire `api/` folder

---

## Phase 2: Consolidate `frontend/` to Repo Root

**Why:** `frontend/node_modules/next` (v14) and root `node_modules/next` (v16) conflicted, causing Turbopack panics. The structural split served no purpose once Express was gone.

### Files moved
| From | To |
|------|----|
| `frontend/src/` | `src/` |
| `frontend/public/` | `public/` |
| `frontend/css/` | `css/` |
| `frontend/tailwind.config.ts` | `tailwind.config.ts` |
| `frontend/package.json` | `package.json` (consolidated) |
| `frontend/tsconfig.json` | `tsconfig.json` (consolidated) |

### Config changes

**`package.json`** — merged into one:
- Dropped: `express`, `cors`, `ejs`, `pg-promise`, `envalid`, `nodemon`, `concurrently`, `@types/express`, `@types/cors`
- Scripts reduced to: `dev`, `build`, `start`, `lint`, `clean`, `generate-slugs`

**`next.config.js` → `next.config.mjs`** — converted to ESM (`export default`) because `package.json` has `"type": "module"`. Added:
- `turbopack.rules` — replaces the old `webpack()` SVG config for `@svgr/webpack`
- `sassOptions.silenceDeprecations: ["import"]` — suppresses Sass `@import` deprecation across 19 SCSS files

**`tsconfig.json`** — unified paths:
```json
"paths": {
  "@/*": ["src/*"],
  "@/components/*": ["src/components/*"],
  "@/scss/*": ["src/components/scss/*"]
}
```

**`vercel.json`** — replaced complex monorepo config with:
```json
{ "framework": "nextjs" }
```

### Other fixes during Phase 2
- `src/data/index.ts` created — the old root `index.ts` (data constants) was moved here; all 7 files importing via `../../../../..` were updated to use `@/data`
- `.claude/settings.local.json` `additionalDirectories` path updated to reflect new location

### Deleted
- `frontend/` folder (empty after move)
- Old root `index.ts`, `tsconfig.tsbuildinfo`, `pnpm-lock.yaml`, stale `.next/`

---

## Phase 3: Dead Code Cleanup

~1,000 lines of unused components removed.

### Files deleted

| File | Reason |
|------|--------|
| `src/components/Nav.tsx` | Never imported anywhere |
| `src/components/CustomerFacingNav.tsx` | Superseded by `CustomerFacingNav2.tsx` |
| `src/components/ProductFilters.tsx` | Superseded by `ProductFilters2.tsx` |
| `src/components/ToastModal.tsx` | Never imported; shadcn Toaster used instead |
| `src/components/ToastModalMaterialDetail.tsx` | Never imported |
| `src/lib/product-validator.ts` | Never imported |

### Import fix
`CustomerFacingNavLink` was exported from both `CustomerFacingNav.tsx` and `CustomerFacingNav2.tsx`. `layout.tsx` was importing from the (now deleted) `CustomerFacingNav.tsx` — updated to import from `CustomerFacingNav2.tsx`.

### Commented-out code removed
- `src/app/(customerFacing)/layout.tsx` — old ID-based `handleMaterialDetail`, commented Footer
- `src/components/CustomerFacingNav2.tsx` — old `window.location.href` routing logic
- `src/components/FilterDropDown.tsx` — unused props, old `handleCheckboxChange`, commented button

---

## Architecture: Before vs After

```
BEFORE
stonesuppliers/
├── api/                    ← Express server
│   ├── src/controllers/
│   ├── src/routes/
│   └── package.json        ← separate deps
├── frontend/               ← Next.js app
│   ├── src/
│   ├── public/
│   └── package.json        ← separate deps
├── index.ts                ← data constants (root level)
├── package.json            ← monorepo orchestrator
└── vercel.json             ← routes /api/* to Express, /* to frontend

AFTER
stonesuppliers/
├── src/
│   ├── app/
│   │   ├── api/            ← Next.js route handlers (replaced Express)
│   │   │   ├── materials/
│   │   │   ├── materials/[slug]/
│   │   │   └── resend/
│   │   └── (customerFacing)/
│   ├── components/
│   ├── data/               ← moved from root index.ts
│   └── lib/
├── public/
├── package.json            ← single consolidated deps
└── vercel.json             ← { "framework": "nextjs" }
```

---

## Next.js 16 Breaking Changes Addressed

| Change | Fix Applied |
|--------|-------------|
| `params` is now a `Promise` | `await params` in server components/route handlers; `use(params)` in client components |
| Turbopack enabled by default | Replaced `webpack()` SVG config with `turbopack.rules` |
| `module.exports` fails with `"type": "module"` | Renamed `next.config.js` → `next.config.mjs`, converted to `export default` |
| Sass `@import` deprecation errors | Added `sassOptions.silenceDeprecations: ["import"]` |

---

# Codebase Hardening

**Date:** March 2026
**Branch:** `staging`

Three phases of targeted improvements addressing security, performance, and architectural quality issues identified in the post-monorepo-collapse audit.

---

## Hardening Phase 1: Stability & Security

### TypeScript strict mode

`tsconfig.json` previously had `"strict": false` and `next.config.mjs` had `typescript: { ignoreBuildErrors: true }`. Both suppressed type errors silently in production builds.

**Changes:**
- `tsconfig.json`: `"strict": false` → `"strict": true`
- `next.config.mjs`: removed `typescript: { ignoreBuildErrors: true }` block entirely

**Type errors surfaced and fixed:**
| File | Error | Fix |
|------|-------|-----|
| `src/app/(customerFacing)/cart/page.tsx` | `string \| number` not assignable to `number` for `<input value>` | `parseInt(item?.quantity \|\| "1", 10)` |
| `src/components/MaterialGridSection.tsx` | `Dispatch<SetStateAction<Material[]>>` not assignable to `(list: { name: string }[]) => void` | Cast wrappers at callsites: `(list) => setProducts(list as Material[])` |
| `src/components/ui/carousel.tsx` (×6) | `number \| undefined` not assignable to `number` for icon width/height/color props | Made all three props optional with defaults in `CarouselNextIcon` and `CarouselPrevIcon` |
| `src/components/form/useContactForm.tsx` | `removeFromCart(index: number)` — index is `number` but signature requires `string` after cart refactor | `removeFromCart(item.cartId)` |
| `src/components/AlphabetizeButtons.tsx` | Missing typed props interface; `variant="filter"` not in shadcn Button union | Added full props interface; `variant="filter"` → `variant="ghost"` |
| `src/components/AlphabetizeRadio.tsx` | Missing typed props | Added typed props interface |
| `src/components/SliderAnimation.tsx` | `useRef` without type arg | `useRef<HTMLDivElement>(null)` + null guard |

### Security headers

`next.config.mjs` now exports a `headers()` function returning security headers for all routes (`source: "/(.*)"`) covering:

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | Restricts scripts to self + Google Analytics/GTM; disallows frames and objects |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disables camera, microphone, geolocation |

### Dead Prisma dependencies removed

Prisma was installed (`@prisma/client`, `prisma`, `prettier-plugin-prisma`) but no Prisma schema existed anywhere in the repo. Supabase JS client is the canonical data access layer.

```bash
npm uninstall @prisma/client prisma prettier-plugin-prisma
```

### Input sanitization on email

`src/lib/renderEmailHtml.tsx` renders user-submitted contact form values into HTML. Without sanitization, any HTML in a form field would render as markup in the email.

Added `stripHtml()` in `src/app/actions/sendEmail.ts` that strips all `<tag>` patterns before values reach the email renderer:

```typescript
function stripHtml(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").trim();
}
```

---

## Hardening Phase 2: Data Layer & Performance

### Service layer (`src/lib/materialsService.ts`)

Both API routes (`/api/materials` and `/api/materials/[slug]`) duplicated DTO types, Supabase query logic, and transformation functions (`toListDTO`, `toDetailDTO`, `transformCategories`).

Extracted into a single service module:

| Export | Description |
|--------|-------------|
| `getAllMaterials()` | Returns `MaterialListDTO[]` — full catalog |
| `getMaterialBySlug(slug)` | Returns `MaterialDetailDTO \| null` — single product |
| `getAllMaterialSlugs()` | Returns `string[]` — used by `generateStaticParams` |
| `MaterialListDTO` | Flat DTO for grid cards |
| `MaterialDetailDTO` | Full DTO with categories/sizes for detail page |
| `CategoryDTO` | `{ name: string; sizes: string[] }` |

API routes reduced from ~90–100 lines each to ~20–25 lines.

### `generateStaticParams` for material detail pages

`src/app/(customerFacing)/materials/[slug]/page.tsx` was a `"use client"` component that fetched its own data on mount. Every user visit triggered a cold SSR + Supabase query.

**Changes:**
- Converted `[slug]/page.tsx` to an async server component (removed `"use client"`, all `useState`/`useEffect`)
- Extracted client-only state and UI into `src/components/sections/materialDetailPage/MaterialDetailPageClient.tsx`
- Added `generateStaticParams()` — all slug pages pre-rendered at build time

```typescript
export async function generateStaticParams() {
  const slugs = await getAllMaterialSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

This eliminates per-request Supabase queries for all detail pages after build.

### ISR on materials list page

`src/app/(customerFacing)/materials/page.tsx` now fetches via the service at render time and revalidates every hour:

```typescript
export const revalidate = 3600;

export default async function MaterialsPage() {
  const rawMaterials = await getAllMaterials();
  // ... maps to Material[] and passes as initialProducts
}
```

`MaterialGridSection` accepts an optional `initialProducts` prop. When provided, the client-side `useEffect` fetch is skipped and loading state starts as `false`, eliminating the flash-empty-then-populate behavior.

### Slug utility consolidated (`src/lib/slugify.ts`)

The `toSlug()` function was duplicated inline in both `CustomerFacingNav.tsx` and `(customerFacing)/layout.tsx`.

Extracted to `src/lib/slugify.ts` — both files now import from there.

```typescript
export function toSlug(text: string): string {
  return text
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
```

---

## Hardening Phase 3: Architecture & Developer Experience

### Cart stable identity

`CartContext` previously identified items by array index. Removing item at index 0 shifted all other items' indices, making concurrent modifications error-prone.

**Changes to `src/context/CartContext.tsx`:**
- Added `cartId: string` field to `CartItem` interface
- `addToCart` now accepts `Omit<CartItem, "cartId">` and generates a stable ID: `[name, category, size, Date.now()].join(":")`
- `removeFromCart` changed from `(index: number)` to `(cartId: string)` — filters by `item.cartId !== cartId`
- Hydration migration: old localStorage items without `cartId` get backfilled with `legacy:${i}:${Date.now()}`

**Updated callsites:**
- `src/app/(customerFacing)/cart/page.tsx` — all quantity/delete handlers updated to use `cartId`
- `src/components/form/useContactForm.tsx` — `removeFromCart(item.cartId)` instead of index

### Error and loading boundaries

Added route-level `error.tsx` and `loading.tsx` files:

| File | Purpose |
|------|---------|
| `src/app/(customerFacing)/error.tsx` | `"use client"` error boundary for all customer routes; renders "Try again" + "Contact us" buttons; logs via `useEffect` |
| `src/app/(customerFacing)/loading.tsx` | Top-level skeleton loading state |
| `src/app/(customerFacing)/materials/loading.tsx` | Materials list loading state |
| `src/app/(customerFacing)/materials/[slug]/loading.tsx` | Detail page loading state |

### Server Action replaces `/api/resend` HTTP round-trip

`src/app/actions/sendEmail.ts` is a `"use server"` Server Action that replaces `POST /api/resend`. The contact form now calls it directly — no `fetch()` needed.

**`src/app/actions/sendEmail.ts` responsibilities:**
- IP-based rate limiting (5 req / 60 s window via module-level `Map`)
- `stripHtml()` sanitization on all form fields before email rendering
- Env var validation for `RESEND_FROM_EMAIL` / `RESEND_TO_EMAIL`
- Render email HTML via `renderEmailHtml`
- Send via Resend and return `{ success: boolean; error?: string }`

**`src/components/form/useContactForm.tsx`** updated:
- `import { sendFormData } from "../../lib/formApiClient"` → `import { sendEmail } from "@/app/actions/sendEmail"`
- `await sendFormData(payload)` → `await sendEmail(payload)`

**`src/lib/formApiClient.tsx`** deleted — the `fetch()` wrapper became dead code once the server action was wired.

### `ProductCardProps` circular dependency resolved

`MaterialDetailForm.tsx` imported `ProductCardProps` from `[slug]/page.tsx`. After converting that page to an async server component, this created a circular dependency risk (client component importing from a server module).

Moved `ProductCardProps` type and `toProductCardProps()` adapter into `MaterialDetailPageClient.tsx`, which is the canonical client boundary. `MaterialDetailForm` import updated accordingly.
