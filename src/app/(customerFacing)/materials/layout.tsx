import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materials Catalog | MRC Rock & Sand & SPM Santa Paula Materials",
  description:
    "Browse our full catalog of premium stone, gravel, sand, and recycled materials from MRC Rock & Sand and SPM Santa Paula Materials.",
  alternates: {
    canonical: "https://www.stonesuppliers.net/materials",
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
