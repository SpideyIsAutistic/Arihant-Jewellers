import { pageMeta } from "@/lib/seo";
import { EnquiryForm } from "@/components/product/EnquiryForm";

export const metadata = pageMeta(
  "Custom Jewellery Design in Thane",
  "Have a design in mind? Send a photo or sketch and Arihant Jewellers, Thane West will make it in gold, diamonds or gemstones. Get a quote.",
  "/pages/custom-design",
);

export default function CustomDesignPage() {
  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">Custom Design</h1>
      <p className="mt-4 mb-10 text-center text-[15px] text-body2">
        Share a photo, a screenshot or a sketch of what you have in mind, plus your budget and the metal you prefer. We&apos;ll come back with ideas, the
        weight and a quote.
      </p>
      <EnquiryForm
        kind="custom"
        product="Custom design"
        withPhoto
        message="I'd like a custom piece. Metal: … Budget: … Needed by: … Details: …"
        submitLabel="Send my design"
        signInText="Please sign in to send us your design."
      />
    </div>
  );
}
