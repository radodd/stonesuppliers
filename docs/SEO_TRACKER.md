# SEO, GSC & GBP Tracker — stonesuppliers.net

A living checklist for all SEO work, outstanding tasks, and key decisions.
Update this file as items are completed or new work is identified.

---

## Table of Contents

1. [GSC Performance Summary](#gsc-performance-summary)
2. [Completed SEO Updates](#completed-seo-updates)
3. [Site Audit Tooling](#site-audit-tooling)
4. [Pending — Code Changes](#pending--code-changes)
5. [Pending — Client Action Required](#pending--client-action-required)
6. [mrcrs.com Migration Plan](#mrcrscm-migration-plan)
7. [GBP Consolidation Plan](#gbp-consolidation-plan)
8. [Ongoing Monitoring](#ongoing-monitoring)

---

## GSC Performance Summary

**Period:** Dec 14, 2025 – Mar 13, 2026 (last 3 months)
**Data source:** Google Search Console → Performance → Web

| Metric | Value |
|--------|-------|
| Total Clicks | 283 |
| Total Impressions | ~5,577 |
| Avg CTR | ~5.1% |
| Avg Position | ~4.1 |
| Trend | Positive — March outperforming prior months |

### Top Pages by Clicks
| Page | Clicks | Impressions | CTR | Avg Position |
|------|--------|-------------|-----|--------------|
| /services | 235 | 4,218 | 5.57% | 3.98 |
| / (homepage) | 26 | 1,411 | 1.84% | 5.46 |
| /about | 9 | 1,019 | 0.88% | 7.17 |
| /contact | 8 | 932 | 0.86% | 11.17 |
| /materials | 3 | 226 | 1.33% | 15.35 |
| /materials/mojave | 3 | 216 | 1.39% | 6.45 |
| /materials/topanga | 0 | 10 | 0% | 6.80 |

### Key Observations
- **83% of all clicks come from /services** — over-concentration risk
- **/materials sits at position 15.35** (page 2) — effectively invisible
- **"gravel" — 100 impressions, 0 clicks, position 2.4** — meta description failing to convert
- **"santa paula decorative concrete" — 95 impressions, 0 clicks, position 1.01** — ranking #1 but zero clicks, investigate
- **"near me" queries convert at 40–50% CTR** when the site appears — priority to increase impressions for these
- **Homepage CTR is 1.84% at position 5.46** — well below expected ~5–7% for that position
- **Device split: Mobile 52.7% / Desktop 47%** — site must be optimized for both
- **96.5% of clicks from US** — appropriate for local business

---

## Completed SEO Updates

### Homepage Metadata — `src/app/layout.tsx`
- [x] Title updated: `"MRC Rock & Sand"` → `"MRC Rock & Sand | Gravel, Sand & Aggregates — Santa Paula, CA"`
- [x] Description updated to include product keywords + location
- [x] OpenGraph title, description, and alt text updated to match
- [x] Twitter card title and description updated to match

### LocalBusiness Schema — `src/app/layout.tsx`
- [x] `@id` fixed: was empty string `""` → `"https://www.stonesuppliers.net/#localbusiness"`
- [x] `geo` coordinates added: `{ latitude: 34.3542, longitude: -119.0593 }`
- [x] `priceRange` added: `"$$"`
- [x] `areaServed` added: Santa Paula, Ventura, Oxnard, California
- [x] Street address corrected: `"1224 E Santa Clara St"` → `"1224 Santa Clara St"`
- [x] `sameAs` placeholder added (TODO comment) — awaiting client URLs

### Organization Schema — `src/app/layout.tsx`
- [x] `@id` added: `"https://www.stonesuppliers.net/#organization"`
- [x] `sameAs` placeholder added (TODO comment) — awaiting client URLs

### Sitemap — `src/app/sitemap.ts`
- [x] `/services` priority: 0.7 → 1.0 (reflects actual traffic importance)
- [x] `/` changeFrequency: `"yearly"` → `"monthly"`
- [x] `/materials` changeFrequency: `"monthly"` → `"weekly"` (products change)
- [x] `/about` priority: 0.8 → 0.7
- [x] `/contact` priority: 0.5 → 0.6

### Material Page Metadata — `src/app/(customerFacing)/materials/[slug]/layout.tsx`
- [x] Description fallback updated for all 3 instances (page, OG, Twitter)
  - Before: `"Explore our range of premium materials for your project"`
  - After: `"${material.name} available at MRC Rock & Sand and SPM Santa Paula Materials. Bulk supply of aggregates, gravel, and stone in Santa Paula, CA."`

---

## Site Audit Tooling

An automated headless browser audit script was added to catch regressions after deploys. It uses Playwright (Chromium) and crawls every URL from `/sitemap.xml`.

### Script location
`scripts/audit.ts`

### What it checks per page
1. **HTTP status** — flags any 4xx/5xx response
2. **Broken images** — detects `<img>` elements that failed to load (`naturalWidth === 0`)
3. **JS console errors** — collects `console.error` and unhandled exceptions on page load
4. **Interaction errors** — clicks every visible button at both desktop (1280px) and mobile (375px) viewports, collects any errors triggered by those clicks (e.g. React void-element errors from Sheets/Dialogs, form validation bugs)

### How to run

```bash
# Audit live site (production)
npm run audit

# Audit local dev server — required for full React error detail
npm run dev            # terminal 1
npm run audit:local    # terminal 2
```

> **Important:** `npm run audit:local` against `npm run dev` is what surfaces React component-level errors (like the `link is a void element` bug). React production build suppresses verbose dev-only errors — always use local dev for a thorough check after making component changes.

### ⚠️ Sitemap deployment dependency

The audit script uses the live `/sitemap.xml` as its source of URLs. The staging branch contains sitemap code changes that have **not yet been deployed to production**:

- The current live sitemap incorrectly includes `/cart` (should be excluded)
- Once deployed, the sitemap will also include all material slugs from Supabase (beyond just `/materials/mojave`)

**Do not rely on `npm run audit` as a complete check until the staging branch is deployed.** Use `npm run audit:local` in the meantime — the local dev server serves the correct updated sitemap.

### Last audit run — 2026-03-15 (live site, staging not yet deployed)

| Page | Status | Issues |
|------|--------|--------|
| / | FAIL | Interaction error: `Error fetching DATA` + `403` when nav buttons trigger materials fetch. Likely Cloudflare bot protection blocking headless browser API calls. |
| /about | PASS | — |
| /services | PASS | — |
| /contact | PASS | — |
| /cart | PASS | — (should not be in sitemap — excluded once staging deployed) |
| /materials | PASS | — |
| /materials/mojave | PASS | — |

**Homepage 403 / fetch error:** Triggered when clicking landing page buttons that navigate to `/materials` with filter state. The client-side Supabase fetch is being blocked with 403 in headless context — investigate whether Cloudflare rate limiting is also affecting real users on slower connections.

**Known unfixed bug (found manually, not yet caught by audit):** `link is a void element tag and must neither have children nor use dangerouslySetInnerHTML` — fired after clicking a button (likely in the mobile nav Sheet). Run `npm run audit:local` against dev server to pinpoint the component.

---

## Pending — Code Changes

- [ ] **Deploy staging branch to production** — sitemap changes, metadata overhaul, Sentry, GA4/GTM, and audit script are all on staging. Once deployed: resubmit sitemap in GSC, validate schema with Rich Results Test, and re-run `npm run audit` to confirm clean pass.
- [ ] **Add `sameAs` to LocalBusiness + Organization schemas** — blocked on client providing GBP and Yelp URLs (see TODO comments in `src/app/layout.tsx:96`)
- [ ] **Add `LocalBusiness` schema to `/services` page** — the highest-traffic page has no page-level schema. Should include `ServiceArea` and list of services offered.
- [ ] **Add `Product` schema to each `/materials/[slug]` page** — structured data for each material (name, description, image, brand). Could enable rich results in Google Shopping / product carousels.
- [ ] **Improve `/contact` page metadata** — position 11.17 is below page 1. Title and description need to target location-based queries.
- [ ] **Fix `LocalBusinessSchema.tsx` component** — currently uses `type="application/json"` instead of `type="application/ld+json"`. Component is not currently rendered (schema is inline in layout.tsx) but should be fixed or deleted to avoid confusion.
- [ ] **Submit updated sitemap to GSC** — after next deploy, go to GSC → Sitemaps → resubmit `https://www.stonesuppliers.net/sitemap.xml`
- [ ] **Validate schema with Rich Results Test** — use Google's Rich Results Test on homepage after deploy to confirm LocalBusiness schema is valid

---

## Pending — Client Action Required

- [ ] **Provide Google Business Profile URL** — needed for `sameAs` schema and to verify no duplicate listing exists
- [ ] **Provide Yelp listing URL** — needed for `sameAs` schema
- [ ] **Provide any other directory/social profile URLs** — Facebook, BBB, etc.
- [ ] **Provide cPanel access for mrcrs.com** — needed to set up 301 redirect (see plan below)
- [ ] **Confirm business hours** — currently listed as Mon–Fri 9am–5pm in schema. Client to verify.
- [ ] **Confirm both brand names are correct** — currently: primary `"MRC Rock & Sand"`, alternate `"SPM Santa Paula Materials"`. Verify this is accurate.

---

## mrcrs.com Migration Plan

**Status:** mrcrs.com is live, indexed by Google, and confirmed owned by client. Client has cPanel access. 301 redirect not yet implemented.

### Step 1 — Audit (done)
- [x] mrcrs.com confirmed live and indexed
- [x] Shows in Google Search for "mrcrs" query
- [x] Client confirmed domain ownership and cPanel access
- [ ] Check Google Maps — confirm whether mrcrs.com has a separate GBP listing/pin

### Step 2 — Set up 301 redirect on mrcrs.com
- [ ] Get cPanel login from client
- [ ] Add redirect rules in `.htaccess` (or cPanel Redirects tool):
  - `mrcrs.com` → `https://www.stonesuppliers.net` (301)
  - `www.mrcrs.com` → `https://www.stonesuppliers.net` (301)
- [ ] Test redirect is working in browser
- [ ] Verify redirect returns HTTP 301 (not 302) using curl or a header checker

### Step 3 — Monitor in GSC
- [ ] After redirect is live, watch GSC for mrcrs.com to deindex over 2–4 weeks
- [ ] Confirm stonesuppliers.net sees any ranking uplift from inherited link authority

---

## GBP Consolidation Plan

**Status:** Not yet confirmed whether two GBP listings exist. Client needs to provide GBP URL.

### Step 1 — Identify all listings
- [ ] Client provides their GBP URL (the one they actively manage)
- [ ] Search "MRC Rock & Sand Santa Paula" and "Santa Paula Materials" on Google Maps — document all pins found
- [ ] Determine if a second listing is attached to mrcrs.com

### Step 2 — Consolidate if duplicate exists
- [ ] Keep the listing with more reviews and activity
- [ ] Update the website field on the primary listing → `https://www.stonesuppliers.net`
- [ ] Request removal or merge of duplicate via Google Business Profile support
- [ ] Verify NAP consistency (Name, Address, Phone) exactly matches the website schema

### Step 3 — Update schema
- [ ] Once primary GBP URL is confirmed, add it to `sameAs` in `src/app/layout.tsx` (see TODO comment on line ~96)
- [ ] Deploy and verify via Rich Results Test

---

## Ongoing Monitoring

Suggested monthly checks in GSC:

| Check | What to look for |
|-------|-----------------|
| Performance → Pages | Is /services still dominant? Are material pages improving? |
| Performance → Queries | New zero-click, high-impression queries to address |
| Performance → Queries | Are "near me" queries gaining more impressions? |
| Coverage | Any new crawl errors or excluded pages? |
| Core Web Vitals | Any regressions after deploys? |
| Sitemaps | Confirm last submitted sitemap shows no errors |
