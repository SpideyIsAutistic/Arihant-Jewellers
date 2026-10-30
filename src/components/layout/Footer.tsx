import Link from "next/link";
import { FOOTER_NAV } from "@/config/navigation";
import type { StoreSettings } from "@/lib/settings";
import { NewsletterForm } from "./NewsletterForm";
import { FooterSearches } from "./FooterSearches";
import { GoogleRating } from "@/components/ui/GoogleRating";
import { IconFacebook, IconInstagram, IconPinterest, IconX, IconYouTube } from "@/components/ui/Icons";

function Col({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-[11px] font-semibold tracking-[0.22em] text-ink uppercase">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-[13px] text-body2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ settings }: { settings: StoreSettings }) {
  const s = settings;
  const socials = [
    { href: s.social.instagram, label: "Instagram", Icon: IconInstagram },
    { href: s.social.facebook, label: "Facebook", Icon: IconFacebook },
    { href: s.social.youtube, label: "YouTube", Icon: IconYouTube },
    { href: s.social.x, label: "X", Icon: IconX },
    { href: s.social.pinterest, label: "Pinterest", Icon: IconPinterest },
  ].filter((x) => x.href);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line/80 bg-cream text-text">
      <div className="page-width">
        <FooterSearches terms={s.popularSearches} />
        <div className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr_1.3fr] md:gap-8">
          <div className="max-w-[280px]">
            <h2 className="text-[11px] font-semibold tracking-[0.22em] text-ink uppercase">Newsletter</h2>
            <p className="mt-3.5 text-[13px] leading-relaxed text-body2">
              Sign up to receive private viewing invitations, bespoke offers, and new haute joaillerie arrivals.
            </p>
            <NewsletterForm />
          </div>
          <Col title={`About ${s.storeName.split(" ")[0]}`} links={FOOTER_NAV.about} />
          <Col title="Shop by" links={FOOTER_NAV.shop} />
          <Col title="Policies" links={FOOTER_NAV.policies} />
          <div>
            <h2 className="text-[11px] font-semibold tracking-[0.22em] text-ink uppercase">Support</h2>
            <GoogleRating s={s} className="mt-4 text-body2" />
            <ul className="mt-4 space-y-2.5 text-[13px] text-body2">
              {s.email && (
                <li>
                  Email:{" "}
                  <a className="underline underline-offset-2 hover:text-ink" href={`mailto:${s.email}`}>
                    {s.email}
                  </a>
                </li>
              )}
              {s.phone && (
                <li>
                  Phone:{" "}
                  <a className="underline underline-offset-2 hover:text-ink" href={`tel:${s.phone.replace(/\s+/g, "")}`}>
                    {s.phone}
                  </a>
                </li>
              )}
              {s.whatsapp && (
                <li>
                  WhatsApp:{" "}
                  <a className="underline underline-offset-2 hover:text-ink" href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                    {s.whatsapp}
                  </a>
                </li>
              )}
              {s.hours && <li>Hours: {s.hours}</li>}
              {s.address && <li className="whitespace-pre-line">{s.address}</li>}
              <li>
                <Link href="/pages/contact" className="underline underline-offset-2 hover:text-ink">
                  Send us a message
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-line/80 py-8 sm:flex-row">
          <ul className="flex items-center gap-4">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.storeName} on ${label}`}
                  className="grid h-8 w-8 place-items-center rounded-full border border-line bg-white/80 text-subtle transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  <Icon size={15} />
                </a>
              </li>
            ))}
          </ul>
          <Link href="/pages/contact" className="text-[12px] tracking-[0.08em] text-body2 underline-offset-2 hover:text-ink hover:underline">
            Enquire about any piece — we reply on WhatsApp &amp; email
          </Link>
        </div>
        <p className="mb-2 text-center text-[13px] text-body2">
            <Link href="/hi/gold-rate-today" hrefLang="hi" className="hover:text-ink">हिंदी</Link> ·{" "}
            <Link href="/mr/gold-rate-today" hrefLang="mr" className="hover:text-ink">मराठी</Link>
          </p>
          <p className="pb-10 text-center text-[10px] tracking-[0.2em] text-subtle uppercase">
          © {year} {s.legalName}. All rights reserved.
          {s.gstin && <span className="ml-2 font-mono">GSTIN: {s.gstin}</span>}
        </p>
      </div>
    </footer>
  );
}
