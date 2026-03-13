import { notFound } from "next/navigation";
import {
  getAllMaterialSlugs,
  getMaterialBySlug,
} from "@/lib/materialsService";
import MaterialDetailPageClient, {
  toProductCardProps,
} from "@/components/sections/materialDetailPage/MaterialDetailPageClient";

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

  return <MaterialDetailPageClient product={toProductCardProps(dto)} />;
}
