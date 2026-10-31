import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES } from "@/content/guides";
import { faqJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import { getServerSiteData } from "@/lib/server-catalog";
import { absoluteUrl } from "@/lib/utils";
import { Img } from "@/components/ui/Img";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const g = GUIDES.find((x) => x.slug === slug);
  return g ? pageMeta(g.title, g.description, `/guides/${g.slug}`) : {};
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) notFound();
  // stones in the catalogue at build time (an unlisted stone simply shows its "not found" page)
  const stones = getServerSiteData().products.filter((p) => p.isActive && p.categoryId === "gemstones" && g.stone.includes(p.stone ?? ""));
  const url = absoluteUrl(`/guides/${g.slug}`);
  return (
    <article className="narrow-width py-14 sm:py-20">
      <nav className="mb-6 text-[13px] text-subtle">
        <Link href="/" className="hover:underline">Home</Link> / <Link href="/guides" className="hover:underline">Gemstone guides</Link> / {g.name}
      </nav>
      <h1 className="font-serif text-[clamp(30px,4vw,44px)] leading-tight text-ink">{g.title}</h1>
      <p className="mt-5 text-[17px] leading-relaxed text-body2">{g.intro}</p>
      {g.sections.map((s) => (
        <section key={s.h} className="mt-10">
          <h2 className="mb-3 text-[22px] text-ink">{s.h}</h2>
          {s.p.map((t, i) => (
            <p key={i} className="mt-3 text-[15px] leading-relaxed text-body2">{t}</p>
          ))}
        </section>
      ))}
      {stones.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 text-[22px] text-ink">{g.name} at Arihant Jewellers</h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stones.map((p) => (
              <li key={p.id}>
                <Link href={`/products/${p.slug}`} className="group block">
                  <span className="relative block aspect-[4/5] overflow-hidden bg-cream-2">
                    {p.images[0] && <Img src={p.images[0].url} alt={p.images[0].alt || p.name} fill sizes="(min-width:640px) 30vw, 50vw" className="object-cover transition-transform group-hover:scale-105" />}
                  </span>
                  <span className="mt-2 block text-[14px]">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="mt-12">
        <h2 className="mb-3 text-[22px] text-ink">Questions</h2>
        {g.faqs.map((f) => (
          <div key={f.q} className="mt-5">
            <h3 className="font-medium text-ink">{f.q}</h3>
            <p className="mt-1 text-[15px] leading-relaxed text-body2">{f.a}</p>
          </div>
        ))}
      </section>
      <p className="mt-12 border-t border-line pt-6 text-[15px] text-body2">
        Want to see stones in person?{" "}
        <Link href="/pages/contact" className="underline">Enquire on WhatsApp</Link>, or browse all{" "}
        <Link href="/collections/gemstones" className="underline">gemstones</Link>.
      </p>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.description,
          url,
          author: { "@type": "Organization", name: "Arihant Jewellers" },
          publisher: { "@type": "Organization", name: "Arihant Jewellers" },
          image: stones[0]?.images[0] ? absoluteUrl(stones[0].images[0].url) : absoluteUrl("/og/default.jpg"),
        }}
      />
      <JsonLd data={faqJsonLd(g.faqs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Gemstone guides", item: absoluteUrl("/guides") },
            { "@type": "ListItem", position: 3, name: g.name, item: url },
          ],
        }}
      />
    </article>
  );
}
