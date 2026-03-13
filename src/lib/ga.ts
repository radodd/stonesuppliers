// ─────────────────────────────────────────────────────────────────────────────
// Analytics Utilities
// Pushes events to window.dataLayer. GTM reads the dataLayer and forwards
// matching events to GA4. All calls are no-ops outside the browser (SSR safety).
// ─────────────────────────────────────────────────────────────────────────────

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
