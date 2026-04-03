const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MRC Rock & Sand | SPM Santa Paula Materials | Stoneyard",
  url: "https://www.stonesuppliers.net",
};

const WebsiteSchema = () => {
  return (
    <script
      type="application/json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
};

export default WebsiteSchema;
