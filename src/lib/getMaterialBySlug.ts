import { supabase } from "./supabase";

export async function getMaterialBySlug(slug: string) {
  const { data, error } = await supabase
    .from("Materials")
    .select(
      `
      id,
      slug,
      name,
      description,
      color,
      uses,
      texture,
      company,
      imagePath,
      imagePrimary,
      MaterialCategories (
        id,
        category_id,
        Categories (
          id,
          name
        ),
        MaterialCategorySizes (
          id,
          size_id,
          Sizes (
            id,
            sizeValue
          )
        )
      )
    `,
    )
    .eq("slug", slug)
    .single(); // You expect one material

  if (error || !data) {
    throw new Error(`Could not fetch material with Slug ${slug}`);
  }

  return data;
}
