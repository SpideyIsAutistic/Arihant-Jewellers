"use client";

import { useLoad, useTitle } from "@/lib/use-load";
import { PageLoader } from "@/components/ui/PageLoader";
import Link from "next/link";
import { getSettings, type StoreSettings } from "@/lib/settings";
import { Img } from "@/components/ui/Img";
import { IconClock, IconPhone, IconPin } from "@/components/ui/Icons";
import { absoluteUrl } from "@/lib/utils";
import { storeJsonLd } from "@/lib/store-schema";
import { GoogleRating } from "@/components/ui/GoogleRating";

export default function StoreClient({ initialSettings }: { initialSettings?: StoreSettings }) {
  const { data: sData, error } = useLoad(getSettings);
  const s = sData ?? initialSettings;
  useTitle("Our Showroom");
  if (!s) return <PageLoader error={error} />;
  const hasDetails = s.address || s.phone || s.hours;

  const localBusinessJsonLd = storeJsonLd(s, "/pages/store");

  return (
    <div className="page-width py-14 sm:py-20">
      <h1 className="h-section">Our Showroom</h1>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <div className="jewel-radius relative aspect-[4/3] overflow-hidden bg-cream-2">
          <Img src="/catalogue/showroom.webp" alt="Arihant Jewellers showroom in Thane West" fill sizes="(min-width:1000px) 50vw, 100vw" className="object-cover" priority />
        </div>
        <div className="space-y-5 text-[16px]">
          <p className="font-serif text-[clamp(28px,3vw,40px)] leading-tight">Come in, try on, take your time.</p>
          {hasDetails ? (
            <ul className="space-y-4">
              {s.address && (
                <li className="flex gap-3">
                  <IconPin size={22} className="mt-0.5 shrink-0 text-muted" />
                  <span className="whitespace-pre-line">{s.address}</span>
                </li>
              )}
              {s.hours && (
                <li className="flex gap-3">
                  <IconClock size={22} className="mt-0.5 shrink-0 text-muted" />
                  {s.hours}
                </li>
              )}
              {s.phone && (
                <li className="flex gap-3">
                  <IconPhone size={22} className="mt-0.5 shrink-0 text-muted" />
                  <a href={`tel:${s.phone.replace(/\s+/g, "")}`} className="underline underline-offset-2">
                    {s.phone}
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <p className="text-body2">Showroom address and opening hours will be published here soon. In the meantime, please reach us through our contact page.</p>
          )}
          <GoogleRating s={s} />
          {s.instagramHandle && (
            <p>
              Instagram:{" "}
              <a href={s.social.instagram || `https://www.instagram.com/${s.instagramHandle}/`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                @{s.instagramHandle}
              </a>
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            {s.mapUrl && (
              <a href={s.mapUrl} target="_blank" rel="noopener noreferrer" className="btn">
                Get directions
              </a>
            )}
            <Link href="/pages/contact" className="btn-outline">
              Contact us
            </Link>
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
    </div>
  );
}
