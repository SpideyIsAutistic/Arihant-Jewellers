import Link from "next/link";
import { faqJsonLd, JsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Ring Size Guide (Indian Sizes 1–30)",
  "Find your Indian ring size at home with a strip of paper or an old ring, plus a size chart in millimetres. Arihant Jewellers, Thane.",
  "/pages/ring-size-guide",
);

// Inner circumference (mm) per Indian size; diameter = circumference / π.
// shortcut: Indian charts differ by up to one size between jewellers; we confirm the size in person or from the mm measurement.
const CIRC = [41.0, 42.7, 42.9, 43.6, 44.8, 46.1, 47.4, 48.0, 48.7, 50.0, 51.2, 51.9, 53.1, 54.4, 55.1, 56.3, 57.0, 58.3, 58.9, 60.2, 60.8, 62.1, 62.7, 64.0, 64.6, 65.9, 67.2, 67.8, 69.1, 71.0];

const FAQS = [
  {
    q: "How do I measure my ring size with paper?",
    a: "Wrap a thin strip of paper around the base of your finger, mark where it overlaps, and measure the length in millimetres with a ruler. That is your inner circumference; find the closest size in the chart.",
  },
  {
    q: "How do I measure using a ring I already own?",
    a: "Place a ring that fits the same finger on a ruler and measure the inside diameter, edge to edge, in millimetres. Find the closest diameter in the chart.",
  },
  {
    q: "What if I'm between two sizes?",
    a: "Choose the larger size, especially for wide bands, which feel tighter. Fingers are slightly bigger in the evening and in warm weather, so measure at the end of the day.",
  },
  {
    q: "Can a ring be resized later?",
    a: "Most plain gold rings can be adjusted by one or two sizes. Eternity bands and rings set with stones all the way round usually cannot. Ask our team before you buy.",
  },
];

export default function RingSizeGuide() {
  return (
    <div className="narrow-width py-14 sm:py-20">
      <h1 className="h-section">Ring Size Guide</h1>
      <p className="mt-3 text-center text-[15px] text-body2">
        Measure at home in two minutes, then send us the number in millimetres, or{" "}
        <Link href="/pages/book-appointment" className="underline">visit the showroom</Link> and we&apos;ll size your finger for free.
      </p>
      <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-body2">
        {FAQS.map((f) => (
          <section key={f.q}>
            <h2 className="mb-1 text-[18px] text-ink">{f.q}</h2>
            <p>{f.a}</p>
          </section>
        ))}
      </div>
      <h2 className="mt-12 mb-4 text-[22px] text-ink">Indian ring size chart</h2>
      <table className="w-full border border-line text-[14px]">
        <thead className="bg-cream text-[12px] tracking-[0.12em] uppercase">
          <tr>
            <th className="px-3 py-2.5 text-left">Indian size</th>
            <th className="px-3 py-2.5 text-right">Inner circumference</th>
            <th className="px-3 py-2.5 text-right">Inner diameter</th>
          </tr>
        </thead>
        <tbody>
          {CIRC.map((c, i) => (
            <tr key={i} className="border-t border-line">
              <td className="px-3 py-2">{i + 1}</td>
              <td className="px-3 py-2 text-right">{c.toFixed(1)} mm</td>
              <td className="px-3 py-2 text-right">{(c / Math.PI).toFixed(1)} mm</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[13px] text-subtle">Sizes can differ slightly between jewellers, so tell us your measurement in millimetres when you enquire and we&apos;ll match it.</p>
      <p className="mt-10 text-[15px] text-body2">
        Ready to choose? Browse <Link href="/collections/rings" className="underline">rings</Link>.
      </p>
      <JsonLd data={faqJsonLd(FAQS)} />
    </div>
  );
}
