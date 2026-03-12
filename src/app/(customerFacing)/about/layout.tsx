import FAQSchema from "@/components/SEO/FAQSchema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | MRC Rock & Sand & SPM Santa Paula Materials",
  description:
    "Learn about MRC Rock & Sand and SPM Santa Paula Materials—Southern California’s trusted providers of premium stone, aggregates, and recycled materials.",
  alternates: {
    canonical: "https://www.stonesuppliers.net/about",
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are the delivery options of MRC Rock & Sand?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MRC Rock & Sand offers delivery service from flat beds to semi end dumps all over California.",
        },
      },
      {
        "@type": "Question",
        name: "Who does MRC Rock & Sand sell to?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MRC Rock & Sand sells to both commercial and residential clients.",
        },
      },
      {
        "@type": "Question",
        name: "Can I 'will call' material or send in my own truck to MRC Rock & Sand?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, MRC Rock & Sand allows materials to be picked up at a number of their yards. Please contact the company to determine which location to visit.",
        },
      },
      {
        "@type": "Question",
        name: "How is MRC Rock & Sand's material packaged? (bulk/loose or palletized)",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MRC Rock & Sand mainly sells in bulk by the ton but also offers cobble that has been palletized in various sizes.",
        },
      },
      {
        "@type": "Question",
        name: "Does MRC Rock & Sand have a minimum purchase requirement?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MRC Rock & Sand's minimum purchase for delivery is 10 tons.",
        },
      },
      {
        "@type": "Question",
        name: "What areas of the United States does MRC Rock & Sand serve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MRC Rock & Sand currently only services California.",
        },
      },
    ],
  };

  return (
    <>
      <script
        async
        src=" "
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div>{children}</div>
    </>
  );
}
