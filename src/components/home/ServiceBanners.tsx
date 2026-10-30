import Link from "next/link";
import { cn } from "@/lib/utils";

/** Designed (photo-free) promo banners: colour field, gold line-art motif, serif type. */
const G = "#d9bf8f";

const Diya = () => (
  <g fill="none" stroke={G} strokeWidth="1.6" strokeLinecap="round">
    {[...Array(9)].map((_, i) => {
      const a = (Math.PI * (i + 1)) / 10;
      return <line key={i} x1={100 - Math.cos(a) * 46} y1={92 - Math.sin(a) * 46} x2={100 - Math.cos(a) * 62} y2={92 - Math.sin(a) * 62} opacity="0.55" />;
    })}
    <path d="M100 58c-9 12-11 22-5 30 3 4 7 4 10 0 6-8 4-18-5-30z" fill={G} fillOpacity="0.9" stroke="none" />
    <path d="M100 70c-4 6-4 11-1 14" stroke="#4a0e14" strokeWidth="1.4" />
    <path d="M48 104h104c-6 26-28 40-52 40s-46-14-52-40z" />
    <path d="M58 112c10 16 26 24 42 24s32-8 42-24" opacity="0.6" />
    <path d="M150 104c8-2 14 2 18-4" />
    <circle cx="100" cy="124" r="3" fill={G} stroke="none" />
    <circle cx="82" cy="120" r="2" fill={G} stroke="none" />
    <circle cx="118" cy="120" r="2" fill={G} stroke="none" />
    <path d="M70 160h60M84 168h32" opacity="0.5" />
  </g>
);

const RateChart = () => (
  <g fill="none" stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {[60, 90, 120, 150].map((y) => (
      <line key={y} x1="30" x2="175" y1={y} y2={y} opacity="0.18" />
    ))}
    <path d="M30 150 L30 160 L172 160 L172 62 L146 78 L122 110 L100 104 L78 132 L55 128 L30 140Z" fill={G} fillOpacity="0.08" stroke="none" />
    <path d="M30 140 L55 128 L78 132 L100 104 L122 110 L146 78 L172 62" />
    {[[55, 128], [100, 104], [146, 78], [172, 62]].map(([x, y]) => (
      <circle key={x} cx={x} cy={y} r="3.5" fill="#15120d" />
    ))}
    <text x="30" y="40" fill={G} stroke="none" fontFamily="serif" fontSize="16" letterSpacing="1">24K · 22K · 18K</text>
    <path d="M30 172h145" opacity="0.5" />
  </g>
);

const Exchange = () => (
  <g fill="none" stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M44 100a56 56 0 0 1 98-37" />
    <path d="M144 48v17h-17" />
    <path d="M156 100a56 56 0 0 1-98 37" />
    <path d="M56 152v-17h17" />
    <ellipse cx="100" cy="108" rx="24" ry="22" />
    <ellipse cx="100" cy="108" rx="18" ry="16" opacity="0.5" />
    <path d="M90 86l10-12 10 12z" fill={G} fillOpacity="0.85" />
  </g>
);

const Coins = () => (
  <g fill="none" stroke="#8a6d3f" strokeWidth="1.6" strokeLinecap="round">
    {[0, 1, 2, 3, 4].map((i) => {
      const h = 18 + i * 16;
      return <rect key={i} x={30 + i * 20} y={160 - h} width="12" height={h} rx="2" fill="#bfa37c" fillOpacity={0.15 + i * 0.12} />;
    })}
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <path d={`M140 ${156 - i * 11}v6a20 6 0 0 0 40 0v-6`} fill="#e6dac8" />
        <ellipse cx="160" cy={156 - i * 11} rx="20" ry="6" fill="#f7f0e4" />
      </g>
    ))}
    <path d="M28 170h156" opacity="0.4" />
    <text x="30" y="40" fill="#8a6d3f" stroke="none" fontFamily="serif" fontSize="12" letterSpacing="2">MONTH BY MONTH</text>
  </g>
);

const BANNERS = [
  {
    href: "/festive/dhanteras-diwali",
    bg: "bg-[radial-gradient(120%_120%_at_85%_40%,#7a1a22_0%,#4a0e14_45%,#26060a_100%)]",
    dark: true,
    art: <Diya />,
    eyebrow: "Dhanteras · Friday 6 November",
    title: "Dhanteras & Diwali",
    text: "Festive picks, silver idols and today's gold rate.",
    cta: "Book a Dhanteras visit",
  },
  {
    href: "/gold-rate-today",
    bg: "bg-[radial-gradient(120%_120%_at_85%_40%,#2b241a_0%,#15120d_55%,#0b0907_100%)]",
    dark: true,
    art: <RateChart />,
    eyebrow: "Transparent pricing",
    title: "Priced at Today's Gold Rate",
    text: "Weight × rate + making + stones + GST, shown in full.",
    cta: "See today's rate",
  },
  {
    href: "/gold-exchange",
    bg: "bg-[radial-gradient(120%_120%_at_85%_40%,#1d4a3c_0%,#0f2e25_50%,#081a15_100%)]",
    dark: true,
    art: <Exchange />,
    eyebrow: "Old gold exchange",
    title: "What Is Your Old Gold Worth?",
    text: "Estimate it at today's rate and get a quote.",
    cta: "Estimate value",
  },
  {
    href: "/pages/gold-savings-scheme",
    bg: "bg-[radial-gradient(120%_120%_at_85%_40%,#fbf6ec_0%,#f2eae0_55%,#e6dac8_100%)]",
    dark: false,
    art: <Coins />,
    eyebrow: "Gold savings scheme",
    title: "Save Towards Your Next Piece",
    text: "Plan month by month. Ask us for this year's terms.",
    cta: "Learn more",
  },
];

export function ServiceBanners() {
  return (
    <ul className="grid gap-2 md:grid-cols-2">
      {BANNERS.map((b) => (
        <li key={b.href}>
          <Link href={b.href} className={cn("group relative flex aspect-[2/1] overflow-hidden", b.bg, b.dark ? "text-white" : "text-ink")}>
            <span aria-hidden className={cn("pointer-events-none absolute inset-2.5 border sm:inset-3.5", b.dark ? "border-[#d9bf8f]/35" : "border-[#8a6d3f]/30")} />
            <svg aria-hidden viewBox="0 0 200 200" className="absolute top-1/2 right-[3%] h-[84%] -translate-y-1/2 transition-transform duration-700 ease-out group-hover:scale-105">
              {b.art}
            </svg>
            <div className="relative flex w-[60%] flex-col justify-center pl-6 sm:pl-10">
              <span className={cn("text-[9px] font-medium tracking-[0.2em] uppercase sm:text-[11px]", b.dark ? "text-[#d9bf8f]" : "text-[#8a6d3f]")}>{b.eyebrow}</span>
              <h3 className="mt-1.5 font-serif text-[clamp(18px,2.5vw,32px)] leading-[1.1] font-light">{b.title}</h3>
              <p className={cn("mt-2 hidden text-[13px] leading-relaxed sm:block", b.dark ? "text-white/80" : "text-body2")}>{b.text}</p>
              <span className="mt-3 text-[9px] font-semibold tracking-[0.2em] uppercase underline underline-offset-4 sm:mt-5 sm:text-[11px]">{b.cta} →</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
