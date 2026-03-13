// ─────────────────────────────────────────────────────────────────────────────
// Google Analytics Utilities
// Thin wrapper around gtag() that guards against SSR — window is not defined
// on the server, so all calls are no-ops outside the browser.
// ─────────────────────────────────────────────────────────────────────────────

export const gaEvent = (action: string, params: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, params);
  }
};
