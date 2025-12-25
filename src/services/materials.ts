import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_API_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL and API Key must be set in environment variables"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchMaterials() {
  const { data, error } = await supabase.from("Materials").select(`
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
  `);

  if (error) {
    console.error("Error fetching materials:", error);
    throw new Error("Failed to fetch Materials");
  }

  if (!data || data.length === 0) {
    throw new Error("No Materials found");
  }

  return data;
}

export async function fetchMaterialBySlug(slug: string) {
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
    `
    )
    .eq("slug", slug);

  if (error) {
    console.error("Error fetching material by slug:", error);
    throw new Error("Failed to fetch material details");
  }

  if (!data || data.length === 0) {
    throw new Error(`Material with slug ${slug} not found`);
  }

  return data[0];
}
