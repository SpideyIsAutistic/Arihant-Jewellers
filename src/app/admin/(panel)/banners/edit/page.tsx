"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import { notFound } from "next/navigation";
import { Card, Check, Field, PageHeader, Select, TextArea } from "@/components/admin/ui";
import { ActionForm, ConfirmSubmit, ImageListInput, SubmitButton } from "@/components/admin/client";
import { deleteBanner, saveBanner } from "@/lib/actions/admin";

export default function BannerEdit() {
  const id = useParam("id");
  const sp = { placement: useParam("placement") || undefined };
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const isNew = id === "new";
  const b = isNew ? undefined : site.banners.find((x) => x.id === id);
  if (!isNew && !b) notFound();
  return (
    <>
      <PageHeader
        title={isNew ? "New banner" : b!.title || "Banner"}
        back={{ href: "/admin/banners", label: "Banners & Home" }}
        action={
          !isNew && (
            <form action={deleteBanner}>
              <input type="hidden" name="id" value={b!.id} />
              <ConfirmSubmit message="Delete this banner?">Delete</ConfirmSubmit>
            </form>
          )
        }
      />
      <ActionForm action={saveBanner} className="max-w-[860px] space-y-6">
        <input type="hidden" name="id" value={b?.id ?? ""} />
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Placement"
              name="placement"
              defaultValue={b?.placement ?? sp.placement ?? "hero"}
              options={[
                { value: "hero", label: "Hero slideshow" },
                { value: "promo", label: "Promo slideshow" },
                { value: "collections", label: "Collections slideshow" },
                { value: "recipient", label: "Recipient tile" },
                { value: "occasion", label: "Occasion tile" },
                { value: "look", label: "Shop the look" },
                { value: "instagram", label: "Instagram image" },
                { value: "category", label: "Spare / custom" },
              ]}
            />
            <Field label="Sort order" name="sortOrder" type="number" defaultValue={b?.sortOrder ?? 0} />
            <Field label="Title" name="title" defaultValue={b?.title} />
            <Field label="Subtitle" name="subtitle" defaultValue={b?.subtitle} />
            <Field label="Button label" name="ctaLabel" defaultValue={b?.ctaLabel} placeholder="Shop now" />
            <Field label="Link" name="href" defaultValue={b?.href} placeholder="/collections/bridal" />
            <Select label="Text alignment" name="align" defaultValue={b?.align ?? "left"} options={["left", "center", "right"].map((a) => ({ value: a, label: a }))} />
            <div className="pt-6"><Check label="Active" name="isActive" defaultChecked={b ? b.isActive : true} /></div>
          </div>
        </Card>
        <Card title="Images">
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageListInput name="image" single label="Image (desktop, landscape)" defaultValue={b?.image ? [b.image] : []} />
            <ImageListInput name="mobileImage" single label="Mobile image (portrait, optional)" defaultValue={b?.mobileImage ? [b.mobileImage] : []} />
          </div>
        </Card>
        <Card title="Advanced">
          <TextArea
            label="Data (JSON) — for “Shop the look” hotspots"
            name="meta"
            defaultValue={b?.meta}
            rows={4}
            mono
            hint='Example: {"hotspots":[{"productId":"<product id>","x":52,"y":62}]} — x/y are % from the image’s top-left.'
          />
        </Card>
        <SubmitButton />
      </ActionForm>
    </>
  );
}
