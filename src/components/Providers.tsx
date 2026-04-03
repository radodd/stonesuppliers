"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Providers
// Root provider wrapper. Wraps the app in React Query's QueryClientProvider
// for data-fetching hooks. Add additional providers here (e.g. ThemeProvider).
// ─────────────────────────────────────────────────────────────────────────────

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const client = new QueryClient();

export const Providers = ({ children }: PropsWithChildren<{}>) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
