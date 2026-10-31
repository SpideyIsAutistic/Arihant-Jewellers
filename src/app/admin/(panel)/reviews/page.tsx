"use client";

import Link from "next/link";
import { formatDate } from "@/lib/format";
import { listPendingReviews, moderateReview } from "@/lib/actions/admin";
import { loadSite } from "@/lib/data";
import { useLoad } from "@/lib/use-load";
import { Badge, PageHeader } from "@/components/admin/ui";
import { PageLoader } from "@/components/ui/PageLoader";

const load = () => Promise.all([loadSite(true), listPendingReviews()]);

export default function ReviewsAdmin() {
  const { data, error } = useLoad(load);
  if (!data) return <PageLoader error={error} />;
  const [site, pending] = data;
  const rows = [...pending, ...[...site.reviews].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())].map((r) => {
    const p = site.products.find((x) => x.id === r.productId);
    return { r, productName: p?.name ?? "(deleted product)", slug: p?.slug ?? "" };
  });
  return (
    <>
      <PageHeader title="Reviews" />
      <p className="mb-4 text-[14px] text-body2">Customer reviews appear on product pages only after you approve them.</p>
      {rows.length === 0 && <p className="border border-line bg-white px-4 py-10 text-center text-subtle">No reviews yet.</p>}
      <ul className="space-y-3">
        {rows.map(({ r, productName, slug }) => (
          <li key={r.id} className="border border-line bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[14px]">
                <b>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</b> · {r.name} {r.email && <span className="text-subtle">({r.email})</span>} ·{" "}
                <Link href={`/products/${slug}`} target="_blank" className="underline">
                  {productName}
                </Link>{" "}
                · <span className="text-subtle">{formatDate(r.createdAt)}</span>
              </p>
              <Badge tone={r.isApproved ? "good" : "warn"}>{r.isApproved ? "Published" : "Pending"}</Badge>
            </div>
            {r.title && <p className="mt-2 font-semibold">{r.title}</p>}
            <p className="mt-1 text-[14px] whitespace-pre-line text-body2">{r.body}</p>
            <div className="mt-3 flex gap-4 text-[13px]">
              {(["approve", "unapprove", "delete"] as const)
                .filter((a) => (a === "approve" ? !r.isApproved : a === "unapprove" ? r.isApproved : true))
                .map((a) => (
                  <form key={a} action={moderateReview}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="action" value={a} />
                    <button className={a === "delete" ? "text-danger underline-offset-2 hover:underline" : "underline underline-offset-2"}>
                      {a === "approve" ? "Approve" : a === "unapprove" ? "Unpublish" : "Delete"}
                    </button>
                  </form>
                ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
