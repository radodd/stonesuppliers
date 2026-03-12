import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Rock Reclamation, Recycling & Crushing – MRC & SPM",
  description:
    "Explore MRC Rock & Sand and SPM Santa Paula Materials' full range of services including recycled building materials, rock reclamation, and custom crushing and screening for construction and landscaping needs across Southern California.",
  alternates: {
    canonical: "https://www.stonesuppliers.net/services",
  },
};

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div>{children}</div>;
};

export default layout;
