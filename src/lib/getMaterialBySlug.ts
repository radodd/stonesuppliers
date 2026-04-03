// ─────────────────────────────────────────────────────────────────────────────
// getMaterialBySlug
// Fetches a single material's metadata from Supabase by its URL slug.
// Primarily used for generating SEO metadata (Open Graph, structured data).
// Returns an object with empty strings on error rather than throwing, to
// prevent metadata generation from crashing the page build.
// ─────────────────────────────────────────────────────────────────────────────

import supabase from "@/lib/supabaseServer";

export async function getMaterialBySlug(
  slug: string
): Promise<{ name: string; description: string; imagePrimary: string | null }> {
  const { data, error } = await supabase
    .from("Materials")
    .select("name, description, imagePrimary")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return { name: "", description: "", imagePrimary: null };
  }

  return data;
}
