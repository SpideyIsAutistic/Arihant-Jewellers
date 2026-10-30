"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import { notFound } from "next/navigation";
import { paiseToRupees } from "@/lib/format";
import { Card, Check, Field, PageHeader, Select, TextArea } from "@/components/admin/ui";
import { ActionForm, ConfirmSubmit, ImageListInput, SubmitButton } from "@/components/admin/client";
import { deleteCollection, saveCollection } from "@/lib/actions/admin";

export default function CollectionEdit() {
  const id = useParam("id");
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const isNew = id === "new";
  const c = isNew ? undefined : site.collections.find((x) => x.id === id);
  const cats = [...site.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  if (!isNew && !c) notFound();
  return (
    <>
      <PageHeader
        title={isNew ? "New collection" : c!.title}
        back={{ href: "/admin/collections", label: "Collections" }}
        action={
          !isNew && (
            <form action={deleteCollection}>
              <input type="hidden" name="id" value={c!.id} />
              <ConfirmSubmit message="Delete this collection? Menu links pointing to it will show 'not found'.">Delete</ConfirmSubmit>
            </form>
          )
        }
      />
      <ActionForm action={saveCollection} className="max-w-[860px] space-y-6">
        <input type="hidden" name="id" value={c?.id ?? ""} />
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" name="title" defaultValue={c?.title} required />
            <Field label="URL slug" name="slug" defaultValue={c?.slug} />
            <Field label="Sort order" name="sortOrder" type="number" defaultValue={c?.sortOrder ?? 0} />
            <div className="pt-6"><Check label="Active" name="isActive" defaultChecked={c ? c.isActive : true} /></div>
          </div>
          <TextArea label="Description" name="description" defaultValue={c?.description} rows={4} className="mt-4" />
        </Card>
        <Card title="Rules (a product must match all filled rules)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tag" name="ruleTag" defaultValue={c?.ruleTag} placeholder="e.g. bridal" />
            <Select label="Metal" name="ruleMetal" defaultValue={c?.ruleMetal ?? ""} options={[{ value: "", label: "Any" }, ...["Silver", "Gold", "Rose Gold", "Platinum"].map((m) => ({ value: m, label: m }))]} />
            <Select label="Category" name="ruleCategoryId" defaultValue={c?.ruleCategoryId ?? ""} options={[{ value: "", label: "Any" }, ...cats.map((x) => ({ value: x.id, label: x.name }))]} />
            <div className="pt-6"><Check label="Only products currently on sale" name="ruleOnSale" defaultChecked={c?.ruleOnSale} /></div>
            <Field label="Min price (₹, after offers)" name="ruleMinPrice" type="number" defaultValue={paiseToRupees(c?.ruleMinPrice)} />
            <Field label="Max price (₹, after offers)" name="ruleMaxPrice" type="number" defaultValue={paiseToRupees(c?.ruleMaxPrice)} />
          </div>
          <TextArea label="Hand-picked product IDs (comma separated, optional)" name="productIds" defaultValue={c?.productIds} rows={2} mono className="mt-4" hint="Hand-picked products are always included and shown first, in this order." />
        </Card>
        <Card title="Images">
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageListInput name="image" single label="Tile image" defaultValue={c?.image ? [c.image] : []} />
            <ImageListInput name="heroImage" single label="Banner image" defaultValue={c?.heroImage ? [c.heroImage] : []} />
          </div>
        </Card>
        <Card title="SEO">
          <Field label="SEO title" name="seoTitle" defaultValue={c?.seoTitle} />
          <TextArea label="SEO description" name="seoDescription" defaultValue={c?.seoDescription} rows={2} className="mt-4" />
        </Card>
        <SubmitButton />
      </ActionForm>
    </>
  );
}
