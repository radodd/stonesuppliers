// Dynamic sitemap — auto-includes all material pages from Supabase.
// Replaces the previous static sitemap.xml which only listed 7 hardcoded URLs.
// Next.js serves this at /sitemap.xml automatically.

import { MetadataRoute } from "next";
import { getAllMaterialSlugs } from "@/lib/materialsService";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllMaterialSlugs();

  const materialUrls: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `https://www.stonesuppliers.net/materials/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [
    {
      url: "https://www.stonesuppliers.net",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://www.stonesuppliers.net/services",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://www.stonesuppliers.net/materials",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://www.stonesuppliers.net/about",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: "https://www.stonesuppliers.net/contact",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    // /cart intentionally excluded — not a public indexable page
    ...materialUrls,
  ];
}
