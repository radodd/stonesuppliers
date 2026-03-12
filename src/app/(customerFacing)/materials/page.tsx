import MaterialsSEOContent from "@/components/SEO/MaterialSEOContent";
import ProductGridSection from "../../../components/ProductGridSection";

export default function MaterialsPage() {
  return (
    <div className="flex justify-center">
      {/* SEO + Screen Reader-Only Heading */}
      <MaterialsSEOContent />
      <ProductGridSection title="Materials" />
    </div>
  );
}
