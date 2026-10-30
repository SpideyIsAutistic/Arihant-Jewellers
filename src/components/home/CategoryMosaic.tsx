import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { formatPriceShort } from "@/lib/format";
import { cn } from "@/lib/utils";

export type CategoryTile = { slug: string; name: string; image: string | null; from: number | null };

/** Full-bleed refined mosaic of category tiles with delicate haute joaillerie caption bars. */
export function CategoryMosaic({ tiles }: { tiles: CategoryTile[] }) {
  const rows: CategoryTile[][] = [];
  for (let i = 0; i < tiles.length; i += 2) rows.push(tiles.slice(i, i + 2));

  return (
    <div className="space-y-2">
      {rows.map((row, r) => (
        <div
          key={r}
          className={cn(
            "grid gap-2",
            row.length === 2 && (r % 2 === 0 ? "sm:grid-cols-[60%_1fr]" : "sm:grid-cols-[1fr_60%]"),
          )}
        >
          {row.map((t) => (
            <Link
              key={t.slug}
              href={`/collections/${t.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden border border-line/70 bg-cream-2 sm:aspect-auto sm:h-[min(46vw,560px)]"
            >
              <Img
                src={t.image}
                alt={t.name}
                fill
                sizes="(min-width:700px) 60vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 border-t border-line/50 bg-white/85 px-4 py-3.5 backdrop-blur-sm transition-colors group-hover:bg-white/95 sm:px-6 sm:py-4">
                {!!t.from && (
                  <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-subtle uppercase">
                    Starting from {formatPriceShort(t.from)}
                  </p>
                )}
                <p className="font-serif text-[18px] sm:text-[22px] tracking-[0.06em] text-ink font-normal uppercase mt-0.5">
                  {t.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
