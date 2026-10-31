import { pageMeta } from "@/lib/seo";
import { AppointmentForm } from "@/components/account/AppointmentForm";

export const metadata = pageMeta(
  "WhatsApp & Showroom Enquiry",
  "Enquire about jewellery at Arihant Jewellers, Thane West, or chat with us on WhatsApp to view pieces live. Open daily 10 AM–2 PM and 5–9:30 PM.",
  "/pages/book-appointment",
);

export default function BookAppointmentPage() {
  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">WhatsApp &amp; Showroom Enquiry</h1>
      <p className="mt-3 mb-10 text-center text-[15px] text-body2">
        Let us know what pieces you are interested in and our team will connect with you directly on WhatsApp or phone. Open daily, 10 AM–2 PM and 5–9:30 PM.
      </p>
      <AppointmentForm />
    </div>
  );
}
