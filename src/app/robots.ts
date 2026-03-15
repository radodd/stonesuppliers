// robots.ts — tells crawlers which paths to index and which to skip.
// Without this, Googlebot crawls /api/, /monitoring, and /cart,
// wasting crawl budget on internal endpoints and private pages.

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cart", "/monitoring"],
    },
    sitemap: "https://www.stonesuppliers.net/sitemap.xml",
  };
}
