"use client";

import { useLoad, useTitle } from "@/lib/use-load";
import { PageLoader } from "@/components/ui/PageLoader";
import Link from "next/link";
import { getSettings, type StoreSettings } from "@/lib/settings";
import { RichText } from "@/components/ui/RichText";
import { Img } from "@/components/ui/Img";

export default function AboutClient({ initialSettings }: { initialSettings?: StoreSettings }) {
  const { data: sData, error } = useLoad(getSettings);
  const s = sData ?? initialSettings;
  useTitle("About Us");
  if (!s) return <PageLoader error={error} />;
  return (
    <>
      <div className="relative aspect-[2/1] bg-ink sm:aspect-[3/1]">
        <Img src="/catalogue/about.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 grid place-items-center px-5 text-center">
          <h1 className="font-serif text-[clamp(36px,6vw,80px)] font-medium text-white">{s.aboutTitle}</h1>
        </div>
      </div>
      <div className="narrow-width py-14 sm:py-20">
        <p className="mb-10 text-center text-[17px] leading-[1.75] text-text">{s.aboutText}</p>
        <RichText text={s.aboutPage} />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/collections/all" className="btn">
            Explore the collection
          </Link>
          <Link href="/pages/store" className="btn-outline">
            Visit our showroom
          </Link>
        </div>
      </div>
    </>
  );
}
