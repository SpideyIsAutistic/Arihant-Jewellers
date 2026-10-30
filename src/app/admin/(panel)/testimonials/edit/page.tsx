"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import { notFound } from "next/navigation";
import { Card, Check, Field, PageHeader, TextArea } from "@/components/admin/ui";
import { ActionForm, ConfirmSubmit, ImageListInput, SubmitButton } from "@/components/admin/client";
import { deleteTestimonial, saveTestimonial } from "@/lib/actions/admin";

export default function TestimonialEdit() {
  const id = useParam("id");
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const isNew = id === "new";
  const t = isNew ? undefined : site.testimonials.find((x) => x.id === id);
  if (!isNew && !t) notFound();
  return (
    <>
      <PageHeader
        title={isNew ? "New testimonial" : t!.name}
        back={{ href: "/admin/testimonials", label: "Testimonials" }}
        action={
          !isNew && (
            <form action={deleteTestimonial}>
              <input type="hidden" name="id" value={t!.id} />
              <ConfirmSubmit message="Delete this testimonial?">Delete</ConfirmSubmit>
            </form>
          )
        }
      />
      <ActionForm action={saveTestimonial} className="max-w-[760px] space-y-6">
        <input type="hidden" name="id" value={t?.id ?? ""} />
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Customer name" name="name" defaultValue={t?.name} required />
            <Field label="City (optional)" name="location" defaultValue={t?.location} />
            <Field label="Sort order" name="sortOrder" type="number" defaultValue={t?.sortOrder ?? 0} />
            <div className="pt-6"><Check label="Show on home page" name="isActive" defaultChecked={t ? t.isActive : true} /></div>
          </div>
          <TextArea label="Quote" name="quote" defaultValue={t?.quote} rows={4} className="mt-4" />
          <div className="mt-4"><ImageListInput name="avatar" single label="Photo (optional)" defaultValue={t?.avatar ? [t.avatar] : []} /></div>
        </Card>
        <SubmitButton />
      </ActionForm>
    </>
  );
}
