"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import { notFound } from "next/navigation";
import { paiseToRupees } from "@/lib/format";
import { Card, Check, Field, PageHeader, Select, toLocalInput } from "@/components/admin/ui";
import { ActionForm, ConfirmSubmit, OfferTargetFields, SubmitButton } from "@/components/admin/client";
import { deleteOffer, saveOffer } from "@/lib/actions/admin";

export default function OfferEdit() {
  const id = useParam("id");
  const { data: site, error } = useSiteAdmin();
  if (!site) return <PageLoader error={error} />;
  const isNew = id === "new";
  const o = isNew ? undefined : site.offers.find((x) => x.id === id);
  const cats = [...site.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const cols = [...site.collections].sort((a, b) => a.sortOrder - b.sortOrder);
  if (!isNew && !o) notFound();
  return (
    <>
      <PageHeader
        title={isNew ? "New offer" : o!.name}
        back={{ href: "/admin/offers", label: "Offers & Sales" }}
        action={
          !isNew && (
            <form action={deleteOffer}>
              <input type="hidden" name="id" value={o!.id} />
              <ConfirmSubmit message="Delete this offer? Prices return to normal immediately.">Delete</ConfirmSubmit>
            </form>
          )
        }
      />
      <ActionForm action={saveOffer} className="max-w-[820px] space-y-6">
        <input type="hidden" name="id" value={o?.id ?? ""} />
        <Card>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Offer name (internal)" name="name" defaultValue={o?.name} required className="sm:col-span-3" placeholder="e.g. Diwali Sale — 20% off gold making" />
            <Select label="Type" name="kind" defaultValue={o?.kind ?? "percent"} options={[{ value: "percent", label: "Percentage off" }, { value: "flat", label: "Flat ₹ off per item" }]} />
            <Field label="Value (% or ₹)" name="value" type="number" step="0.01" defaultValue={o ? (o.kind === "percent" ? o.value : paiseToRupees(o.value)) : ""} required />
            <div className="pt-6"><Check label="Enabled" name="isActive" defaultChecked={o ? o.isActive : true} /></div>
          </div>
        </Card>
        <Card title="Applies to">
          <OfferTargetFields defaultAppliesTo={o?.appliesTo ?? "all"} defaultTarget={o?.target ?? null} categories={cats} collections={cols} />
        </Card>
        <Card title="Schedule (optional)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Starts" name="startsAt" type="datetime-local" defaultValue={toLocalInput(o?.startsAt)} />
            <Field label="Ends" name="endsAt" type="datetime-local" defaultValue={toLocalInput(o?.endsAt)} />
          </div>
        </Card>
        <SubmitButton />
      </ActionForm>
    </>
  );
}
