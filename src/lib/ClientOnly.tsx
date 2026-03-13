// ─────────────────────────────────────────────────────────────────────────────
// ClientOnly
// Prevents SSR hydration mismatches by only rendering children after the
// component has mounted in the browser. Wrap anything that reads
// window/localStorage/navigator here.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, ReactNode } from "react";

export function ClientOnly({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <>{children}</> : null;
}
