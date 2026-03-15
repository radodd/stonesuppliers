# Stone Suppliers — Architectural Analysis

> **Date:** March 12, 2026
> **Codebase:** stonesuppliers.net (Next.js App Router, Supabase, Vercel)
> **Branch:** staging

---

## 1. System Overview

**Stone Suppliers** is a B2B customer-facing web catalog and contact/quote request platform for stone and landscaping material suppliers. It is not a transactional e-commerce site — no payment processing exists. The "cart" is a quote-request builder that ends in a contact form submission.

### Core User Flows

1. **Browse Materials** → Filter by category, company, color, texture, size → View material detail
2. **Request Quote** → Add materials to cart → Submit contact form → Email delivered via Resend
3. **Learn About Company** → About / Services pages (static content)
4. **Contact** → Standalone contact form

### Major Subsystems

| Subsystem | Purpose |
|-----------|---------|
| Materials Catalog | Browse, filter, and detail-view products from Supabase |
| Quote Cart | Client-side cart (Context + localStorage) to aggregate material requests |
| Contact / Email | Form → API route → Resend → stakeholder inbox |
| Navigation | Desktop nav + mobile hamburger drawer with 3-level drill-down |
| SEO | Schema.org structured data (LocalBusiness, Organization, WebSite) |
| Analytics | Google Analytics 4 event tracking |

### External Services

- **Supabase** — PostgreSQL database + file storage for material images
- **Resend** — Transactional email (quote/contact form delivery)
- **Vercel** — Hosting, edge network, CI/CD
- **Google Analytics 4** — Usage tracking
- **Google Fonts** — Inter, Open Sans, Montserrat, Roboto

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Client Components                              │  │
│  │  - MaterialGridSection (fetch + filter + display)    │  │
│  │  - ContactForm / MaterialDetailForm                  │  │
│  │  - CustomerFacingNav (mobile sheet drawer)           │  │
│  │  - CartContext (localStorage + LZ-String)            │  │
│  │  - FilterContext (dual-state staging/commit)         │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                         │ fetch()                           │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                  Next.js Server (Vercel Edge)                │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Server Components (SSR composition)               │    │
│  │  - Root layout (SEO schemas, providers)            │    │
│  │  - Page routes (data composition shells)           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  API Route Handlers                                │    │
│  │  GET  /api/materials        → Supabase query       │    │
│  │  GET  /api/materials/[slug] → Supabase query       │    │
│  │  POST /api/resend           → Email send           │    │
│  └──────────────┬─────────────────────┬───────────────┘    │
└─────────────────┼─────────────────────┼────────────────────┘
                  │                     │
     ┌────────────▼───────┐   ┌────────▼──────────┐
     │  Supabase          │   │  Resend API        │
     │  (PostgreSQL)      │   │  (email delivery)  │
     │  - Materials       │   └───────────────────┘
     │  - Categories      │
     │  - Sizes           │
     │  - Storage (imgs)  │
     └────────────────────┘
```

**Data Flow — Materials:**
```
Supabase → /api/materials (transform to DTO, cache 1hr) →
MaterialGridSection (fetch on mount) → filterMaterials() →
MaterialCard grid
```

**Data Flow — Quote Request:**
```
MaterialDetailForm → CartContext → localStorage (LZ-String compressed) →
ContactForm → /api/resend → ReactDOMServer.renderToString(EmailTemplate) →
Resend API → stakeholder email
```

---

## 3. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.0.10 |
| **Language** | TypeScript (`strict: false`) | 5.6.2 |
| **Styling** | Tailwind CSS + SCSS modules | 3.4.1 |
| **Animations** | Framer Motion | 11.2.10 |
| **UI Library** | shadcn/ui + Radix UI | — |
| **Forms** | React Hook Form + Zod | 7.51.4 / 3.23.8 |
| **State** | React Context API | — |
| **Data Fetching** | Native `fetch()` | — |
| **Data Cache** | TanStack React Query (installed, unused) | 5.36.2 |
| **Database** | Supabase (PostgreSQL) | 2.45.4 |
| **Database ORM** | None (Prisma installed but unused) | — |
| **Email** | Resend | 4.0.0 |
| **Analytics** | Google Analytics 4 | — |
| **Hosting** | Vercel | — |
| **CI/CD** | Vercel Git integration | — |
| **Fonts** | Google Fonts | — |

---

## 4. Core Architectural Patterns

### Server / Client Boundaries

- **Server:** Root layout, page route shells, API route handlers
- **Client:** Navigation, material grid, forms, cart, filter UI
- Pattern is mostly **client-heavy**: data is fetched in `useEffect` on the client after hydration, not at the server-render phase

### API Layer

- 3 thin route handlers in `src/app/api/`
- No middleware, no auth guards
- Each handler directly imports `supabaseServer` and queries the DB inline — no service/repository layer

### Data Access

- Direct Supabase JS client calls in API routes
- Raw query results transformed into flat DTOs inside the route handlers (no separate DTO/transformer layer)
- No Prisma schema despite `@prisma/client` being installed

### State Management

- **CartContext** — localStorage-persisted with LZ-String compression
- **FilterContext** — dual-state (staged vs committed filters) with localStorage persistence
- No global UI state library; no server state caching

### File Structure Conventions

```
src/
├── app/                      # Next.js routes (App Router)
│   ├── api/                  # Route handlers
│   └── (customerFacing)/     # Customer page routes + nested sections
├── components/               # Shared React components
│   ├── ui/                   # shadcn primitives
│   ├── sections/             # Page-specific section components
│   ├── form/                 # Form components
│   ├── navigation/           # Nav components
│   ├── SEO/                  # Schema.org components
│   ├── icons/                # SVG React components
│   └── scss/                 # SCSS module files
├── context/                  # React Context providers
├── data/                     # Static content constants
├── lib/                      # Utilities, hooks, clients
└── types/                    # TypeScript interfaces
```

---

## 5. Strengths

1. **Clean monorepo consolidation** — Recent refactor (March 2026) successfully merged Express API + Next.js frontend into a single unified app; removed ~1,000 lines of dead code
2. **Proper server/client split** — API routes handle all Supabase access server-side; no database credentials exposed to browser
3. **Strong form validation** — React Hook Form + Zod provides declarative, testable validation with good UX
4. **Good SEO foundation** — Schema.org structured data (LocalBusiness, Organization, WebSite), sitemap.xml, canonical URLs
5. **Sensible caching headers** — `/api/materials` uses `s-maxage=3600, stale-while-revalidate=86400` for efficient CDN caching
6. **Component organization** — Clear separation: `sections/` vs `components/ui/` vs `form/` vs `navigation/`
7. **Filter UX pattern** — Dual-state staged/committed filters prevent jarring grid updates on mobile
8. **Performance-indexed schema** — Supabase migration includes GIN indices on ARRAY columns and B-tree indices on FK columns
9. **Vercel deployment** — Zero-config CI/CD with automatic preview deploys

---

## 6. Weaknesses / Technical Debt

### Critical

| Issue | Location | Risk |
|-------|----------|------|
| `.env.local` committed to git | Repo root | **CRITICAL** — Supabase service role key, Resend API key, and GA ID are all exposed in git history |
| No `.env.example` file | Repo root | New developer onboarding blocked; no documented variable requirements |
| Hardcoded developer email | `src/app/api/resend/route.ts` | Production emails route to a developer's personal/agency address |
| Hardcoded base URL | `src/data/` files | References `mrc-two.vercel.app` — a stale preview URL used in production context |
| TypeScript strict mode disabled | `tsconfig.json` | `strict: false` + `ignoreBuildErrors: true` means type bugs reach production silently |

### Architectural

| Issue | Location | Impact |
|-------|----------|--------|
| No service/repository layer | All API routes | Business logic, DB queries, and DTO transformation are co-located in route handlers; hard to test, hard to reuse |
| React Query installed but never used | `src/components/Providers.tsx` | Dead dependency; data fetching uses raw `fetch()` with no caching, deduplication, or stale management |
| Prisma installed but no schema | `package.json` | Dead dependency; creates confusion about which ORM is canonical |
| Client-side data fetching for materials | `MaterialGridSection.tsx` | Loads the full materials list every page visit inside `useEffect`; no RSC or SSG optimization |
| Duplicate slug generation logic | Nav + route files | Slug creation algorithm duplicated across at least 2 locations |
| Cart items identified by array index | `src/context/CartContext.tsx` | Removing item A shifts index of item B; concurrent modifications are error-prone |
| No `generateStaticParams` for material detail | `src/app/(customerFacing)/materials/[slug]/` | Dynamic pages not pre-rendered; every visit triggers a cold SSR + Supabase fetch |
| Mixed styling systems | Entire codebase | Tailwind CSS + SCSS modules + Framer Motion + inline styles coexist without clear conventions |
| 4 Google Fonts loaded at root | `src/app/layout.tsx` | Inter, Open Sans, Montserrat, Roboto all loaded; many likely unused on most pages |

### Minor

- No `error.tsx` files in any route segment — crashes show the default Next.js error page with no recovery UI
- No `loading.tsx` files — no skeletal loading states; components flash empty then populate
- No input sanitization before email rendering (XSS vector if ReactDOMServer templates include unsanitized user text)
- SCSS files use deprecated `@import` syntax (silenced via `sassOptions.silenceDeprecations`)
- Navigation material list is hardcoded in `src/data/materialData.ts`; adding a product to the DB does not update the nav

---

## 7. Performance Risks

| Risk | Severity | Detail |
|------|----------|--------|
| Full catalog client fetch | High | `MaterialGridSection` fetches all materials on every mount via `useEffect`; no pagination, no SSG, no ISR for the materials list page |
| No `generateStaticParams` | High | Each `/materials/[slug]` page hits Supabase at SSR time; N materials = N cold DB queries across users |
| 4 Google Fonts via CDN | Medium | All 4 fonts loaded from Google CDN on every page; swap to local `next/font` to eliminate render-blocking requests |
| No image optimization for `public/` | Medium | 67 subdirectories of product images in `public/`; no lazy loading hints or blur placeholders configured |
| Client-side only filtering | Medium | `filterMaterials()` runs in browser on every checkbox toggle across potentially hundreds of records |
| No Suspense boundaries | Medium | No streaming SSR; entire page blocks on the slowest server-rendered component |
| LZ-String cart serialization | Low | Cart compressed/decompressed on every read; negligible at current scale but adds synchronous CPU work |

---

## 8. Security Concerns

| Concern | Severity | Detail |
|---------|----------|--------|
| `.env.local` in git | **Critical** | Supabase `SERVICE_ROLE` key (bypasses RLS) + Resend API key are committed; rotate both |
| Supabase service role used for all queries | High | `supabaseServer.ts` uses the SERVICE_ROLE key globally; if this key leaks, all RLS policies are bypassed |
| No input sanitization | High | Contact form values are rendered directly into HTML email via `ReactDOMServer.renderToString`; XSS possible if any field renders raw HTML |
| No RBAC or authentication | High | All API routes are public with no auth checks; `/api/resend` can be spam-abused without rate limiting |
| No rate limiting on `/api/resend` | High | Email endpoint is open to abuse; could trigger Resend quota exhaustion or spam |
| Supabase anon key client-visible | Medium | `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` are client-visible by design, but combined with service role key exposure, the entire DB is accessible |
| No Content Security Policy | Medium | No CSP headers configured; XSS would be unmitigated |
| No CORS restriction in route handlers | Low | API routes accept requests from any origin; production should restrict to the app's own domain |

---

## 9. Scalability Limitations

| Limitation | Impact | Threshold |
|------------|--------|-----------|
| All-or-nothing materials fetch | Degrades on catalog growth | ~500+ products will make the API response and client-side filter noticeably slow |
| No client-side data cache | Each browser session re-fetches | API CDN cache helps (1hr TTL), but client-side has no SWR / React Query cache |
| No job queue for emails | Resend failures are silent | If Resend is down, quote request is lost with no retry mechanism |
| Single Supabase instance | Single point of failure | No read replicas; all queries hit the primary |
| No pagination | Linear memory growth | Materials array loaded entirely into client memory on every page load |
| Static nav material list | Manual maintenance bottleneck | Adding new materials to DB requires a code deploy to update navigation menus |
| Context API for cart/filters | Not suited for high complexity | Context re-renders all consumers; fine for current scope, but will degrade with more consumers |

---

## 10. Refactor Roadmap

### Phase 1 — Stability & Security (Immediate)

- [ ] ~~**Rotate compromised secrets**~~ — **DEFERRED:** Revoke and regenerate Supabase service role key and Resend API key; purge from git history. Do this in a dedicated, separate session.
- [ ] **Create `.env.example`** — Document all required environment variables with placeholder values
- [ ] **Move all hardcoded config to env** — `FROM_EMAIL`, `BASE_URL`, `CORS_ALLOWED_ORIGINS`
- [ ] **Add rate limiting to `/api/resend`** — Use Vercel's rate limiting middleware or upstash/ratelimit
- [ ] **Enable TypeScript strict mode** — Remove `"strict": false` and `"ignoreBuildErrors": true`; fix resulting type errors
- [ ] **Add input sanitization** — Sanitize contact form fields before rendering into email HTML
- [ ] **Remove dead dependencies** — Prisma (`@prisma/client`, `prisma`, `prettier-plugin-prisma`) since no Prisma schema exists

### Phase 2 — Data Layer & Performance

- [ ] **Add `generateStaticParams` for material detail pages** — Pre-render all `/materials/[slug]` at build time using Supabase data
- [ ] **Add ISR to the materials list page** — Use `fetch()` with `{ next: { revalidate: 3600 } }` in a Server Component instead of client-side `useEffect`
- [ ] **Activate React Query** — Replace raw `fetch()` in `MaterialGridSection` with `useQuery` for client-side caching, deduplication, and stale management
- [ ] **Extract service layer** — Create `src/services/materialsService.ts` with typed functions; API routes call the service, not Supabase directly
- [ ] **Add pagination to `/api/materials`** — Accept `?page=` and `?pageSize=` query params; return metadata for client-side pagination
- [ ] **Switch Google Fonts to `next/font`** — Eliminate render-blocking font requests; use local font optimization

### Phase 3 — Architecture & Developer Experience

- [ ] **Create a Supabase client factory** — Single `createClient()` in `src/lib/supabase.ts` used everywhere; avoid per-module initialization
- [ ] **Normalize nav material list** — Fetch navigation materials from Supabase at build time (or edge config) instead of hardcoding in `materialData.ts`
- [ ] **Add `error.tsx` and `loading.tsx`** — Route-level error boundaries and skeleton loading states for all major routes
- [ ] **Fix cart item identity** — Replace array-index cart removal with stable IDs (e.g., `${materialId}:${category}:${size}`)
- [ ] **Consolidate slug generation** — Create single `src/lib/slugify.ts` utility; eliminate duplicated logic across nav and route files
- [ ] **Add CSP headers** — Configure `next.config.mjs` with a `headers()` function for Content-Security-Policy
- [ ] **Adopt `use server` Server Actions** — Replace the `/api/resend` route handler with a typed Server Action for the contact form; eliminates unnecessary HTTP round-trip

---

## 11. Open Architectural Questions

1. **Should business logic live in API routes or a service layer?**
   Currently all logic is inline in route handlers. A `src/services/` layer would decouple DB access from HTTP concerns and enable testability.

2. **Should Supabase Storage images move to a CDN-backed domain?**
   Currently images are served via signed Supabase URLs with a single remote pattern. A CDN (Cloudflare Images, Cloudinary) would provide resizing, format conversion, and edge caching.

3. **Should the navigation material list be DB-driven or stay static?**
   Static data in `materialData.ts` requires a code deploy to add a product to nav. DB-driven nav (via `generateStaticParams` + ISR) would decouple content from code.

4. **Should the cart/quote workflow persist server-side?**
   Today, quotes are ephemeral localStorage state. A submitted quote could be persisted to Supabase for auditing, re-quoting, and CRM integration.

5. **Is Supabase Auth needed?**
   No auth exists today. If an admin dashboard (inventory management, quote tracking) is planned, Supabase Auth + RBAC policies are already available in the existing Supabase project.

6. **Should SCSS modules be migrated to Tailwind-only?**
   Mixed styling (20 SCSS files + Tailwind + Framer Motion) creates maintenance overhead. Committing to Tailwind-only would simplify theming and reduce context-switching.

7. **Should a message queue be introduced for email delivery?**
   Synchronous Resend calls in the API route mean failed emails are lost silently. A simple queue (Inngest, Upstash QStash) would provide retries and observability.

---

## Critical Files Reference

| File | Role |
|------|------|
| [src/app/layout.tsx](src/app/layout.tsx) | Root layout, providers, SEO schemas, GA |
| [src/app/(customerFacing)/layout.tsx](src/app/(customerFacing)/layout.tsx) | Customer layout, nav, footer |
| [src/app/api/materials/route.ts](src/app/api/materials/route.ts) | Materials list API (DTO transform, cache) |
| [src/app/api/resend/route.ts](src/app/api/resend/route.ts) | Email send API |
| [src/lib/supabaseServer.ts](src/lib/supabaseServer.ts) | Supabase server client (service role) |
| [src/context/CartContext.tsx](src/context/CartContext.tsx) | Cart state, localStorage persistence |
| [src/context/FilterContext.tsx](src/context/FilterContext.tsx) | Filter state, dual-stage pattern |
| [src/lib/filterMaterials.ts](src/lib/filterMaterials.ts) | AND/OR filter logic engine |
| [src/data/carouselData.ts](src/data/carouselData.ts) | Static landing page content |
| [src/data/materialData.ts](src/data/materialData.ts) | Hardcoded nav material list |
| [next.config.mjs](next.config.mjs) | Image domain, Turbopack SVG, ignored TS errors |
| [tsconfig.json](tsconfig.json) | TypeScript config (`strict: false`) |
| [supabase/migrations/](supabase/migrations/) | DB schema and performance indices |
| `.env.local` | **COMPROMISED** — rotate all secrets in a dedicated session |
