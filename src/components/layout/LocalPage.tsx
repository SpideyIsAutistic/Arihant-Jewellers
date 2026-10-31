import Link from "next/link";
import type { Metadata } from "next";
import type { Lang, LocalPage } from "@/content/local-pages";
import { faqJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import { LiveRatesTable } from "@/app/(store)/gold-rate-today/rates";

/** hreflang set for a page that exists in English, Hindi and Marathi. */
export function localMeta(p: LocalPage, lang: Lang, paths: { en: string; hi: string; mr: string }): Metadata {
  const m = pageMeta(p.title, p.description, paths[lang]);
  return { ...m, alternates: { canonical: paths[lang], languages: { en: paths.en, hi: paths.hi, mr: paths.mr, "x-default": paths.en } } };
}

export function LocalPageView({ p, lang, enPath }: { p: LocalPage; lang: Lang; enPath: string }) {
  return (
    <div lang={lang} className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">{p.h1}</h1>
      <p className="mt-4 text-center text-[16px] leading-relaxed text-body2">{p.intro}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={p.ctaHref} className="btn">{p.cta}</Link>
        <Link href={enPath} className="btn-outline" hrefLang="en">{p.more}</Link>
      </div>
      <LiveRatesTable lang={lang} />
      <section className="mt-12 space-y-6 text-[15px] leading-relaxed text-body2">
        {p.faqs.map((f) => (
          <div key={f.q}>
            <h2 className="mb-1 text-[18px] text-ink">{f.q}</h2>
            <p>{f.a}</p>
          </div>
        ))}
      </section>
      <JsonLd data={faqJsonLd(p.faqs)} />
    </div>
  );
}
