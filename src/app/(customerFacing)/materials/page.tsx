import MaterialsSEOContent from "@/components/SEO/MaterialSEOContent";
import MaterialGridSection from "../../../components/MaterialGridSection";

export default function MaterialsPage() {
  return (
    <div className="flex justify-center">
      {/* SEO + Screen Reader-Only Heading */}
      <MaterialsSEOContent />
      <MaterialGridSection title="Materials" />
    </div>
  );
}
