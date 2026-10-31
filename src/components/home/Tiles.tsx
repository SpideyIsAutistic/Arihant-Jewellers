import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/utils";

export type Tile = { id: string; title: string | null; href: string | null; image: string };

/** Three tall luxury image tiles (Shop by Recipient / Occasion). */
export function TileRow({ tiles, labelPosition = "top" }: { tiles: Tile[]; labelPosition?: "top" | "bottom" }) {
  if (!tiles.length) return null;
  return (
    <ul className="no-scrollbar -mx-[var(--gutter)] flex snap-x gap-4 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0">
      {tiles.map((t) => (
        <li key={t.id} className="w-[75%] shrink-0 snap-start sm:w-auto">
          <Link
            href={t.href ?? "#"}
            className="group relative block aspect-[0.74] overflow-hidden border border-line/70 bg-ink"
          >
            <Img
              src={t.image}
              alt={t.title ?? ""}
              fill
              sizes="(min-width:700px) 32vw, 75vw"
              className="object-cover opacity-90 transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div
              className={cn(
                "absolute inset-0",
                labelPosition === "top"
                  ? "bg-gradient-to-b from-black/55 via-transparent to-transparent"
                  : "bg-gradient-to-t from-black/60 via-transparent to-transparent",
              )}
            />
            {t.title && (
              <span
                className={cn(
                  "absolute inset-x-0 text-center font-serif text-[clamp(26px,3.2vw,46px)] font-light tracking-[0.08em] text-white uppercase drop-shadow-xs",
                  labelPosition === "top" ? "top-[8%]" : "bottom-[8%]",
                )}
              >
                {t.title}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
