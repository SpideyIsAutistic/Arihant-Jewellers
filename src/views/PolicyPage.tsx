"use client";

import { notFound } from "next/navigation";
import { getSettings } from "@/lib/settings";
import { DEFAULT_POLICIES, POLICY_PAGES, fillPolicy, type PolicySlug } from "@/lib/policies";
import { RichText } from "@/components/ui/RichText";
import { useLoad, useSlug, useTitle } from "@/lib/use-load";
import { PageLoader } from "@/components/ui/PageLoader";

export default function PolicyPage({
  slug: staticSlug,
  initialSettings,
}: {
  slug?: string;
  initialSettings?: Awaited<ReturnType<typeof getSettings>>;
} = {}) {
  const routerSlug = useSlug();
  const slug = staticSlug || routerSlug;
  const { data: sData, error } = useLoad(getSettings);
  const s = sData ?? initialSettings;

  useTitle(POLICY_PAGES[slug as PolicySlug]);
  if (!(slug in POLICY_PAGES)) notFound();
  if (!s) return <PageLoader error={error} />;
  const key = slug as PolicySlug;
  const text = fillPolicy(s.policies?.[key] || DEFAULT_POLICIES[key], s);
  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section mb-10">{POLICY_PAGES[key]}</h1>
      <RichText text={text} />
    </div>
  );
}
