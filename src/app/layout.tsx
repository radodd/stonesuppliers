import type { Metadata } from "next";
import { Inter, Open_Sans, Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import Script from "next/script";

import { Providers } from "../components/Providers";
import { Toaster } from "../components/ui/toaster";
import { FilterProvider } from "../context/FilterContext";
import { CartProvider } from "../context/CartContext";
import Footer from "../components/Footer";
import LocalBusinessSchema from "@/components/SEO/LocalBusinessSchema";
import OrganizationSchema from "@/components/SEO/OrganizationSchema";
import WebsiteSchema from "@/components/SEO/WebsiteSchema";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-openSans" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: "400",
});

export const metadata: Metadata = {
  title: "MRC Rock & Sand",
  description:
    "Premium stone, aggregates, and recycled materials from MRC Rock & Sand and SPM Santa Paula Materials. Serving all construction and landscaping needs.",
  alternates: {
    canonical: "https://www.stonesuppliers.net",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MRC Rock & Sand | SPM Santa Paula Materials | Stoneyard",
    alternateName: "SPM Santa Paula Materials",
    url: "https://www.stonesuppliers.net",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MRC Rock & Sand",
    alternateName: "SPM Santa Paula Materials",
    url: "https://www.stonesuppliers.net",
    logo: "https://www.stonesuppliers.net/logo_rocks.png",
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "MRC Rock & Sand",
    alternateName: "SPM Santa Paula Materials",
    image: "https://www.stonesuppliers.net/image_carousel_spm.png",
    "@id": "",
    url: "https://www.stonesuppliers.net/",
    telephone: "(805) 525-6858",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1224 E Santa Clara St",
      addressLocality: "Santa Paula",
      addressRegion: "CA",
      postalCode: "93060",
      addressCountry: "US",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    logo: "https://www.stonesuppliers.net/logo_rocks.png",
  };

  return (
    <html lang="en">
      <head>
        {/* LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        {/* Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* <title>MRC Rock & Sand | SPM Santa Paula Materials</title> */}
        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        )}
      </head>

      <body
        className={cn(
          "bg-whitebase min-h-screen  antialiased",
          inter.variable,
          openSans.variable,
          montserrat.variable,
          roboto.variable,
        )}
      >
        {/* Google Tag Manager (noscript) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <div className="flex-grow min-h-screen">
          <Providers>
            <FilterProvider>
              <CartProvider>{children}</CartProvider>
            </FilterProvider>
          </Providers>
        </div>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
