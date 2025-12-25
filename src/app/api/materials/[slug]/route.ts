import { NextResponse } from "next/server";
import { fetchMaterialBySlug } from "@/services/materials";

interface Params {
  params: { slug: string };
}

export async function GET(_: Request, { params }: Params) {
  const { slug } = params;

  try {
    const material = await fetchMaterialBySlug(slug);
    return NextResponse.json(material);
  } catch (error: any) {
    console.error(`GET /api/materials/${slug} error:`, error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
