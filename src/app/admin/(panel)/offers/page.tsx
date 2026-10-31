"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/format";
import { isOfferLive } from "@/lib/pricing";
import { Badge, PageHeader, Table } from "@/components/admin/ui";

export default function OffersAdmin() {
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const offers = [...site.offers].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const cats = site.categories;
  const cols = site.collections;
  const target = (o: (typeof offers)[number]) =>
    o.appliesTo === "all"
      ? "All products"
      : o.appliesTo === "metal"
        ? `All ${o.target}`
        : o.appliesTo === "category"
          ? `Category: ${cats.find((c) => c.id === o.target)?.name ?? "?"}`
          : o.appliesTo === "collection"
            ? `Collection: ${cols.find((c) => c.id === o.target)?.title ?? "?"}`
            : `${(o.target ?? "").split(",").filter(Boolean).length} products`;
  return (
    <>
      <PageHeader title="Offers & Sales" action={<Link href="/admin/offers/edit?id=new" className="btn px-5 py-2 text-[14px]">+ New offer</Link>} />
      <p className="mb-4 max-w-[720px] text-[14px] text-body2">
        Offers reduce displayed prices automatically (e.g. “25% off all silver”) and show a “Save N%” badge. When several offers match a product, the biggest discount wins. For codes customers type at checkout, use Coupons.
      </p>
      <Table head={["Offer", "Discount", "Applies to", "Schedule", "Status"]} empty={offers.length ? undefined : "No offers yet."}>
        {offers.map((o) => (
          <tr key={o.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/offers/edit?id=${o.id}`} className="font-medium underline-offset-2 hover:underline">{o.name}</Link>
            </td>
            <td className="px-4 py-3">{o.kind === "percent" ? `${o.value}%` : formatPrice(o.value)}</td>
            <td className="px-4 py-3">{target(o)}</td>
            <td className="px-4 py-3 text-[13px]">
              {o.startsAt ? formatDate(o.startsAt) : "Now"} → {o.endsAt ? formatDate(o.endsAt) : "No end"}
            </td>
            <td className="px-4 py-3">
              <Badge tone={isOfferLive(o) ? "good" : o.isActive ? "warn" : "neutral"}>{isOfferLive(o) ? "Live" : o.isActive ? "Scheduled/ended" : "Off"}</Badge>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
