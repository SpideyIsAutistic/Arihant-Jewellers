"use client";

import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { applyProductCopy, hasTemplateCopy, importStarterCatalogue, listEnquiries, listPendingReviews } from "@/lib/actions/admin";
import { ActionForm, SubmitButton } from "@/components/admin/client";
import { loadSite } from "@/lib/data";
import { getMetalRates, ratesAgeHours } from "@/lib/gold-rates";
import { useLoad } from "@/lib/use-load";
import { Card, PageHeader } from "@/components/admin/ui";
import { PageLoader } from "@/components/ui/PageLoader";

// Optional sections can fail (e.g. new database rules not published yet) without blanking the dashboard.
const load = () => Promise.all([loadSite(true), getSettings(), listPendingReviews().catch(() => null), listEnquiries().catch(() => null), getMetalRates()]);

export default function Dashboard() {
  const { data, error } = useLoad(load);
  if (!data) return <PageLoader error={error} />;
  const [site, settings, pending, enquiries, rates] = data;
  const active = site.products.filter((p) => p.isActive);
  const samples = site.products.filter((p) => p.isSample).length;
  const noPrice = active.filter((p) => !p.price).length;
  const uncategorised = active.filter((p) => !p.categoryId).length;

  const checklist = [
    { done: ratesAgeHours(rates) < 24, label: "Update today's gold & silver rates (shown on the Gold Rate page)", href: "/admin/gold-rates" },
    { done: !!settings.web3formsKey, label: "Add the Web3Forms key so enquiries are also emailed", href: "/admin/settings" },
    { done: !!settings.whatsapp, label: "Add the store WhatsApp number (enquiry buttons)", href: "/admin/settings" },
    { done: !!(settings.phone || settings.email), label: "Add store phone & email", href: "/admin/settings" },
    { done: !!settings.address, label: "Add showroom address & hours", href: "/admin/settings" },
    { done: samples === 0, label: `Replace sample products (${samples} sample)`, href: "/admin/products?sample=1" },
    { done: uncategorised === 0, label: `Put every product in a category (${uncategorised} uncategorised)`, href: "/admin/products" },
    { done: !!settings.social.instagram, label: "Add social media links", href: "/admin/settings" },
    { done: Object.values(settings.policies ?? {}).some(Boolean), label: "Review privacy & terms policies", href: "/admin/settings#policies" },
  ];

  const stats = [
    { label: "New enquiries", value: enquiries ? String(enquiries.filter((e) => e.status === "new").length) : "—", href: "/admin/enquiries" },
    { label: "Products live", value: String(active.length), href: "/admin/products" },
    { label: "Price on request", value: String(noPrice), href: "/admin/products" },
    { label: "Unlisted", value: String(site.products.length - active.length), href: "/admin/products?status=draft" },
    { label: "Categories", value: String(site.categories.length), href: "/admin/categories" },
    { label: "Reviews to moderate", value: pending ? String(pending.length) : "—", href: "/admin/reviews" },
    { label: "Live offers", value: String(site.offers.filter((o) => o.isActive).length), href: "/admin/offers" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" />
      {site.products.length === 0 && (
        <Card title="Set up the store" className="mb-6">
          <ActionForm action={async () => importStarterCatalogue()}>
            <p className="mb-4 max-w-[640px] text-[14px] text-body2">
              The store is empty. Load the starter catalogue — Arihant&apos;s photographed pieces, categories, home-page banners and store details — then edit anything from this panel.
            </p>
            <SubmitButton>Load starter catalogue</SubmitButton>
          </ActionForm>
        </Card>
      )}
      {site.products.some(hasTemplateCopy) && (
        <Card title="Updated product descriptions" className="mb-6">
          <ActionForm action={async () => applyProductCopy()}>
            <p className="mb-4 max-w-[640px] text-[14px] text-body2">
              {site.products.filter(hasTemplateCopy).length} products still use the first, generic description. Apply the rewritten ones (unique per piece, better for Google).
              Products you&apos;ve edited yourself are left alone.
            </p>
            <SubmitButton>Apply updated product descriptions</SubmitButton>
          </ActionForm>
        </Card>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="border border-line bg-white p-4 transition-colors hover:border-ink">
            <p className="text-[12px] tracking-[0.06em] text-subtle uppercase">{s.label}</p>
            <p className="mt-1 text-[22px]">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card title="How enquiries reach you">
          <ul className="list-disc space-y-2 pl-5 text-[14px] text-body2">
            <li>Every product has an <b>Enquire on WhatsApp</b> button that opens a chat with the number set in Settings.</li>
            <li>The <b>Contact</b> page and each product&apos;s <b>Send an enquiry</b> form are saved under <b>Enquiries</b> and emailed to you through Web3Forms.</li>
            <li>Forms are spam-protected: a hidden trap field, a 3-second check, at most 2 links, 5 sends per hour per visitor, and a short gap between submissions site-wide.</li>
            <li>Online checkout and shipping are switched off — the site works as a catalogue.</li>
          </ul>
        </Card>
        <Card title="Launch checklist">
          <ul className="space-y-3 text-[14px]">
            {checklist.map((c) => (
              <li key={c.label} className="flex items-start gap-2.5">
                <span className={c.done ? "text-success" : "text-[#b98a1e]"} aria-hidden>
                  {c.done ? "✓" : "○"}
                </span>
                <Link href={c.href} className={c.done ? "text-subtle line-through" : "underline-offset-2 hover:underline"}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
