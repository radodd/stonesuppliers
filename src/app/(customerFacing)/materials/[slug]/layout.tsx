import { Metadata } from "next";
import ContactUs from "../../../../components/sections/ContactUs";
import { getMaterialBySlug } from "@/lib/getMaterialBySlug";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const material = await getMaterialBySlug(slug);

  return {
    title: `${material.name} | MRC Rock & Sand`,
    description:
      material.description ||
      "Explore our range of premium materials for your project",
    alternates: {
      canonical: `https://www.stonesuppliers.net/materials/${slug}`,
    },
  };
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="">{children}</div>
      <ContactUs />
    </>
  );
}
