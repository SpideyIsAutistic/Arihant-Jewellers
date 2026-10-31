import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconSearch = (p: P) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.75" />
    <path d="m15.5 15.5 5 5" />
  </Svg>
);
export const IconHeart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Svg {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.2s-7.6-4.6-7.6-10.3A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.6 2.5c0 5.7-7.6 10.3-7.6 10.3Z" />
  </Svg>
);
export const IconUser = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5c.9-3.6 3.9-5.5 7.5-5.5s6.6 1.9 7.5 5.5" />
  </Svg>
);
export const IconBag = (p: P) => (
  <Svg {...p}>
    <path d="M5 8.5h14l-1 12H6l-1-12Z" />
    <path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" />
  </Svg>
);
export const IconClose = (p: P) => (
  <Svg {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
);
export const IconMenu = (p: P) => (
  <Svg {...p}>
    <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
  </Svg>
);
export const IconChevronDown = (p: P) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);
export const IconChevronLeft = (p: P) => (
  <Svg {...p}>
    <path d="m15 6-6 6 6 6" />
  </Svg>
);
export const IconChevronRight = (p: P) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);
export const IconPlus = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const IconMinus = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);
export const IconFilter = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </Svg>
);
export const IconGrid = (p: P) => (
  <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <rect x="1" y="1" width="8" height="8" />
    <rect x="11" y="1" width="8" height="8" />
    <rect x="1" y="11" width="8" height="8" />
    <rect x="11" y="11" width="8" height="8" />
  </svg>
);
export const IconList = (p: P) => (
  <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    {[1, 4.5, 8, 11.5, 15, 18].map((y) => (
      <rect key={y} x="1" y={y - 0.6} width="18" height="1.3" />
    ))}
  </svg>
);
export const IconStar = ({ filled = true, ...p }: P & { filled?: boolean }) => (
  <svg width={p.size ?? 14} height={p.size ?? 14} viewBox="0 0 24 24" aria-hidden="true" className={p.className}>
    <path
      d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8L12 2.8Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);
export const IconPin = (p: P) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10" r="2.4" />
  </Svg>
);
export const IconTruck = (p: P) => (
  <Svg {...p}>
    <path d="M2.5 6.5h11v9.5h-11zM13.5 10h4l3 3v3h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </Svg>
);
export const IconShield = (p: P) => (
  <Svg {...p}>
    <path d="M12 3 4.5 6v5.5c0 4.4 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5.1 7.5-9.5V6L12 3Z" />
    <path d="m8.8 12 2.2 2.2 4.3-4.4" />
  </Svg>
);
export const IconGem = (p: P) => (
  <Svg {...p}>
    <path d="M6 4h12l3.5 5L12 20.5 2.5 9 6 4Z" />
    <path d="M2.5 9h19M9 4l3 16.5L15 4M6 4l3 5 3-5 3 5 3-5" />
  </Svg>
);
export const IconGift = (p: P) => (
  <Svg {...p}>
    <path d="M3.5 8.5h17v4h-17zM5 12.5h14v8H5zM12 8.5v12" />
    <path d="M12 8.5S10.8 4 8.3 4C6.8 4 6.2 5.6 7 6.7c.8 1.1 3.3 1.8 5 1.8Zm0 0s1.2-4.5 3.7-4.5c1.5 0 2.1 1.6 1.3 2.7-.8 1.1-3.3 1.8-5 1.8Z" />
  </Svg>
);
export const IconBadge = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7" />
    <path d="m10 9 1.5 1.5L14.3 7.7" />
  </Svg>
);
export const IconStore = (p: P) => (
  <Svg {...p}>
    <path d="M4 9.5V20h16V9.5M3 4h18l-1 5.5a2.5 2.5 0 0 1-4.5 1 2.5 2.5 0 0 1-4.5 0 2.5 2.5 0 0 1-4.5-1L3 4Z" />
    <path d="M9.5 20v-5h5v5" />
  </Svg>
);
export const IconHeadset = (p: P) => (
  <Svg {...p}>
    <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
    <rect x="3.5" y="13" width="3.5" height="5.5" rx="1" />
    <rect x="17" y="13" width="3.5" height="5.5" rx="1" />
    <path d="M19 18.5c0 1.5-1.8 2.5-5 2.5" />
  </Svg>
);
export const IconExchange = (p: P) => (
  <Svg {...p}>
    <path d="M4 8h13l-3-3M20 16H7l3 3" />
  </Svg>
);
export const IconLock = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="1" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Svg>
);
export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
export const IconTag = (p: P) => (
  <Svg {...p}>
    <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.3 7.3a1 1 0 0 1-1.4 0l-8.3-8.3Z" />
    <circle cx="8" cy="8" r="1.4" />
  </Svg>
);
export const IconTrash = (p: P) => (
  <Svg {...p}>
    <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
  </Svg>
);
export const IconLink = (p: P) => (
  <Svg {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </Svg>
);
export const IconMail = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="1" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </Svg>
);
export const IconPhone = (p: P) => (
  <Svg {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
  </Svg>
);
export const IconClock = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const IconPercent = (p: P) => (
  <Svg {...p}>
    <path d="M12 2.8 14 4.6l2.7-.3.8 2.6 2.5 1.2-.6 2.7 1.6 2.2-1.9 2 .2 2.7-2.6.7-1.3 2.4-2.6-.8L12 21.2l-1.9-1.8-2.6.8-1.3-2.4-2.6-.7.2-2.7-1.9-2 1.6-2.2-.6-2.7L5.4 6.9l.8-2.6 2.7.3L12 2.8Z" />
    <path d="m9 15 6-6" />
    <circle cx="9.3" cy="9.3" r=".6" fill="currentColor" />
    <circle cx="14.7" cy="14.7" r=".6" fill="currentColor" />
  </Svg>
);

/* Brand marks (simple monochrome glyphs) */
export const IconWhatsApp = (p: P) => (
  <svg width={p.size ?? 24} height={p.size ?? 24} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={p.className}>
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7 3.9Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3Z" />
  </svg>
);
export const IconInstagram = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".8" fill="currentColor" />
  </Svg>
);
export const IconFacebook = (p: P) => (
  <svg width={p.size ?? 24} height={p.size ?? 24} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={p.className}>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />
  </svg>
);
export const IconX = (p: P) => (
  <svg width={p.size ?? 24} height={p.size ?? 24} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={p.className}>
    <path d="M17.6 3.5h3l-6.6 7.5 7.8 9.5h-6.1l-4.8-5.9-5.4 5.9h-3l7-7.9L2 3.5h6.2l4.3 5.4 5.1-5.4Zm-1 15.3h1.7L7.5 5.1H5.7l10.9 13.7Z" />
  </svg>
);
export const IconYouTube = (p: P) => (
  <svg width={p.size ?? 24} height={p.size ?? 24} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={p.className}>
    <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);
export const IconPinterest = (p: P) => (
  <svg width={p.size ?? 24} height={p.size ?? 24} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={p.className}>
    <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.5 2.1-4.5 4.4 0 .9.3 1.8.8 2.3l.1.4-.3 1.1c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A10 10 0 1 0 12 2Z" />
  </svg>
);

export const trustIcon = (name: string, size = 40) => {
  const props = { size, strokeWidth: 1.1 } as P;
  switch (name) {
    case "purity":
      return <IconGem {...props} />;
    case "secure":
      return <IconLock {...props} />;
    case "quality":
      return <IconBadge {...props} />;
    case "gift":
      return <IconGift {...props} />;
    case "courier":
      return <IconShield {...props} />;
    case "truck":
      return <IconTruck {...props} />;
    case "store":
      return <IconStore {...props} />;
    case "support":
      return <IconHeadset {...props} />;
    case "exchange":
      return <IconExchange {...props} />;
    default:
      return <IconGem {...props} />;
  }
};
