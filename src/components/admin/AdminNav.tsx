"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/gold-rates", label: "Gold & Metal Rates" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/offers", label: "Offers & Sales" },
  { href: "/admin/banners", label: "Banners & Home" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/admins", label: "Admin access" },
];

export function AdminNav() {
  const p = usePathname();
  return (
    <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-0.5 md:pb-6">
      {NAV.map((n) => {
        const active = n.href === "/admin" ? p === "/admin" : p.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={cn("block shrink-0 rounded px-3 py-2 text-[14px] whitespace-nowrap transition-colors", active ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/5 hover:text-white")}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
