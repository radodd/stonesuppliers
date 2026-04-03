# Analytics Integration — GA4 + GTM + Microsoft Clarity

A reference guide documenting the full analytics stack implemented on this project.
Written to be reused as a blueprint for future Next.js projects.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Why GTM Instead of Direct GA4](#why-gtm-instead-of-direct-ga4)
3. [Why dataLayer Instead of gtag()](#why-datalayer-instead-of-gtag)
4. [Why Clarity Over Hotjar](#why-clarity-over-hotjar)
5. [Step 1 — Environment Variables](#step-1--environment-variables)
6. [Step 2 — The gaEvent() Utility](#step-2--the-gaevent-utility)
7. [Step 3 — GTM Script in Next.js App Router](#step-3--gtm-script-in-nextjs-app-router)
8. [Step 4 — Content Security Policy Updates](#step-4--content-security-policy-updates)
9. [Step 5 — Event Tracking Implementation](#step-5--event-tracking-implementation)
10. [Step 6 — GTM Console Configuration](#step-6--gtm-console-configuration)
11. [Step 7 — Microsoft Clarity via GTM](#step-7--microsoft-clarity-via-gtm)
12. [Step 8 — Verification](#step-8--verification)
13. [Step 9 — GA4 Custom Dimensions](#step-9--ga4-custom-dimensions)
14. [Step 10 — Filter Tracking](#step-10--filter-tracking)
15. [Files Changed](#files-changed)
16. [Event Reference](#event-reference)

---

## Architecture Overview

```
Component
  └─ gaEvent("event_name", { ...params })
       └─ window.dataLayer.push({ event: "event_name", ...params })
            └─ GTM reads dataLayer
                 ├─ GA4 Event Tag fires → data sent to Google Analytics
                 └─ Clarity Tag fires  → session recording active
```

The key principle: **the application only knows about the dataLayer**. It never talks to GA4 or Clarity directly. GTM sits in between and decides what to do with each event. This means you can add, remove, or swap analytics tools entirely from the GTM console without touching the codebase.

---

## Why GTM Instead of Direct GA4

The project initially used `@next/third-parties/google`'s `<GoogleAnalytics>` component, which injects the GA4 script directly. This works, but has a significant limitation: every time you want to add a new tool (a pixel, session recorder, A/B testing script), you have to touch the codebase and redeploy.

**GTM solves this at the infrastructure level.** Once the GTM snippet is in your layout, you can:

- Add Microsoft Clarity in 2 minutes via the GTM console — no code deploy
- Add a Meta Pixel when ad spend starts — no code deploy
- Add a Google Ads conversion tag — no code deploy
- Remove any of them instantly if needed

For a client project that will grow over time, this is the right foundation. The cost is one additional snippet in the layout and a slightly more complex mental model. The payoff is never having to touch analytics infrastructure in the codebase again.

**When direct GA4 (no GTM) is appropriate:**
- A personal project you fully control with no plans to add other tools
- When the team has no GTM access but does have codebase access
- When you explicitly want to minimize third-party tag management overhead

---

## Why dataLayer Instead of gtag()

When GTM is present, calling `window.gtag()` directly bypasses GTM entirely — the event goes straight to GA4. This creates two separate pipelines running in parallel, which causes:

- Double-counting if GTM also has GA4 tags
- No way to intercept or enrich events in GTM before they hit GA4
- Inconsistency — some events go through GTM, others don't

**`window.dataLayer.push()` is the correct pattern when GTM is the delivery layer.** The application pushes a plain JavaScript object with an `event` key. GTM listens for that event name, reads the associated parameters, and forwards everything to the configured destination tags (GA4, Clarity, etc.).

The `gaEvent()` wrapper in `src/lib/ga.ts` abstracts this so components never call `dataLayer.push()` directly and never need to know which analytics platform is receiving the data.

```typescript
// src/lib/ga.ts
export const gaEvent = (eventName: string, params: Record<string, any>) => {
  if (typeof window === "undefined") return;   // SSR guard
  window.dataLayer = window.dataLayer || [];   // race condition guard
  window.dataLayer.push({ event: eventName, ...params });
};
```

The SSR guard matters in Next.js because server components run without a `window` object. Without it, the function would throw on the server.

The `window.dataLayer = window.dataLayer || []` guard handles the rare case where a component fires an event before the GTM script has had a chance to initialize the array — most commonly with aggressive SPA prefetching.

---

## Why Clarity Over Hotjar

Both tools provide session recordings and heatmaps. The decision came down to cost and GA4 integration:

| | Microsoft Clarity | Hotjar |
|---|---|---|
| Price | Free, no limits | Free tier: 35 sessions/day cap |
| Session recordings | Unlimited | Capped on free tier |
| Heatmaps | Yes | Yes |
| GA4 native integration | Yes, one-click in GA4 | Manual |
| AI session summaries | Yes (Copilot) | No |
| Surveys / feedback widgets | No | Yes |
| GDPR | Compliant | Compliant |
| Implementation | GTM tag, no code | GTM tag, no code |

For a project at an early growth stage with no session cap requirements and where the value is in understanding product page and form behavior, Clarity is the clear choice. Hotjar's surveys and feedback widgets are compelling but out of scope here — Clarity can be swapped for Hotjar later via GTM without any code changes.

---

## Step 1 — Environment Variables

### `.env.example`
```
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### `.env.local` (never committed)
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-LHXXVFD44M
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Both IDs are kept as env vars so they can differ between environments (staging vs production) without code changes. `NEXT_PUBLIC_` prefix is required for Next.js to expose them to the browser bundle.

Note: GA4 Measurement ID stays in the env even after migrating to GTM. GTM's GA4 Configuration tag still needs it — the value is just configured in the GTM console variable instead of the Next.js layout.

---

## Step 2 — The gaEvent() Utility

**File:** `src/lib/ga.ts`

```typescript
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export const gaEvent = (eventName: string, params: Record<string, any>) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
};
```

The `declare global` block gives TypeScript a proper type for `window.dataLayer` so no `as any` cast is needed at call sites.

This is a single-function module intentionally. It stays thin on purpose — the analytics logic lives in GTM, not in the application code. If you ever need to switch from GTM to a different tag manager, this is the only file that changes. All the components that call `gaEvent()` stay untouched.

---

## Step 3 — GTM Script in Next.js App Router

**File:** `src/app/layout.tsx`

The GTM integration requires two snippets:
1. A `<Script>` tag in `<head>` that loads the GTM container
2. A `<noscript><iframe>` at the top of `<body>` as a fallback for users with JavaScript disabled

```tsx
import Script from "next/script";

// Inside <head>, after existing <script> tags:
{process.env.NEXT_PUBLIC_GTM_ID && (
  <Script
    id="gtm-init"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
    }}
  />
)}

// Inside <body>, as the very first child:
{process.env.NEXT_PUBLIC_GTM_ID && (
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
      height="0"
      width="0"
      style={{ display: "none", visibility: "hidden" }}
    />
  </noscript>
)}
```

**Why `strategy="afterInteractive"` and not `"beforeInteractive"`:**
Next.js App Router does not support `beforeInteractive` scripts in client components. `afterInteractive` fires after hydration and is the standard recommended approach for GTM in App Router. GTM itself recommends placing its snippet as high in `<head>` as possible, but the Next.js `<Script>` component handles the ordering internally.

**Why the conditional `process.env.NEXT_PUBLIC_GTM_ID &&`:**
Prevents the GTM snippet from being injected in local environments where the env var isn't set, avoiding 404 errors to GTM's servers during development.

**What replaced:** The `<GoogleAnalytics gaId={...} />` component from `@next/third-parties/google` was removed. It loaded GA4 directly without going through GTM. With GTM now handling GA4 delivery via a "Google Tag" tag, the `@next/third-parties` approach would have caused double-counting.

---

## Step 4 — Content Security Policy Updates

**File:** `next.config.mjs`

Three CSP directives needed updating:

```javascript
// script-src: allow GTM and Clarity to load their scripts
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",

// connect-src: allow outbound data calls to GA4 and Clarity
"connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://dzlauufqbyfqfivbiipg.supabase.co https://www.clarity.ms https://*.clarity.ms",

// frame-src: allow the GTM noscript iframe (was 'none')
"frame-src https://www.googletagmanager.com",
```

**Why `frame-src` changed from `'none'`:** The GTM noscript fallback uses an `<iframe>` pointing to `googletagmanager.com/ns.html`. With `frame-src 'none'`, the browser blocks this and logs CSP violations. The noscript path only matters for JS-disabled users, but keeping it valid is standard practice.

Note: `X-Frame-Options: DENY` in the headers array is separate — it prevents your own pages from being embedded in iframes on other sites. It does not affect iframes you create on your own pages.

---

## Step 5 — Event Tracking Implementation

### Design Principles

Events follow GA4's recommended ecommerce schema wherever possible (`view_item`, `add_to_cart`, `select_item`, `generate_lead`). Custom parameters use snake_case to match GA4 naming conventions. Arrays follow the `items: [{ item_name, item_id, ... }]` structure GA4 expects for ecommerce reports.

### Event: `select_item`

**File:** `src/components/MaterialCard.tsx`
**Trigger:** User clicks a product card from any listing page
**Why tracked:** Measures the browse-to-detail funnel entry point. Which products get the most clicks tells you what's visually compelling or well-positioned — separate from which products get quoted.

```typescript
gaEvent("select_item", {
  item_list_name: "materials_catalog",
  items: [{
    item_id: id,
    item_name: name,
    item_category: Array.isArray(category) ? category.join(", ") : category,
    item_brand: company.join(", "),
  }],
});
```

`MaterialCard.tsx` needed `"use client"` added since `onClick` requires a browser event handler — the directive makes it explicit to Next.js that this component runs on the client.

### Event: `view_item`

**File:** `src/components/sections/materialDetailPage/MaterialDetailPageClient.tsx`
**Trigger:** Product detail page loads (`useEffect` on `product.id`)
**Why tracked:** The gap between `select_item` and `view_item` counts indicates how often deep links land users directly on product pages (bypassing the listing). Already existed before this integration — just migrated from `gtag()` to `dataLayer`.

```typescript
gaEvent("view_item", {
  items: [{
    item_id: product.id,
    item_name: product.name,
    item_category: product.categories?.map((cat) => cat.name).join(", "),
    item_company: product.company.join(", "),
  }],
});
```

### Event: `add_to_cart`

**File:** `src/components/sections/materialDetailPage/MaterialDetailForm.tsx`
**Trigger:** User submits the "Request to Quote" form on a product detail page (calls `addToCart()`)
**Why tracked:** Distinguishes between users who view a product and users who intend to order. The gap between `view_item` and `add_to_cart` shows product page conversion rate. `item_variant` maps to the selected size because size is the main variant differentiator for stone materials.

```typescript
gaEvent("add_to_cart", {
  items: [{
    item_name: values.name,
    item_category: values.category || undefined,
    item_variant: values.size || undefined,       // size = GA4 item_variant
    quantity: parseInt(values.quantity, 10),
  }],
});
```

### Event: `form_start`

**File:** `src/components/form/useContactForm.tsx` + `ContactForm.tsx`
**Trigger:** First time any field inside the quote request form receives focus
**Why tracked:** Measures the gap between users who reach the cart/contact page and users who actually engage with the form. High drop-off before `form_start` = page layout or UX problem. High drop-off between `form_start` and `generate_lead` = form friction problem.

The one-time-only firing is enforced with a `useRef` boolean guard rather than `useState`. `useState` would cause a re-render on the first focus event, which is unnecessary overhead and could cause the event to fire twice in strict mode:

```typescript
const formStartFiredRef = useRef(false);

const handleFormStart = () => {
  if (formStartFiredRef.current) return;   // idempotency guard
  formStartFiredRef.current = true;
  gaEvent("form_start", { form_name: "quote_request" });
};
```

`onFocus` is placed on the `<form>` wrapper element rather than on individual fields. Focus events bubble upward in the DOM, so a single handler on the parent catches the first interaction regardless of which field the user clicks first.

### Event: `generate_lead`

**File:** `src/components/form/useContactForm.tsx`
**Trigger:** `sendEmail()` server action returns `result.success === true`
**Why tracked:** This is the primary conversion event for the business — a submitted quote request. It fires only after the email has been confirmed sent, not just on form submit click. This prevents false positives from validation failures or network errors.

The event fires **before** `removeFromCart()` clears the cart so that the `cartItems` array is still populated when the event fires:

```typescript
} else {
  gaEvent("generate_lead", {
    value: cartItems.length,         // item count as lead quality proxy
    currency: "USD",
    lead_source: "quote_request_form",
    contact_company: formData.company,
    contact_position: formData.position,
    item_count: cartItems.length,
    items: cartItems.map((item) => ({
      item_name: item.name,
      item_category: item.category ?? "",
      item_variant: item.size ?? "",
      quantity: parseInt(item.quantity, 10),
    })),
  });
  // cart cleared after event fires
  cartItems.forEach((item) => removeFromCart(item.cartId));
```

`contact_position` captures the user's role (Wholesaler / Retailer / Homeowner / Contractor). Over time this reveals which customer segment submits the most quotes and whether conversion rate differs by segment.

### Event: `file_download`

**File:** `src/components/sections/materialDetailPage/MaterialDetailPageClient.tsx`
**Trigger:** User clicks the "Category Sizes" PDF button on a product detail page
**Why tracked:** Measures content engagement beyond product browsing. If users frequently download the PDF they may be converting to offline research — high download rates combined with lower `generate_lead` counts on the same session could indicate the PDF is acting as a friction point or a substitute for quoting.

```typescript
gaEvent("file_download", {
  file_name: "Category_Sizes_Reference.pdf",
  file_extension: "pdf",
  link_text: "Category Sizes",
});
window.open("/Category_Sizes_Reference.pdf", "_blank");
```

The event fires before `window.open()` to guarantee it is captured even if the browser blocks the popup.

### Event: `filter_applied`

**Files:** `src/components/ProductFilters.tsx` and `src/components/FilterDropDown.tsx`
**Trigger:** User clicks "Apply Filters" with at least one filter selected
**Why tracked:** Reveals which filter dimensions users rely on most (company, category, color, texture, size) and what combinations they try. Documented fully in [Step 10 — Filter Tracking](#step-10--filter-tracking).

---

## Step 6 — GTM Console Configuration

### Variables

**Constant variable — GA4 Measurement ID:**
- Type: Constant
- Name: `GA4 Measurement ID`
- Value: your GA4 measurement ID (e.g. `G-XXXXXXXXXX`)

**Data Layer Variables** — one per event parameter. The variable's name (used in tags) uses a `DL -` prefix for clarity. The "Data Layer Variable Name" field must be the exact key from the `dataLayer.push()` call:

| GTM Variable Name | Data Layer Variable Name (exact key) |
|---|---|
| `DL - items` | `items` |
| `DL - value` | `value` |
| `DL - currency` | `currency` |
| `DL - lead_source` | `lead_source` |
| `DL - contact_company` | `contact_company` |
| `DL - contact_position` | `contact_position` |
| `DL - item_count` | `item_count` |
| `DL - form_name` | `form_name` |
| `DL - item_list_name` | `item_list_name` |
| `DL - filter_values` | `filter_values` |
| `DL - filter_count` | `filter_count` |
| `DL - filter_types` | `filter_types` |
| `DL - file_name` | `file_name` |
| `DL - file_extension` | `file_extension` |
| `DL - link_text` | `link_text` |

All use Data Layer Version 2 (default).

### Triggers

One Custom Event trigger per event name. Event names are case-sensitive and must match the `event` field in `dataLayer.push()` exactly:

| Trigger Name | Event Name |
|---|---|
| `CE - view_item` | `view_item` |
| `CE - add_to_cart` | `add_to_cart` |
| `CE - generate_lead` | `generate_lead` |
| `CE - form_start` | `form_start` |
| `CE - select_item` | `select_item` |
| `CE - filter_applied` | `filter_applied` |
| `CE - file_download` | `file_download` |

### Tags

**Base configuration tag (fires on all pages):**
- Type: **Google Tag** (replaces the old "GA4 Configuration" tag type in modern GTM)
- Tag ID: `{{GA4 Measurement ID}}`
- Trigger: All Pages
- Name: `GA4 - Configuration`

**Event tags (one per custom event):**
- Type: Google Analytics: GA4 Event
- Measurement ID: `{{GA4 Measurement ID}}`
- Event Name: the event name (e.g. `view_item`)
- Event Parameters: map parameter names to `{{DL - ...}}` variables
- Trigger: the matching `CE - ...` custom event trigger

Full list of event tags configured:

| Tag Name | Event Name | Key Parameters Mapped | Trigger |
|---|---|---|---|
| `GA4 - view_item` | `view_item` | `items → {{DL - items}}` | `CE - view_item` |
| `GA4 - add_to_cart` | `add_to_cart` | `items → {{DL - items}}` | `CE - add_to_cart` |
| `GA4 - generate_lead` | `generate_lead` | `items`, `value`, `currency`, `lead_source`, `contact_company`, `contact_position`, `item_count` | `CE - generate_lead` |
| `GA4 - form_start` | `form_start` | `form_name → {{DL - form_name}}` | `CE - form_start` |
| `GA4 - select_item` | `select_item` | `items`, `item_list_name` | `CE - select_item` |
| `GA4 - filter_applied` | `filter_applied` | `filter_values`, `filter_count`, `filter_types` | `CE - filter_applied` |
| `GA4 - file_download` | `file_download` | `file_name`, `file_extension`, `link_text` | `CE - file_download` |

Note on the Event Parameters table: the left column is the **parameter name** (plain string, e.g. `items`), the right column is the **value** (the GTM variable reference, e.g. `{{DL - items}}`). These are easy to mix up.

### SPA Page View Tracking

Next.js is a single-page application — navigating between pages does not trigger a full browser reload, so GTM's default "Page View" trigger only fires once on initial load. To track subsequent page views:

**Trigger:**
- Type: History Change
- Name: `HCE - page_view`
- GTM fires this automatically on every `pushState`/`replaceState` call via the built-in `gtm.historyChange-v2` event — no code changes required

**Tag:**
- Type: Google Analytics: GA4 Event
- Event Name: `page_view`
- Parameters: `page_location → {{Page URL}}`
- Trigger: `HCE - page_view`
- Name: `GA4 - page_view (SPA)`

The `{{Page URL}}` built-in GTM variable captures the full URL after each navigation. `page_title` is not needed — GA4 derives it from the URL. Confirm it works by navigating between pages in GTM Preview Mode and watching for `GA4 - page_view (SPA)` in the Tags Fired list on each route change.

---

## Step 7 — Microsoft Clarity via GTM

No application code changes required. Clarity is added entirely within GTM:

1. Tags → New → search Community Template Gallery for **Microsoft Clarity**
2. Enter your Clarity Project ID (from `clarity.microsoft.com` → Settings → Setup)
3. Trigger: All Pages
4. Name: `Clarity - Tracking`
5. Publish

Clarity automatically integrates with GA4 if you link both under the same Google account. This adds a "View Clarity Session" button directly in GA4 reports next to individual user sessions.

**CSP addition required** for Clarity to work under a strict Content-Security-Policy:
- `script-src`: add `https://www.clarity.ms`
- `connect-src`: add `https://www.clarity.ms https://*.clarity.ms`

---

## Step 8 — Verification

### Local Verification (before GTM publish)

1. Add `NEXT_PUBLIC_GTM_ID` to `.env.local`, restart the dev server
2. Open the browser console and run `window.dataLayer` — should return an array with `gtm.js`, `gtm.dom`, `gtm.load` entries
3. Perform each action and verify the corresponding entry appears in `dataLayer`:

```javascript
// After clicking a product card:
window.dataLayer.find(d => d.event === 'select_item')

// After landing on a product page:
window.dataLayer.find(d => d.event === 'view_item')

// After clicking "Request to Quote":
window.dataLayer.find(d => d.event === 'add_to_cart')

// After focusing the first form field on /cart:
window.dataLayer.find(d => d.event === 'form_start')

// After successful quote form submission:
window.dataLayer.find(d => d.event === 'generate_lead')

// After clicking the "Category Sizes" PDF button:
window.dataLayer.find(d => d.event === 'file_download')

// After clicking "Apply Filters" with at least one filter selected:
window.dataLayer.find(d => d.event === 'filter_applied')

// See all filter_applied events across the session:
window.dataLayer.filter(d => d.event === 'filter_applied')
```

### GTM Preview Mode (before publishing)

1. GTM console → Preview → enter your site URL
2. Tag Assistant opens your site in a new tab and the debug panel in another
3. Perform each action and confirm the matching tag appears in the "Tags Fired" list
4. Check that `GA4 - Configuration` fires on every page navigation

### GA4 DebugView (after publishing)

1. Add `?debug_mode=true` to any URL, or install the GA Debugger Chrome extension
2. GA4 → Configure → DebugView
3. Events appear in real time with all parameters visible
4. Confirm `items` array is populated correctly on `generate_lead`

### CSP Check

DevTools → Console → filter for security errors. Zero CSP violations should reference `googletagmanager.com` or `clarity.ms` after the config changes are deployed.

---

## Step 9 — GA4 Custom Dimensions

GA4 receives all custom parameters but won't surface them in reports until they are registered as Custom Dimensions.

**GA4 → Configure → Custom Definitions → Create custom dimension**

| Dimension Name | Scope | Event Parameter |
|---|---|---|
| Contact Company | Event | `contact_company` |
| Contact Position | Event | `contact_position` |
| Lead Source | Event | `lead_source` |
| Item Count | Event | `item_count` |
| Item Brand | Event | `item_brand` |

- Scope is always **Event** (not User) for parameters attached to specific events
- The "Event parameter" field must match the exact key from the code
- GA4 takes 24–48 hours to start populating these in report builders
- Historical data is not backfilled — register dimensions early

Once registered, these appear under "Custom" in the Explore report dimension picker, enabling reports like: leads by contact position, average items per quote, most-quoted material categories.

---

## Step 10 — Filter Tracking

### Overview

When a user applies filters on the materials listing page, a `filter_applied` event fires. The event captures which values were selected and classifies each value into its filter type (company, category, texture, color, size) using the static lookup lists already imported by both filter components.

**Why fire on `applyFilters()` and not on checkbox change:**
Each checkbox change only updates `tempFilterValueList` — a staging area for uncommitted selections. Filters aren't applied until the user clicks "Apply Filters". Firing on checkbox change would mean one event per checkbox click, making it impossible to know what the user's final intended filter set was. One event per "Apply Filters" click gives you clean, actionable data.

### Code Changes

**Files:** `src/components/ProductFilters.tsx` and `src/components/FilterDropDown.tsx`

Both files already imported `AllCompanies`, `AllCategories`, `AllTextures`, `AllColors`, `AllSizes` from `@/data` — these are used directly to classify each selected value by its filter type.

```typescript
import { gaEvent } from "@/lib/ga";

const applyFilters = () => {
  if (tempFilterValueList.length > 0) {
    const getFilterType = (value: string): string => {
      if (AllCompanies.includes(value)) return "company";
      if (AllCategories.includes(value)) return "category";
      if (AllTextures.includes(value)) return "texture";
      if (AllColors.includes(value)) return "color";
      if (AllSizes.includes(value)) return "size";
      return "unknown";
    };
    const filterTypes = [...new Set(tempFilterValueList.map(getFilterType))];
    gaEvent("filter_applied", {
      filter_values: tempFilterValueList.join(", "),
      filter_count: tempFilterValueList.length,
      filter_types: filterTypes.join(", "),
    });
  }
  setFilterValueList(tempFilterValueList);
};
```

The `Set` deduplication on `filterTypes` ensures that if a user selects multiple colors, `filter_types` reads `"color"` once rather than `"color, color, color"`.

The event only fires when `tempFilterValueList.length > 0` — clicking "Apply Filters" with nothing selected is a no-op for tracking purposes (it's also a no-op for the UI, since the button is disabled in that state in `ProductFilters.tsx`).

### GTM Configuration for `filter_applied`

**New Data Layer Variables:**

| GTM Variable Name | Data Layer Variable Name |
|---|---|
| `DL - filter_values` | `filter_values` |
| `DL - filter_count` | `filter_count` |
| `DL - filter_types` | `filter_types` |

**New Trigger:**
- Type: Custom Event
- Event name: `filter_applied`
- Name: `CE - filter_applied`

**New Tag:**
- Type: Google Analytics: GA4 Event
- Event Name: `filter_applied`
- Parameters: `filter_values → {{DL - filter_values}}`, `filter_count → {{DL - filter_count}}`, `filter_types → {{DL - filter_types}}`
- Trigger: `CE - filter_applied`
- Name: `GA4 - filter_applied`

### What This Data Tells You

- **`filter_values`** — the exact values applied (e.g. `"Decomposed Granite, Brown, Crushed"`). Useful for finding which combinations users try most.
- **`filter_count`** — how many filters were active at once. High counts with low browse time = filters not narrowing results effectively.
- **`filter_types`** — which filter dimensions were used (e.g. `"color, category"`). Reveals which attribute categories matter most to users.

---

## Files Changed

| File | Nature of Change |
|---|---|
| `src/lib/ga.ts` | Full rewrite: `window.gtag()` → `window.dataLayer.push()` |
| `src/app/layout.tsx` | Removed `<GoogleAnalytics>`, added GTM `<Script>` + noscript iframe |
| `next.config.mjs` | CSP: updated `frame-src`, `script-src`, `connect-src` |
| `src/components/form/useContactForm.tsx` | Added `generate_lead` on success, `form_start` with `useRef` guard |
| `src/components/form/ContactForm.tsx` | Added `onFocus={handleFormStart}` to `<form>` element |
| `src/components/sections/materialDetailPage/MaterialDetailForm.tsx` | Added `add_to_cart` after `addToCart()` |
| `src/components/MaterialCard.tsx` | Added `"use client"`, `select_item` on `<Link>` click |
| `src/components/sections/materialDetailPage/MaterialDetailPageClient.tsx` | Added `file_download` event on PDF button; `view_item` already present, auto-uses new `dataLayer` impl |
| `src/components/ProductFilters.tsx` | Added `gaEvent` import, `filter_applied` in `applyFilters()` |
| `src/components/FilterDropDown.tsx` | Added `gaEvent` import, `filter_applied` in `applyFilters()` |
| `.env.example` | Added `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` |

---

## Event Reference

Quick lookup for all events tracked and their parameters.

| Event | File | Trigger | Key Parameters |
|---|---|---|---|
| `select_item` | `MaterialCard.tsx` | Product card click | `item_id`, `item_name`, `item_category`, `item_brand`, `item_list_name` |
| `view_item` | `MaterialDetailPageClient.tsx` | Product detail page load | `item_id`, `item_name`, `item_category`, `item_company` |
| `add_to_cart` | `MaterialDetailForm.tsx` | "Request to Quote" submit | `item_name`, `item_category`, `item_variant` (size), `quantity` |
| `form_start` | `useContactForm.tsx` | First focus on quote form | `form_name` |
| `generate_lead` | `useContactForm.tsx` | Successful email send | `value`, `currency`, `lead_source`, `contact_company`, `contact_position`, `item_count`, `items[]` |
| `file_download` | `MaterialDetailPageClient.tsx` | "Category Sizes" PDF button click | `file_name`, `file_extension`, `link_text` |
| `filter_applied` | `ProductFilters.tsx`, `FilterDropDown.tsx` | "Apply Filters" clicked with selections | `filter_values`, `filter_count`, `filter_types` |
