import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

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

type CategoryDTO = {
  name: string;
  sizes: string[];
};

type MaterialDetailDTO = {
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

function transformCategories(materialCategories: any[]): CategoryDTO[] {
  return (materialCategories ?? []).map((mc) => ({
    name: mc.Categories?.name ?? "",
    sizes: (mc.MaterialCategorySizes ?? [])
      .map((mcs: any) => mcs.Sizes?.sizeValue?.trim() ?? "")
      .filter(Boolean),
  }));
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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { data, error } = await supabase
      .from("Materials")
      .select(DETAIL_SELECT)
      .eq("slug", slug);

    if (error) {
      console.error("Error fetching material by slug:", error);
      return NextResponse.json(
        { error: "Failed to fetch material details" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: `Material with slug ${slug} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(toDetailDTO(data[0]), {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/materials/[slug]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
