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
