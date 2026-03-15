import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Rock Reclamation, Recycling & Crushing – MRC & SPM",
  description:
    "Explore MRC Rock & Sand and SPM Santa Paula Materials' full range of services including recycled building materials, rock reclamation, and custom crushing and screening for construction and landscaping needs across Southern California.",
  alternates: {
    canonical: "https://www.stonesuppliers.net/services",
  },
  openGraph: {
    title: "Our Services | Rock Reclamation, Recycling & Crushing – MRC & SPM",
    description:
      "Rock reclamation, recycling, and custom crushing & screening services across Southern California.",
    url: "https://www.stonesuppliers.net/services",
    siteName: "MRC Rock & Sand",
    images: [
      {
        url: "https://www.stonesuppliers.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MRC Rock & Sand — Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services | Rock Reclamation, Recycling & Crushing – MRC & SPM",
    description:
      "Rock reclamation, recycling, and custom crushing & screening services across Southern California.",
    images: ["https://www.stonesuppliers.net/og-image.jpg"],
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
