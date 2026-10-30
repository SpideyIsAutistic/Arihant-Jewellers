import Link from "next/link";
import { pageMeta, faqJsonLd, JsonLd } from "@/lib/seo";
import { LiveRatesTable } from "./rates";

export const metadata = pageMeta(
  "Gold Rate Today in Thane (22K, 24K, 18K)",
  "Today's gold and silver rate in Thane per gram and per 10 grams for 24K, 22K and 18K gold, from Arihant Jewellers, Ghodbunder Road.",
  "/gold-rate-today",
);

const FAQS = [
  {
    q: "What is the difference between 24K, 22K and 18K gold?",
    a: "24K gold is 99.9% pure and is used for coins and bars. 22K gold (91.6% pure, hallmark 916) is the usual choice for Indian gold jewellery. 18K gold (75% pure, hallmark 750) is harder, so it is used for diamond and gemstone jewellery that needs a strong setting.",
  },
  {
    q: "How is the price of gold jewellery worked out?",
    a: "Price = weight of gold × today's rate for its purity, plus making charges for the design, plus the value of any diamonds or gemstones, plus 3% GST. Our team gives you the full breakdown before you buy.",
  },
  {
    q: "Why can the showroom price differ from the rate on this page?",
    a: "Gold rates move during the day. This page shows the rate stored when it was last updated (the time is shown above the table). For a firm quote, message us on WhatsApp or visit the showroom.",
  },
  {
    q: "Is the gold at Arihant Jewellers hallmarked?",
    a: "Gold jewellery sold in India must carry the BIS hallmark with its purity and a unique HUID code. Ask our team to show you the hallmark on any piece.",
  },
];

export default function GoldRatePage() {
  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">Gold Rate Today in Thane</h1>
      <p className="mt-4 text-center text-[15px] text-body2">
        Today&apos;s gold and silver rates at Arihant Jewellers, Ghodbunder Road, Thane West, per gram and per 10 grams.
      </p>
      <LiveRatesTable />
      <div className="mt-12 space-y-8 text-[15px] leading-relaxed text-body2">
        {FAQS.map((f) => (
          <section key={f.q}>
            <h2 className="mb-2 text-[18px] text-ink">{f.q}</h2>
            <p>{f.a}</p>
          </section>
        ))}
        <p>
          Looking for a piece? Browse our <Link href="/collections/gold-jewellery" className="underline">gold jewellery</Link>,{" "}
          <Link href="/collections/mangalsutra" className="underline">mangalsutras</Link> and <Link href="/collections/chains" className="underline">gold chains</Link>, or{" "}
          <Link href="/pages/book-appointment" className="underline">book a showroom visit</Link>.
        </p>
      </div>
      <JsonLd data={faqJsonLd(FAQS)} />
    </div>
  );
}
