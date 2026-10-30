"use client";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { StoreOverlays } from "@/components/layout/StoreOverlays";
import { DEFAULT_SETTINGS, getSettings } from "@/lib/settings";
import { DEFAULT_METAL_RATES, getMetalRates } from "@/lib/gold-rates";
import { useLoad } from "@/lib/use-load";
import { useSiteInfo } from "@/store/site";
import { useEffect } from "react";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const { data } = useLoad(() => Promise.all([getSettings(), getMetalRates()]));
  const [settings, metalRates] = data ?? [DEFAULT_SETTINGS, DEFAULT_METAL_RATES];
  const setInfo = useSiteInfo((s) => s.set);
  useEffect(() => {
    if (settings.whatsapp) setInfo({ whatsapp: settings.whatsapp });
  }, [settings.whatsapp, setInfo]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <AnnouncementBar messages={settings.announcements} rates={metalRates} />
      <Header popularSearches={settings.popularSearches} />
      <main id="main" className="min-h-[50vh]">
        {children}
      </main>
      <Footer settings={settings} />
      <StoreOverlays />
      <WhatsAppFloat />
    </>
  );
}
