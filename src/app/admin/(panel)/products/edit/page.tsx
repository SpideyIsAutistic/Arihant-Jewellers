"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/client";
import { deleteProduct } from "@/lib/actions/admin";
import { ProductForm } from "../../ProductForm";

export default function EditProduct() {
  const id = useParam("id");
  const saved = useParam("saved");
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const product = site.products.find((p) => p.id === id);
  const categories = [...site.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  if (!product) notFound();
  return (
    <>
      <PageHeader
        title={product.name}
        back={{ href: "/admin/products", label: "Products" }}
        action={
          <div className="flex items-center gap-4">
            <Link href={`/products/${product.slug}`} target="_blank" className="text-[13px] underline underline-offset-2">
              View in store ↗
            </Link>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={product.id} />
              <ConfirmSubmit message="Delete this product permanently? Past orders keep their details.">Delete</ConfirmSubmit>
            </form>
          </div>
        }
      />
      {saved && <p className="mb-4 border border-[#cfe3cd] bg-[#eef6ed] px-4 py-2.5 text-[14px] text-success">Product created.</p>}
      <ProductForm product={product} images={product.images} variants={product.variants} categories={categories} />
    </>
  );
}
