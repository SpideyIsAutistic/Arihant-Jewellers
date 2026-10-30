"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import Link from "next/link";
import { Badge, PageHeader, Table } from "@/components/admin/ui";

export default function TestimonialsAdmin() {
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const rows = [...site.testimonials].sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <>
      <PageHeader title="Testimonials" action={<Link href="/admin/testimonials/edit?id=new" className="btn px-5 py-2 text-[14px]">+ New testimonial</Link>} />
      <p className="mb-4 max-w-[720px] text-[14px] text-body2">Add genuine customer feedback (with their permission). The home-page Testimonials section is hidden until at least one active testimonial exists.</p>
      <Table head={["Customer", "Quote", "Status"]} empty={rows.length ? undefined : "No testimonials yet."}>
        {rows.map((t) => (
          <tr key={t.id}>
            <td className="px-4 py-3"><Link href={`/admin/testimonials/edit?id=${t.id}`} className="underline-offset-2 hover:underline">{t.name}</Link></td>
            <td className="max-w-[520px] truncate px-4 py-3">{t.quote}</td>
            <td className="px-4 py-3"><Badge tone={t.isActive ? "good" : "neutral"}>{t.isActive ? "Shown" : "Hidden"}</Badge></td>
          </tr>
        ))}
      </Table>
    </>
  );
}
