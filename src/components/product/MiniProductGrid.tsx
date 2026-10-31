import Link from "next/link";
import type { Product } from "@/db/schema";
import { Img } from "@/components/ui/Img";

/** Simple linked thumbnails for content pages (build-time list of products). */
export function MiniProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {products.map((p) => (
        <li key={p.id}>
          <Link href={`/products/${p.slug}`} className="group block">
            <span className="relative block aspect-[4/5] overflow-hidden bg-cream-2">
              {p.images[0] && <Img src={p.images[0].url} alt={p.images[0].alt || p.name} fill sizes="(min-width:640px) 30vw, 50vw" className="object-cover transition-transform group-hover:scale-105" />}
            </span>
            <span className="mt-2 block text-[14px]">{p.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
