// ─────────────────────────────────────────────────────────────────────────────
// Materials Service
//
// Single source of truth for all Supabase queries and DTO transformations for
// the Materials table. API routes and server components call these functions
// instead of querying Supabase directly.
// ─────────────────────────────────────────────────────────────────────────────

import supabase from "@/lib/supabaseServer";

const LIST_SELECT = `
  id,
  slug,
  name,
  description,
  imagePrimary,
  color,
  texture,
  uses,
  company,
  MaterialCategories (
    Categories ( name ),
    MaterialCategorySizes (
      Sizes ( sizeValue )
    )
  )
`;

const DETAIL_SELECT = `
  id,
  slug,
  name,
  description,
  imagePrimary,
  imagePath,
  color,
  texture,
  uses,
  company,
  MaterialCategories (
    Categories ( name ),
    MaterialCategorySizes (
      Sizes ( sizeValue )
    )
  )
`;

export type CategoryDTO = {
  name: string;
  sizes: string[];
};

export type MaterialListDTO = {
  id: number;
  slug: string;
  name: string;
  description: string;
  imagePrimary: string | null;
  color: string[];
  texture: string[];
  uses: string[];
  company: string[];
  categories: CategoryDTO[];
};

export type MaterialDetailDTO = {
  id: number;
  slug: string;
  name: string;
  description: string;
  imagePrimary: string | null;
  images: string[];
  color: string[];
  texture: string[];
  uses: string[];
  company: string[];
  categories: CategoryDTO[];
};

function transformCategories(materialCategories: unknown[]): CategoryDTO[] {
  return (materialCategories ?? []).map((mc: any) => ({
    name: mc.Categories?.name ?? "",
    sizes: (mc.MaterialCategorySizes ?? [])
      .map((mcs: any) => mcs.Sizes?.sizeValue?.trim() ?? "")
      .filter(Boolean),
  }));
}

function toListDTO(raw: any): MaterialListDTO {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    imagePrimary: raw.imagePrimary ?? null,
    color: raw.color ?? [],
    texture: raw.texture ?? [],
    uses: raw.uses ?? [],
    company: raw.company ?? [],
    categories: transformCategories(raw.MaterialCategories ?? []),
  };
}

function toDetailDTO(raw: any): MaterialDetailDTO {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    imagePrimary: raw.imagePrimary ?? null,
    images: raw.imagePath ?? [],
    color: raw.color ?? [],
    texture: raw.texture ?? [],
    uses: raw.uses ?? [],
    company: raw.company ?? [],
    categories: transformCategories(raw.MaterialCategories ?? []),
  };
}

export async function getAllMaterials(): Promise<MaterialListDTO[]> {
  const { data, error } = await supabase.from("Materials").select(LIST_SELECT);
  if (error) throw new Error(`Failed to fetch materials: ${error.message}`);
  return (data ?? []).map(toListDTO);
}

export async function getAllMaterialSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("Materials").select("slug");
  if (error) throw new Error(`Failed to fetch material slugs: ${error.message}`);
  return (data ?? []).map((row: any) => row.slug as string);
}

export async function getMaterialBySlug(
  slug: string
): Promise<MaterialDetailDTO | null> {
  const { data, error } = await supabase
    .from("Materials")
    .select(DETAIL_SELECT)
    .eq("slug", slug);
  if (error) throw new Error(`Failed to fetch material ${slug}: ${error.message}`);
  if (!data || data.length === 0) return null;
  return toDetailDTO(data[0]);
}
