import { NextResponse } from "next/server";
import { getAllMaterials } from "@/lib/materialsService";

export async function GET() {
  try {
    const materials = await getAllMaterials();

    if (materials.length === 0) {
      return NextResponse.json({ error: "No Materials found" }, { status: 404 });
    }

    return NextResponse.json(materials, {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/materials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
