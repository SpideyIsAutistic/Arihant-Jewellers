"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "../../ProductForm";

export default function NewProduct() {
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const categories = [...site.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <>
      <PageHeader title="New product" back={{ href: "/admin/products", label: "Products" }} />
      <ProductForm images={[]} variants={[]} categories={categories} />
    </>
  );
}
