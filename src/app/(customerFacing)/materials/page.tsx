import MaterialsSEOContent from "@/components/SEO/MaterialSEOContent";
import MaterialGridSection from "../../../components/MaterialGridSection";
import { getAllMaterials } from "@/lib/materialsService";
import type { Material } from "@/lib/filterMaterials";

// ISR: regenerate this page at most once per hour.
export const revalidate = 3600;

export default async function MaterialsPage() {
  const rawMaterials = await getAllMaterials();

  // Map MaterialListDTO → Material (flat shape expected by FilterContext/MaterialGridSection)
  const initialProducts: Material[] = rawMaterials.map((m) => ({
    id: String(m.id),
    slug: m.slug,
    name: m.name,
    description: m.description,
    imagePrimary: m.imagePrimary,
    company: m.company,
    color: m.color,
    uses: m.uses,
    texture: m.texture,
    category: m.categories.map((cat) => cat.name),
    size: m.categories.flatMap((cat) => cat.sizes),
  }));

  return (
    <div className="flex justify-center">
      {/* SEO + Screen Reader-Only Heading */}
      <MaterialsSEOContent />
      <MaterialGridSection title="Materials" initialProducts={initialProducts} />
    </div>
  );
}
