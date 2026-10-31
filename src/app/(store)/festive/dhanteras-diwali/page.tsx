import Link from "next/link";
import { faqJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import { getServerSiteData } from "@/lib/server-catalog";
import { LiveRatesTable } from "@/app/(store)/gold-rate-today/rates";
import { MiniProductGrid } from "@/components/product/MiniProductGrid";

export const metadata = {
  ...pageMeta(
    "Dhanteras & Diwali Gold in Thane",
    "Dhanteras is Friday 6 November 2026. See festive gold, silver idols and gemstones at Arihant Jewellers, Thane West, and enquire on WhatsApp.",
    "/festive/dhanteras-diwali",
  ),
  alternates: {
    canonical: "/festive/dhanteras-diwali",
    languages: { en: "/festive/dhanteras-diwali", hi: "/hi/dhanteras", mr: "/mr/dhanteras", "x-default": "/festive/dhanteras-diwali" },
  },
};

const FAQS = [
  { q: "When is Dhanteras in 2026?", a: "Dhanteras falls on Friday, 6 November 2026, at the start of the Diwali festival days." },
  {
    q: "What do people buy on Dhanteras?",
    a: "Gold and silver are traditionally bought on Dhanteras as a sign of prosperity: gold coins and jewellery, silver coins, utensils and idols of Lakshmi and Ganesha for the Diwali puja.",
  },
  {
    q: "Can I reserve a piece before Dhanteras?",
    a: "Yes. Enquire on WhatsApp and our team will keep the pieces you like ready. The final price follows the gold rate on the day you buy.",
  },
  { q: "Is your gold hallmarked?", a: "Gold jewellery sold in India must carry the BIS hallmark with its purity and HUID code. Ask us to show you the hallmark on any piece." },
];

export default function DhanterasPage() {
  const products = getServerSiteData().products.filter((p) => p.isActive);
  const festive = products.filter((p) => p.tags.split(",").includes("festive"));
  const silver = products.filter((p) => p.categoryId === "silver-articles");
  const picks = [...silver, ...festive.filter((p) => !silver.includes(p))].slice(0, 9);
  return (
    <div className="narrow-width py-14 sm:py-20">
      <p className="text-center text-[12px] tracking-[0.2em] text-subtle uppercase">Dhanteras · Friday 6 November 2026</p>
      <h1 className="h-section mt-2">Dhanteras &amp; Diwali at Arihant</h1>
      <p className="mt-4 text-center text-[16px] text-body2">
        Gold, silver idols for the home temple, and festive jewellery for the family, at our showroom on Ghodbunder Road, Thane West. Connect with us on WhatsApp
        so we have your pieces ready, especially on the busy Dhanteras weekend.
      </p>
      <p className="mt-3 text-center text-[14px]">
        <Link href="/hi/dhanteras" hrefLang="hi" className="underline">हिंदी में पढ़ें</Link> ·{" "}
        <Link href="/mr/dhanteras" hrefLang="mr" className="underline">मराठीत वाचा</Link>
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/pages/contact" className="btn">
          WhatsApp Enquiry
        </Link>
        <Link href="/collections/catalogue" className="btn-outline">
          Explore the collection
        </Link>
      </div>
      {picks.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-[22px] text-ink">Festive picks</h2>
          <MiniProductGrid products={picks} />
        </section>
      )}
      <section className="mt-14">
        <h2 className="text-[22px] text-ink">Today&apos;s gold rate</h2>
        <LiveRatesTable />
      </section>
      <section className="mt-14 space-y-6 text-[15px] leading-relaxed text-body2">
        {FAQS.map((f) => (
          <div key={f.q}>
            <h2 className="mb-1 text-[18px] text-ink">{f.q}</h2>
            <p>{f.a}</p>
          </div>
        ))}
        <p>
          Exchanging old gold this Diwali? <Link href="/gold-exchange" className="underline">Estimate its value</Link>, or read about our{" "}
          <Link href="/pages/gold-savings-scheme" className="underline">gold savings scheme</Link> for next year&apos;s festivals.
        </p>
      </section>
      <JsonLd data={faqJsonLd(FAQS)} />
    </div>
  );
}
