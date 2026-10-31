import { pageMeta } from "@/lib/seo";
import { EnquiryForm } from "@/components/product/EnquiryForm";
import { SchemeDetails } from "./details";

export const metadata = pageMeta(
  "Gold Savings Scheme in Thane",
  "Save a fixed amount every month and buy gold jewellery at the end of the term. Ask Arihant Jewellers, Thane West about our gold savings scheme.",
  "/pages/gold-savings-scheme",
);

export default function SchemePage() {
  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">Gold Savings Scheme</h1>
      <p className="mt-4 mb-8 text-center text-[15px] text-body2">
        Put aside a fixed amount each month and use the total to buy jewellery for a wedding, a festival or yourself, without paying it all at once.
      </p>
      <SchemeDetails />
      <h2 className="mt-12 mb-4 text-[20px] text-ink">Join or ask a question</h2>
      <EnquiryForm
        kind="scheme"
        product="Gold savings scheme"
        message="I'd like to join the gold savings scheme. Please share the details."
        submitLabel="Send"
        signInText="Please sign in to ask about the gold savings scheme."
      />
    </div>
  );
}
