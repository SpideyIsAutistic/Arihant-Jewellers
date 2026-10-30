"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MAIN_NAV, type NavItem } from "@/config/navigation";
import { Logo } from "./Logo";
import { SearchPanel } from "./SearchPanel";
import { MobileMenu } from "./MobileMenu";
import {
  IconHeart,
  IconMenu,
  IconSearch,
  IconUser,
  IconWhatsApp,
} from "@/components/ui/Icons";
import { Img } from "@/components/ui/Img";
import { useSiteInfo, whatsappUrl } from "@/store/site";
import { openLogin, requireLogin, useCustomer } from "@/store/customer";
import { useWishlist } from "@/store/wishlist";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function Header({ popularSearches }: { popularSearches: string[] }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrated = useHydrated();
  const wa = whatsappUrl(
    useSiteInfo((s) => s.whatsapp),
    "Hi Arihant Jewellers, I'd like to know more about your jewellery.",
  );
  const wishCount = useWishlist((s) => s.items.length);
  const signedIn = !!useCustomer((s) => s.user);

  useEffect(() => {
    setOpenMenu(null);
    setSearchOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const enter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const active = MAIN_NAV.find((n) => n.label === openMenu);

  return (
    <header className="sticky top-0 z-40 bg-white" onMouseLeave={leave}>
      <div className="border-b border-line/80 bg-white text-ink transition-colors">
        <div className="page-width grid h-[var(--header-height)] grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[160px_1fr_170px] md:gap-6">
          {/* Left: hamburger + logo (mobile/tablet) / logo (desktop) */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-6 md:hidden">
            <button
              type="button"
              aria-label="Open menu"
              className="-ml-1 p-2 text-ink transition-colors hover:text-subtle"
              onClick={() => setMobileOpen(true)}
            >
              <IconMenu size={24} />
            </button>
            <Logo tone="dark" />
          </div>
          <div className="hidden md:block">
            <Logo tone="dark" />
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Main" className="hidden md:block">
            <ul className="mx-auto flex max-w-[700px] flex-wrap items-center justify-center gap-x-[18px] gap-y-1 lg:gap-x-[26px]">
              {MAIN_NAV.map((item) => (
                <li
                  key={item.label}
                  onMouseEnter={() =>
                    item.links ? enter(item.label) : setOpenMenu(null)
                  }
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative block py-1.5 text-[12px] font-medium whitespace-nowrap uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:text-subtle lg:text-[13px]",
                      "after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-300",
                      (openMenu === item.label ||
                        pathname.startsWith(item.href.split("?")[0])) &&
                        "after:scale-x-100",
                    )}
                    aria-expanded={
                      item.links ? openMenu === item.label : undefined
                    }
                    onFocus={() => item.links && enter(item.label)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: action icons */}
          <div className="flex items-center justify-end gap-1.5 min-[380px]:gap-2 sm:gap-4 text-ink">
            <button
              type="button"
              aria-label="Search"
              className="p-1.5 transition-colors hover:text-subtle"
              onClick={() => {
                setSearchOpen((v) => !v);
                setOpenMenu(null);
              }}
            >
              <IconSearch size={21} />
            </button>
            <button
              type="button"
              aria-label={signedIn ? "Your account (signed in)" : "Sign in"}
              className="p-1.5 transition-colors hover:text-subtle"
              onClick={openLogin}
            >
              <IconUser size={21} />
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden p-1.5 transition-colors hover:text-subtle min-[360px]:block"
            >
              <IconHeart size={21} />
              {hydrated && wishCount > 0 && (
                <span
                  className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-ink"
                  aria-hidden
                />
              )}
            </Link>
            {wa && (
              <a
                href={wa}
                onClick={(e) => !requireLogin() && e.preventDefault()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp us"
                className="p-1.5 transition-colors hover:text-[#1da851]"
              >
                <IconWhatsApp size={21} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mega menu */}
      {active?.links && (
        <MegaMenu
          item={active}
          onEnter={() => enter(active.label)}
          onLeave={leave}
        />
      )}

      <SearchPanel
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        popularSearches={popularSearches}
      />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function MegaMenu({
  item,
  onEnter,
  onLeave,
}: {
  item: NavItem;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="absolute inset-x-0 top-full hidden animate-drop-in border-b border-line bg-white shadow-[0_16px_36px_rgba(0,0,0,0.06)] md:block"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="page-width grid grid-cols-[minmax(260px,320px)_1fr] gap-12 py-10">
        <ul className="grid grid-cols-2 gap-x-10 gap-y-4 self-start pl-2">
          {item.links!.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="font-serif text-[16px] text-ink transition-colors hover:text-subtle hover:translate-x-0.5 inline-block"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-6">
          {item.promos?.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="group block w-full max-w-[280px]"
            >
              <div className="relative aspect-[3/4] overflow-hidden border border-line/70 bg-cream-2">
                <Img
                  src={p.image}
                  alt={p.label}
                  fill
                  sizes="280px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-[11px] font-semibold tracking-[0.2em] text-ink uppercase">
                {p.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
