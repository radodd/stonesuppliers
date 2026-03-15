import { notFound } from "next/navigation";
import {
  getAllMaterialSlugs,
  getMaterialBySlug,
  type MaterialDetailDTO,
} from "@/lib/materialsService";
import MaterialDetailPageClient, {
  type ProductCardProps,
} from "@/components/sections/materialDetailPage/MaterialDetailPageClient";

function toProductCardProps(dto: MaterialDetailDTO): ProductCardProps {
  return {
    id: String(dto.id),
    slug: dto.slug,
    name: dto.name,
    description: dto.description,
    imagePrimary: dto.imagePrimary,
    imagePath: dto.images,
    company: dto.company,
    color: dto.color,
    uses: dto.uses,
    categories: dto.categories,
    texture: dto.texture,
  };
}

export async function generateStaticParams() {
  const slugs = await getAllMaterialSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dto = await getMaterialBySlug(slug);

  if (!dto) notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: dto.name,
    description: dto.description,
    ...(dto.imagePrimary && { image: dto.imagePrimary }),
    brand: { "@type": "Brand", name: "MRC Rock & Sand" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "MRC Rock & Sand" },
      areaServed: { "@type": "State", name: "California" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <MaterialDetailPageClient product={toProductCardProps(dto)} />
    </>
  );
}
