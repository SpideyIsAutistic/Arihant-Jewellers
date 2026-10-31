"use client";

import { useLoad, useTitle } from "@/lib/use-load";
import { PageLoader } from "@/components/ui/PageLoader";
import Link from "next/link";
import { getSettings, type StoreSettings } from "@/lib/settings";
import { fillPolicy } from "@/lib/policies";
import { AccordionItem } from "@/components/ui/Accordion";

export default function FaqClient({ initialSettings }: { initialSettings?: StoreSettings }) {
  const { data: sData, error } = useLoad(getSettings);
  const s = sData ?? initialSettings;
  useTitle("FAQs");
  if (!s) return <PageLoader error={error} />;
  const faqs = s.faqs.map((f) => ({ q: f.q, a: fillPolicy(f.a, s) }));
  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">Frequently Asked Questions</h1>
      <div className="mt-10 border-t border-line">
        {faqs.map((f, i) => (
          <AccordionItem key={i} title={f.q}>
            <p>{f.a}</p>
          </AccordionItem>
        ))}
      </div>
      <p className="mt-10 text-center text-[15px] text-body2">
        Still have a question?{" "}
        <Link href="/pages/contact" className="underline underline-offset-2">
          Contact us
        </Link>
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </div>
  );
}
