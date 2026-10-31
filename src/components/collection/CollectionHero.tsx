import Link from "next/link";
import { Img } from "@/components/ui/Img";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[11px] tracking-[0.04em] text-body2 uppercase">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>›</span>}
            {it.href ? (
              <Link href={it.href} className="hover:text-ink">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CollectionHero({ title, image }: { title: string; image: string | null }) {
  if (!image) {
    return (
      <div className="bg-cream py-12 sm:py-16">
        <h1 className="h-section text-[clamp(26px,3vw,36px)]!">{title}</h1>
      </div>
    );
  }
  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden bg-cream-2 sm:aspect-[2.57/1]">
      <Img src={image} alt="" fill priority sizes="100vw" className="object-cover object-[50%_30%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
      <div className="page-width absolute inset-0 flex items-center">
        <h1 className="max-w-[60%] font-serif text-[clamp(34px,6vw,84px)] leading-[1] font-medium tracking-[0.02em] text-white drop-shadow-sm">
          {title}
        </h1>
      </div>
    </div>
  );
}
