"use client";

import { Img } from "@/components/ui/Img";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import Link from "next/link";
import { Badge, PageHeader } from "@/components/admin/ui";

const LABEL: Record<string, string> = {
  hero: "Home — hero slideshow",
  promo: "Home — “Made to be worn” slideshow",
  recipient: "Home — Shop by Recipient tiles",
  occasion: "Home — Shop by Occasion tiles",
  look: "Home — Shop the Look",
  collections: "Home — Explore our Collections slideshow",
  instagram: "Home — Instagram strip (shown when an Instagram URL is set)",
  category: "Spare / custom",
};

export default function BannersAdmin() {
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const rows = [...site.banners].sort((a, b) => a.sortOrder - b.sortOrder);
  const groups = Object.keys(LABEL).map((k) => ({ key: k, rows: rows.filter((r) => r.placement === k) }));
  return (
    <>
      <PageHeader title="Banners & Home page" action={<Link href="/admin/banners/edit?id=new" className="btn px-5 py-2 text-[14px]">+ New banner</Link>} />
      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.key}>
            <h2 className="mb-3 text-[13px] font-semibold tracking-[0.1em] text-subtle uppercase">{LABEL[g.key]}</h2>
            {g.rows.length === 0 ? (
              <p className="text-[14px] text-subtle">None — this section is hidden.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {g.rows.map((b) => (
                  <li key={b.id}>
                    <Link href={`/admin/banners/edit?id=${b.id}`} className="block border border-line bg-white transition-colors hover:border-ink">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <span className="relative block aspect-[4/3] w-full overflow-hidden"><Img src={b.image} alt="" fill sizes="360px" className="object-cover" /></span>
                      <div className="p-2.5 text-[13px]">
                        <p className="truncate font-medium">{b.title || "(no title)"}</p>
                        <p className="mt-1 flex items-center justify-between text-subtle">
                          #{b.sortOrder} <Badge tone={b.isActive ? "good" : "neutral"}>{b.isActive ? "On" : "Off"}</Badge>
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
