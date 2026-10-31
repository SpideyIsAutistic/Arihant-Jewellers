import Link from "next/link";
import { GUIDES } from "@/content/guides";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Gemstone Buying Guides",
  "Plain-language guides to buying Panna, Pukhraj, Neelam, Manik and Gomed: colour, clarity, treatments, certificates and ratti weight.",
  "/guides",
);

export default function GuidesIndex() {
  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">Gemstone Buying Guides</h1>
      <p className="mt-3 mb-10 text-center text-[15px] text-body2">What to look for before you buy a precious stone, from our gemstone counter in Thane.</p>
      <ul className="divide-y divide-line border-y border-line">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`} className="block py-5 hover:bg-cream/60">
              <h2 className="text-[20px] text-ink">{g.name}</h2>
              <p className="mt-1 text-[14px] text-body2">{g.description.replace(/ Arihant Jewellers(, Thane)?\.$/, "")}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
