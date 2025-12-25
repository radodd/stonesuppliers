const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "MRC Rock & Sand | SPM Santa Paula Materials | Stoneyard",
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
  logo: "https://stonesuppliers.net/logo_rocks.png",
};

const LocalBusinessSchema = () => {
  return (
    <script
      type="application/json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
};

export default LocalBusinessSchema;
