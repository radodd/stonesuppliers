import { NextResponse } from "next/server";
import { fetchMaterials, fetchMaterialBySlug } from "@/services/materials";

// GET /api/materials
export async function GET() {
  try {
    const materials = await fetchMaterials();
    return NextResponse.json(materials);
  } catch (error: any) {
    console.error("GET /api/materials error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

// GET /api/materials/slug/:slug
export async function GET_MATERIAL_BY_SLUG(slug: string) {
  try {
    const material = await fetchMaterialBySlug(slug);
    return NextResponse.json(material);
  } catch (error: any) {
    console.error(`GET /api/materials/slug/${slug} error:`, error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
