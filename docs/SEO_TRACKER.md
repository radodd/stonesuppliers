# SEO, GSC & GBP Tracker — stonesuppliers.net

A living checklist for all SEO work, outstanding tasks, and key decisions.
Update this file as items are completed or new work is identified.

---

## Table of Contents

1. [GSC Performance Summary](#gsc-performance-summary)
2. [Completed SEO Updates](#completed-seo-updates)
3. [Pending — Code Changes](#pending--code-changes)
4. [Pending — Client Action Required](#pending--client-action-required)
5. [mrcrs.com Migration Plan](#mrcrscm-migration-plan)
6. [GBP Consolidation Plan](#gbp-consolidation-plan)
7. [Ongoing Monitoring](#ongoing-monitoring)

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

## Pending — Code Changes

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
