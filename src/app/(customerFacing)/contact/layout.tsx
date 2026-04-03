import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | MRC Rock & Sand & SPM Santa Paula Materials",
  description:
    "Get in touch with MRC Rock & Sand and SPM Santa Paula Materials for pricing, delivery, and material inquiries.",
  alternates: {
    canonical: "https://www.stonesuppliers.net/contact",
  },
  openGraph: {
    title: "Contact Us | MRC Rock & Sand & SPM Santa Paula Materials",
    description:
      "Get in touch with MRC Rock & Sand for pricing, delivery, and material inquiries.",
    url: "https://www.stonesuppliers.net/contact",
    siteName: "MRC Rock & Sand",
    images: [
      {
        url: "https://www.stonesuppliers.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MRC Rock & Sand — Contact Us",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | MRC Rock & Sand & SPM Santa Paula Materials",
    description:
      "Get in touch with MRC Rock & Sand for pricing, delivery, and material inquiries.",
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
