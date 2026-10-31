import Link from "next/link";
import { faqJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import { ExchangeCalculator } from "./calculator";

export const metadata = pageMeta(
  "Old Gold Exchange Calculator, Thane",
  "Estimate what your old gold is worth at today's rate, then get a firm quote and exchange it for new jewellery at Arihant Jewellers, Thane West.",
  "/gold-exchange",
);

const FAQS = [
  { q: "How is old gold valued?", a: "We test the purity of your gold at the showroom, weigh it, and value it at today's rate for that purity. Our team explains any deductions before you decide." },
  { q: "Do I need the original bill?", a: "Bring the bill if you have it, along with a photo ID. Ask us if you don't have the bill." },
  { q: "Can I exchange for new jewellery?", a: "Yes. The value of your old gold can be adjusted against any new piece you choose." },
];

export default function GoldExchangePage() {
  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">Old Gold Exchange</h1>
      <p className="mt-4 text-center text-[15px] text-body2">
        Find out roughly what your old gold is worth at today&apos;s rate, then send us the details for a firm quote. See the{" "}
        <Link href="/gold-rate-today" className="underline">gold rate today</Link>.
      </p>
      <ExchangeCalculator />
      <section className="mt-12 space-y-6 text-[15px] leading-relaxed text-body2">
        {FAQS.map((f) => (
          <div key={f.q}>
            <h2 className="mb-1 text-[18px] text-ink">{f.q}</h2>
            <p>{f.a}</p>
          </div>
        ))}
      </section>
      <JsonLd data={faqJsonLd(FAQS)} />
    </div>
  );
}
