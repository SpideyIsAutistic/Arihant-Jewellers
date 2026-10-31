"use client";

import { Img } from "@/components/ui/Img";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Badge, PageHeader, Table } from "@/components/admin/ui";
import { toggleProduct } from "@/lib/actions/admin";

type SP = Promise<{ q?: string; category?: string; sample?: string; stock?: string; status?: string }>;

export default function ProductsAdmin() {
  const params = useSearchParams();
  const sp = Object.fromEntries(params.entries()) as { q?: string; category?: string; sample?: string; stock?: string; status?: string };
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const cats = [...site.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const rows = [...site.products]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((p) => ({ ...p, category: site.categories.find((c) => c.id === p.categoryId) ?? null }));
  const q = (sp.q ?? "").toLowerCase().trim();
  const list = rows.filter((p) => {
    if (q && !`${p.name} ${p.sku} ${p.tags}`.toLowerCase().includes(q)) return false;
    if (sp.category && p.categoryId !== sp.category) return false;
    if (sp.sample === "1" && !p.isSample) return false;
    if (sp.status === "draft" && p.isActive) return false;
    if (sp.status === "live" && !p.isActive) return false;
    return true;
  });
  return (
    <>
      <PageHeader
        title={`Products (${list.length})`}
        action={
          <Link href="/admin/products/new" className="btn px-5 py-2 text-[14px]">
            + New product
          </Link>
        }
      />
      <form className="mb-4 flex flex-wrap gap-2" action="/admin/products">
        <input name="q" defaultValue={sp.q} placeholder="Search name, SKU or tag" className="input max-w-[280px] py-2 text-[14px]" />
        <select name="category" defaultValue={sp.category ?? ""} className="input max-w-[200px] py-2 text-[14px]">
          <option value="">All categories</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="stock" defaultValue={sp.stock ?? ""} className="input max-w-[160px] py-2 text-[14px]">
          <option value="">Any stock</option>
          <option value="low">Low stock (≤1)</option>
        </select>
        <select name="status" defaultValue={sp.status ?? ""} className="input max-w-[170px] py-2 text-[14px]">
          <option value="">Listed & unlisted</option>
          <option value="live">Listed only</option>
          <option value="draft">Unlisted only</option>
        </select>
        <select name="sample" defaultValue={sp.sample ?? ""} className="input max-w-[170px] py-2 text-[14px]">
          <option value="">All products</option>
          <option value="1">Sample products</option>
        </select>
        <button className="btn-outline px-4 py-2 text-[13px]">Filter</button>
      </form>
      <Table head={["", "Product", "Category", "Price", "Stock", "Status", ""]} empty={list.length ? undefined : "No products match."}>
        {list.map((p) => {
          const stock = p.variants.reduce((s, v) => s + v.stock, 0);
          const img = p.images[0]?.url;
          return (
            <tr key={p.id}>
              <td className="w-[64px] px-4 py-2">
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <span className="relative block h-12 w-12 overflow-hidden"><Img src={img} alt="" fill sizes="48px" className="object-cover" /></span>
                )}
              </td>
              <td className="px-4 py-2">
                <Link href={`/admin/products/edit?id=${p.id}`} className="font-medium underline-offset-2 hover:underline">
                  {p.name}
                </Link>
                <p className="text-[12px] text-subtle">
                  {p.sku} · {p.metal}
                  {p.isSample && (
                    <>
                      {" "}
                      · <Badge tone="warn">Sample</Badge>
                    </>
                  )}
                </p>
              </td>
              <td className="px-4 py-2">{p.category?.name ?? "—"}</td>
              <td className="px-4 py-2">{formatPrice(p.price)}</td>
              <td className="px-4 py-2">
                <Badge tone={stock === 0 ? "bad" : p.variants.some((v) => v.stock <= 1) ? "warn" : "neutral"}>{stock}</Badge>
              </td>
              <td className="px-4 py-2">
                <form action={toggleProduct} className="flex items-center gap-2 whitespace-nowrap">
                  <input type="hidden" name="id" value={p.id} />
                  <Badge tone={p.isActive ? "good" : "neutral"}>{p.isActive ? "Listed" : "Unlisted"}</Badge>
                  <button className="btn-outline px-3 py-1 text-[12px]">{p.isActive ? "Unlist" : "List"}</button>
                </form>
              </td>
              <td className="px-4 py-2 text-right">
                <Link href={`/products/${p.slug}`} target="_blank" className="text-[13px] text-subtle hover:text-ink">
                  View ↗
                </Link>
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
