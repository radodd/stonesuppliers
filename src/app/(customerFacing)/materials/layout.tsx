import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materials Catalog | MRC Rock & Sand & SPM Santa Paula Materials",
  description:
    "Browse our full catalog of premium stone, gravel, sand, and recycled materials from MRC Rock & Sand and SPM Santa Paula Materials.",
  alternates: {
    canonical: "https://www.stonesuppliers.net/materials",
  },
  openGraph: {
    title: "Materials Catalog | MRC Rock & Sand & SPM Santa Paula Materials",
    description:
      "Browse our full catalog of premium stone, gravel, sand, and recycled materials.",
    url: "https://www.stonesuppliers.net/materials",
    siteName: "MRC Rock & Sand",
    images: [
      {
        url: "https://www.stonesuppliers.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MRC Rock & Sand — Materials Catalog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Materials Catalog | MRC Rock & Sand & SPM Santa Paula Materials",
    description:
      "Browse our full catalog of premium stone, gravel, sand, and recycled materials.",
    images: ["https://www.stonesuppliers.net/og-image.jpg"],
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="">{children}</div>
    </>
  );
}
