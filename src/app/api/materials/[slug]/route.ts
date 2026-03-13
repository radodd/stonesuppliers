import { NextRequest, NextResponse } from "next/server";
import { getMaterialBySlug } from "@/lib/materialsService";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const material = await getMaterialBySlug(slug);

    if (!material) {
      return NextResponse.json(
        { error: `Material with slug ${slug} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(material, {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/materials/[slug]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
