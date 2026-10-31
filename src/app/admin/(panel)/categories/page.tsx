"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import Link from "next/link";
import { Badge, PageHeader, Table } from "@/components/admin/ui";

export default function CategoriesAdmin() {
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const cats = [...site.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const m = new Map<string | null, number>();
  for (const p of site.products) m.set(p.categoryId, (m.get(p.categoryId) ?? 0) + 1);
  return (
    <>
      <PageHeader title="Categories" action={<Link href="/admin/categories/edit?id=new" className="btn px-5 py-2 text-[14px]">+ New category</Link>} />
      <Table head={["Name", "URL", "Products", "Order", "Status"]}>
        {cats.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/categories/edit?id=${c.id}`} className="font-medium underline-offset-2 hover:underline">{c.name}</Link>
            </td>
            <td className="px-4 py-3 text-subtle">/collections/{c.slug}</td>
            <td className="px-4 py-3">{m.get(c.id) ?? 0}</td>
            <td className="px-4 py-3">{c.sortOrder}</td>
            <td className="px-4 py-3"><Badge tone={c.isActive ? "good" : "neutral"}>{c.isActive ? "Active" : "Hidden"}</Badge></td>
          </tr>
        ))}
      </Table>
    </>
  );
}
