"use client";

import { getSettings } from "@/lib/settings";
import { useLoad } from "@/lib/use-load";
import { RichText } from "@/components/ui/RichText";

/** The store's own scheme terms from Admin → Settings (loaded live so edits show without a redeploy). */
export function SchemeDetails() {
  const { data: s } = useLoad(getSettings);
  if (!s) return null;
  return s.schemeDetails ? (
    <RichText text={s.schemeDetails} />
  ) : (
    <p className="border border-line bg-cream px-5 py-5 text-[15px]">Ask us for this year&apos;s scheme: the monthly amount, how long it runs and what you receive at the end.</p>
  );
}
