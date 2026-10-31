"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import { notFound } from "next/navigation";
import { Card, Check, Field, PageHeader, TextArea } from "@/components/admin/ui";
import { ActionForm, ConfirmSubmit, ImageListInput, SubmitButton } from "@/components/admin/client";
import { deleteCategory, saveCategory } from "@/lib/actions/admin";

export default function CategoryEdit() {
  const id = useParam("id");
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const isNew = id === "new";
  const c = isNew ? undefined : site.categories.find((x) => x.id === id);
  if (!isNew && !c) notFound();
  return (
    <>
      <PageHeader
        title={isNew ? "New category" : c!.name}
        back={{ href: "/admin/categories", label: "Categories" }}
        action={
          !isNew && (
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c!.id} />
              <ConfirmSubmit message="Delete this category? Its products will become uncategorised.">Delete</ConfirmSubmit>
            </form>
          )
        }
      />
      <ActionForm action={saveCategory} className="max-w-[860px] space-y-6">
        <input type="hidden" name="id" value={c?.id ?? ""} />
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" defaultValue={c?.name} required />
            <Field label="URL slug" name="slug" defaultValue={c?.slug} hint="Used in /collections/<slug>" />
            <Field label="Sort order" name="sortOrder" type="number" defaultValue={c?.sortOrder ?? 0} />
            <Field label="Starting from (₹)" name="startingFrom" type="number" defaultValue={c?.startingFrom ? c.startingFrom / 100 : ""} hint="Shown as 'Starting from ₹…' on the category. Leave blank to hide." />
            <div className="pt-6"><Check label="Active" name="isActive" defaultChecked={c ? c.isActive : true} /></div>
          </div>
          <TextArea label="Description (shown under the banner)" name="description" defaultValue={c?.description} rows={4} className="mt-4" />
        </Card>
        <Card title="Images">
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageListInput name="image" single label="Tile image (Shop by Category)" defaultValue={c?.image ? [c.image] : []} />
            <ImageListInput name="heroImage" single label="Banner image (collection page)" defaultValue={c?.heroImage ? [c.heroImage] : []} />
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
