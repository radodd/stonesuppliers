// ─────────────────────────────────────────────────────────────────────────────
// Site Audit Script
// Crawls every URL in /sitemap.xml and checks:
//   1. HTTP status (no 4xx/5xx responses)
//   2. JS console errors and unhandled exceptions — on load AND after interactions
//   3. Broken images (img elements with naturalWidth === 0)
//
// Runs an interaction pass at both desktop (1280px) and mobile (375px) viewports,
// clicking every visible button to surface errors that only fire after user actions
// (e.g. React void-element errors triggered by opening Sheets or Dialogs).
//
// Usage:
//   npm run audit             → audit live site (stonesuppliers.net)
//   npm run audit:local       → audit local dev server (localhost:PORT)
//   AUDIT_BASE_URL=https://... npm run audit   → custom target
//
// NOTE: Run against local dev server (`npm run dev`) to get full React error
// details. Production mode suppresses verbose component-level errors.
//
// Prerequisites (one-time setup):
//   npm install --save-dev playwright
//   npx playwright install chromium
// ─────────────────────────────────────────────────────────────────────────────

import * as dotenv from "dotenv";
import { chromium, type Page } from "playwright";

dotenv.config({ path: ".env.local" });

// ── 1. Configuration ──────────────────────────────────────────────────────────

const isLocal = process.argv.includes("--local");
const PORT = process.env.PORT ?? "3030";
const DEFAULT_BASE = isLocal
  ? `http://localhost:${PORT}`
  : "https://www.stonesuppliers.net";
const BASE_URL = process.env.AUDIT_BASE_URL ?? DEFAULT_BASE;

// ── 2. Types ──────────────────────────────────────────────────────────────────

interface PageResult {
  url: string;
  status: number | null;
  consoleErrors: string[];      // errors on page load
  interactionErrors: string[];  // errors triggered by button clicks
  brokenImages: string[];
  pass: boolean;
}

// ── 3. Sitemap parser ─────────────────────────────────────────────────────────

async function fetchSitemapUrls(baseUrl: string): Promise<string[]> {
  const res = await fetch(`${baseUrl}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((m) => m[1].trim());
}

// ── 4. Interaction pass ───────────────────────────────────────────────────────
// Clicks every visible, non-disabled button on the page. After each click,
// waits for React to settle, collects errors, then presses Escape to close
// any sheet/modal that opened. If the click navigated away, returns to the
// original URL before continuing.

async function runInteractions(
  page: Page,
  url: string,
  errorCollector: string[]
): Promise<void> {
  const errorsBefore = errorCollector.length;

  const buttons = await page.locator("button, [role='button']").all();

  for (const button of buttons) {
    // Skip invisible or disabled buttons
    try {
      if (!(await button.isVisible())) continue;
      if (await button.isDisabled()) continue;
    } catch {
      continue; // element may have detached
    }

    const urlBefore = page.url();

    try {
      await button.click({ timeout: 3_000, force: false });
    } catch {
      continue; // button may have disappeared or been covered
    }

    // Wait for React to process the state change
    await page.waitForTimeout(400);

    // Dismiss any overlay that opened
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);

    // If we navigated away, go back
    if (page.url() !== urlBefore) {
      try {
        await page.goto(url, { waitUntil: "load", timeout: 15_000 });
        await page.waitForTimeout(500);
      } catch {
        // couldn't return — stop interaction pass for this page
        break;
      }
    }
  }

  // Mark any errors collected after we started as interaction errors
  // (the errorCollector is shared; caller will separate them by snapshot index)
  void errorsBefore; // used by caller
}

// ── 5. Per-page auditor ───────────────────────────────────────────────────────

async function auditPage(page: Page, url: string): Promise<PageResult> {
  const loadErrors: string[] = [];
  const interactionErrors: string[] = [];

  // We use a single collector during the whole audit of this page, then
  // split by phase using a snapshot index.
  const allErrors: string[] = [];

  const onConsole = (msg: { type(): string; text(): string }) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    // Next.js App Router logs this when RSC prefetch fails but gracefully falls
    // back to normal navigation — the user experience is not broken, so skip it.
    if (text.includes("Falling back to browser navigation")) return;
    allErrors.push(text);
  };
  const onPageError = (err: Error) => {
    allErrors.push(`[unhandled exception] ${err.message}`);
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  // ── Load pass (desktop 1280px) ──────────────────────────────────────────────
  await page.setViewportSize({ width: 1280, height: 800 });

  let status: number | null = null;
  try {
    const response = await page.goto(url, {
      waitUntil: "load",
      timeout: 30_000,
    });
    status = response?.status() ?? null;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    allErrors.push(`[navigation error] ${message}`);
  }

  await page.waitForTimeout(800);

  const brokenImages = await page.evaluate((): string[] => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return imgs
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.src);
  });

  // Snapshot: errors so far are load errors
  const loadErrorCutoff = allErrors.length;

  // ── Interaction pass — desktop viewport ────────────────────────────────────
  await runInteractions(page, url, allErrors);
  const desktopInteractionCutoff = allErrors.length;

  // ── Interaction pass — mobile viewport (375px) ─────────────────────────────
  // Reload at mobile to trigger hamburger menu, mobile nav Sheets, etc.
  await page.setViewportSize({ width: 375, height: 667 });
  try {
    await page.goto(url, { waitUntil: "load", timeout: 30_000 });
    await page.waitForTimeout(500);
  } catch {
    // if reload fails, skip mobile pass
  }
  await runInteractions(page, url, allErrors);

  // Restore desktop viewport for next page
  await page.setViewportSize({ width: 1280, height: 800 });

  page.off("console", onConsole);
  page.off("pageerror", onPageError);

  // Split errors by phase
  for (const err of allErrors.slice(0, loadErrorCutoff)) {
    loadErrors.push(err);
  }
  const rawInteractionErrors = allErrors.slice(loadErrorCutoff);

  // Deduplicate interaction errors (same error from multiple button clicks)
  const seen = new Set<string>();
  for (const err of rawInteractionErrors) {
    if (!seen.has(err)) {
      seen.add(err);
      interactionErrors.push(err);
    }
  }
  void desktopInteractionCutoff; // informational only

  const pass =
    status !== null &&
    status < 400 &&
    loadErrors.length === 0 &&
    interactionErrors.length === 0 &&
    brokenImages.length === 0;

  return { url, status, consoleErrors: loadErrors, interactionErrors, brokenImages, pass };
}

// ── 6. Reporter ───────────────────────────────────────────────────────────────

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

function printReport(results: PageResult[], baseUrl: string): void {
  console.log(`\n${BOLD}SITE AUDIT — ${baseUrl}${RESET}`);
  if (!baseUrl.includes("localhost")) {
    console.log(
      `${DIM}  TIP: Run against local dev server (npm run audit:local) to surface full React errors${RESET}`
    );
  }
  console.log("─".repeat(62));

  for (const r of results) {
    const label = r.pass ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
    const path = r.url.replace(baseUrl, "") || "/";
    const statusStr = r.status !== null ? `(${r.status})` : "(no response)";
    console.log(`  ${label}  ${path.padEnd(42)} ${DIM}${statusStr}${RESET}`);
    for (const img of r.brokenImages) {
      console.log(`         ${RED}broken image:${RESET} ${img}`);
    }
    for (const err of r.consoleErrors) {
      console.log(`         ${RED}load error:${RESET} ${err}`);
    }
    for (const err of r.interactionErrors) {
      console.log(`         ${YELLOW}interaction error:${RESET} ${err}`);
    }
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.length - passed;

  console.log("─".repeat(62));
  console.log(`  Audited: ${results.length} pages`);
  console.log(`  ${GREEN}Passed:  ${passed}${RESET}`);
  if (failed > 0) console.log(`  ${RED}Failed:  ${failed}${RESET}`);

  if (failed === 0) {
    console.log(`\n${GREEN}${BOLD}  AUDIT PASSED${RESET}\n`);
  } else {
    console.log(
      `\n${RED}${BOLD}  AUDIT FAILED — ${failed} page(s) need attention${RESET}\n`
    );
  }
}

// ── 7. Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`\nFetching sitemap from ${BASE_URL}/sitemap.xml ...`);

  let urls: string[];
  try {
    urls = await fetchSitemapUrls(BASE_URL);
  } catch (err) {
    console.error(`\nFailed to fetch sitemap: ${err}`);
    console.error(
      isLocal ? "Is `npm run dev` running?" : "Is the site reachable?"
    );
    process.exit(1);
  }

  console.log(`Found ${urls.length} URLs to audit.`);
  console.log(`Running load + interaction checks (desktop & mobile)...\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results: PageResult[] = [];

  for (const url of urls) {
    const path = url.replace(BASE_URL, "") || "/";
    process.stdout.write(`  Checking ${path.padEnd(44)}`);
    const result = await auditPage(page, url);
    results.push(result);
    process.stdout.write(result.pass ? "OK\n" : "ISSUES FOUND\n");
  }

  await browser.close();
  printReport(results, BASE_URL);
  process.exit(results.every((r) => r.pass) ? 0 : 1);
}

main().catch((err) => {
  console.error("Audit script crashed:", err);
  process.exit(1);
});
