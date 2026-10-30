import { pageMeta } from "@/lib/seo";
import { AppointmentForm } from "@/components/account/AppointmentForm";

export const metadata = pageMeta(
  "Book a Showroom Visit or Video Call",
  "Book a time to see jewellery at Arihant Jewellers, Thane West, or a WhatsApp video call to view pieces live. Open daily 10 AM–2 PM and 5–9:30 PM.",
  "/pages/book-appointment",
);

export default function BookAppointmentPage() {
  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">Book a Visit or Video Call</h1>
      <p className="mt-3 mb-10 text-center text-[15px] text-body2">
        Choose a time and we&apos;ll have the pieces you want ready, at our Thane West showroom or on a WhatsApp video call. Open daily, 10 AM–2 PM and 5–9:30 PM.
      </p>
      <AppointmentForm />
    </div>
  );
}
