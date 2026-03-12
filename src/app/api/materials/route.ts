import { NextResponse } from "next/server";
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

type CategoryDTO = {
  name: string;
  sizes: string[];
};

type MaterialListDTO = {
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

function transformCategories(materialCategories: any[]): CategoryDTO[] {
  return (materialCategories ?? []).map((mc) => ({
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

export async function GET() {
  try {
    const { data, error } = await supabase.from("Materials").select(LIST_SELECT);

    if (error) {
      console.error("Error fetching materials:", error);
      return NextResponse.json(
        { error: "Failed to fetch Materials" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No Materials found" }, { status: 404 });
    }

    return NextResponse.json(data.map(toListDTO), {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/materials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
