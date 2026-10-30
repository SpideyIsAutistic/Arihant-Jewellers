"use client";

import { useLoad, useTitle } from "@/lib/use-load";
import { PageLoader } from "@/components/ui/PageLoader";
import { getSettings, type StoreSettings } from "@/lib/settings";
import { ContactForm } from "@/components/account/ContactForm";
import { IconClock, IconInstagram, IconMail, IconPhone, IconPin, IconWhatsApp } from "@/components/ui/Icons";
import { GoogleRating } from "@/components/ui/GoogleRating";

export default function ContactClient({ initialSettings }: { initialSettings?: StoreSettings }) {
  const { data: sData, error } = useLoad(getSettings);
  const s = sData ?? initialSettings;
  useTitle("Contact Us");
  if (!s) return <PageLoader error={error} />;
  const details = [
    s.phone && { icon: <IconPhone size={20} />, label: s.phone, href: `tel:${s.phone.replace(/\s+/g, "")}` },
    s.whatsapp && { icon: <IconWhatsApp size={20} />, label: `WhatsApp ${s.whatsapp}`, href: `https://wa.me/${s.whatsapp.replace(/\D/g, "")}` },
    s.email && { icon: <IconMail size={20} />, label: s.email, href: `mailto:${s.email}` },
    s.address && { icon: <IconPin size={20} />, label: s.address, href: s.mapUrl || undefined },
    s.hours && { icon: <IconClock size={20} />, label: s.hours },
    s.instagramHandle && { icon: <IconInstagram size={20} />, label: `@${s.instagramHandle}`, href: s.social.instagram || `https://www.instagram.com/${s.instagramHandle}/` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; href?: string }[];
  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">Contact</h1>
      <p className="mt-3 mb-10 text-center text-[15px] text-body2">Questions about a piece, today&apos;s price, sizing or a custom design? Send us a message or WhatsApp us and we&apos;ll get back to you.</p>
      <ContactForm />
      <GoogleRating s={s} className="mt-10 justify-center text-body2" />
      {details.length > 0 && (
        <ul className="mt-12 grid gap-4 border-t border-line pt-8 text-[15px] sm:grid-cols-2">
          {details.map((d, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 text-muted">{d.icon}</span>
              {d.href ? (
                <a href={d.href} className="whitespace-pre-line underline-offset-2 hover:underline" target={d.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {d.label}
                </a>
              ) : (
                <span className="whitespace-pre-line">{d.label}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
