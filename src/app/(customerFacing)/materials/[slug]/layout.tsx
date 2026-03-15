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

  const ogImage = material.imagePrimary
    ? { url: material.imagePrimary, width: 1200, height: 630, alt: material.name }
    : { url: "https://www.stonesuppliers.net/og-image.jpg", width: 1200, height: 630, alt: "MRC Rock & Sand" };

  return {
    title: `${material.name} | MRC Rock & Sand`,
    description:
      material.description ||
      `${material.name} available at MRC Rock & Sand and SPM Santa Paula Materials. Bulk supply of aggregates, gravel, and stone in Santa Paula, CA.`,
    alternates: {
      canonical: `https://www.stonesuppliers.net/materials/${slug}`,
    },
    openGraph: {
      title: `${material.name} | MRC Rock & Sand`,
      description:
        material.description ||
        `${material.name} available at MRC Rock & Sand and SPM Santa Paula Materials. Bulk supply of aggregates, gravel, and stone in Santa Paula, CA.`,
      url: `https://www.stonesuppliers.net/materials/${slug}`,
      siteName: "MRC Rock & Sand",
      images: [ogImage],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${material.name} | MRC Rock & Sand`,
      description:
        material.description ||
        `${material.name} available at MRC Rock & Sand and SPM Santa Paula Materials. Bulk supply of aggregates, gravel, and stone in Santa Paula, CA.`,
      images: [ogImage.url],
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
