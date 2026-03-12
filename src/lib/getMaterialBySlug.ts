import supabase from "@/lib/supabaseServer";

export async function getMaterialBySlug(
  slug: string
): Promise<{ name: string; description: string }> {
  const { data, error } = await supabase
    .from("Materials")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return { name: "", description: "" };
  }

  return data;
}
