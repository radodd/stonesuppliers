import { Metadata } from "next";
import ContactUs from "../../../../components/sections/ContactUs";
import { getMaterialBySlug } from "src/lib/getMaterialBySlug";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const material = await getMaterialBySlug(params.slug);

  return {
    title: `${material.name} | MRC Rock & Sand`,
    description:
      material.description ||
      "Explore our range of premium materials for your project",
    alternates: {
      canonical: `https://www.stonesuppliers.net/materials/${params.slug}`,
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
