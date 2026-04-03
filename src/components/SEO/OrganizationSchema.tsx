const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MRC Rock & Sand | SPM Santa Paula Materials | Stoneyard",
  url: "https://www.stonesuppliers.net",
  logo: "https://www.stonesuppliers.net/logo_rocks.png",
};

const OrganizationSchema = () => {
  return (
    <script
      type="application/json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
};

export default OrganizationSchema;
