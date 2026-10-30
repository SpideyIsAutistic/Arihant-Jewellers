"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import Link from "next/link";
import { formatPriceShort } from "@/lib/format";
import { Badge, PageHeader, Table } from "@/components/admin/ui";

export default function CollectionsAdmin() {
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const cols = [...site.collections].sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <>
      <PageHeader title="Collections" action={<Link href="/admin/collections/edit?id=new" className="btn px-5 py-2 text-[14px]">+ New collection</Link>} />
      <p className="mb-4 max-w-[720px] text-[14px] text-body2">
        Collections group products automatically by rules (tag, metal, category, price, on sale) and/or hand-picked products. They are used in menus and home-page tiles.
      </p>
      <Table head={["Title", "URL", "Rules", "Status"]}>
        {cols.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/collections/edit?id=${c.id}`} className="font-medium underline-offset-2 hover:underline">{c.title}</Link>
            </td>
            <td className="px-4 py-3 text-subtle">/collections/{c.slug}</td>
            <td className="px-4 py-3 text-[13px]">
              {[
                c.ruleTag && `tag: ${c.ruleTag}`,
                c.ruleMetal && `metal: ${c.ruleMetal}`,
                c.ruleCategoryId && "category",
                c.ruleMinPrice != null && `≥ ${formatPriceShort(c.ruleMinPrice)}`,
                c.ruleMaxPrice != null && `≤ ${formatPriceShort(c.ruleMaxPrice)}`,
                c.ruleOnSale && "on sale",
                c.productIds && "hand-picked",
              ]
                .filter(Boolean)
                .join(" · ") || "—"}
            </td>
            <td className="px-4 py-3"><Badge tone={c.isActive ? "good" : "neutral"}>{c.isActive ? "Active" : "Hidden"}</Badge></td>
          </tr>
        ))}
      </Table>
    </>
  );
}
