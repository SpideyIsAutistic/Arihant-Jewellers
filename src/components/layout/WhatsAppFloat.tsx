"use client";

import { IconWhatsApp } from "@/components/ui/Icons";
import { useSiteInfo, whatsappUrl } from "@/store/site";
import { requireLogin } from "@/store/customer";

export function WhatsAppFloat() {
  const number = useSiteInfo((s) => s.whatsapp);
  const href = whatsappUrl(
    number,
    "Hi Arihant Jewellers, I'd like to know more about your jewellery.",
  );
  if (!href) return null;
  return (
    <a
      href={href}
      onClick={(e) => !requireLogin() && e.preventDefault()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 left-5 z-30 flex h-[52px] items-center gap-2 rounded-full bg-[#25D366] pr-1 pl-3.5 text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 sm:pr-5"
    >
      <IconWhatsApp size={26} />
      <span className="hidden text-[13px] font-medium tracking-[0.04em] sm:inline">
        Chat with us
      </span>
      <span className="w-2 sm:hidden" />
    </a>
  );
}
