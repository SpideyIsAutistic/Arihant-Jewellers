import Link from "next/link";
import { Img } from "@/components/ui/Img";

export function StorySplit({ title, text, imageA, imageB }: { title: string; text: string; imageA: string; imageB: string }) {
  return (
    <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <div className="max-w-[420px]">
        <span className="eyebrow text-left">Our Heritage</span>
        <h2 className="font-serif text-[clamp(26px,3vw,38px)] font-normal uppercase tracking-[0.06em] text-ink leading-tight">
          {title}
        </h2>
        <p className="mt-6 text-[15px] sm:text-[16px] leading-[1.8] text-body2">{text}</p>
        <Link href="/pages/about" className="btn mt-8">
          Read more
        </Link>
      </div>
      <div className="relative h-[clamp(380px,46vw,580px)]">
        <div className="absolute top-0 right-0 h-full w-[58%] overflow-hidden border border-line/70 bg-cream-2">
          <Img
            src={imageA}
            alt="Arihant Jewellers craft"
            fill
            sizes="(min-width:1000px) 34vw, 58vw"
            className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
          />
        </div>
        <div className="absolute top-[18%] left-[4%] h-[62%] w-[48%] overflow-hidden border-4 border-white bg-cream-2 shadow-xl">
          <Img
            src={imageB}
            alt="Arihant Jewellers fine stones"
            fill
            sizes="(min-width:1000px) 28vw, 48vw"
            className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}

export function ShowroomBanner({ image, address, mapUrl, hours }: { image: string; address: string; mapUrl: string; hours: string }) {
  return (
    <div className="relative overflow-hidden bg-ink">
      <div className="relative aspect-[4/5] sm:aspect-[2.6/1]">
        <Img src={image} alt="Arihant Jewellers showroom" fill sizes="100vw" className="object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
      </div>
      <div className="page-width absolute inset-0 flex items-end pb-12 sm:items-center sm:pb-0">
        <div className="max-w-[500px] text-white">
          <p className="text-[11px] font-medium tracking-[0.25em] text-cream-2 uppercase">Visit Our Boutique</p>
          <p className="mt-3 font-serif text-[clamp(32px,4vw,56px)] leading-[1.08] font-light">
            See it, feel it, try it on.
          </p>
          <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-line text-white/90 font-light">
            {address || "Experience our full collection in person at the Arihant Jewellers showroom."}
            {hours && `\n${hours}`}
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link href="/pages/store" className="btn-light">
              Store details
            </Link>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn-light">
                Get directions
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InstagramStrip({ handle, url, images }: { handle: string; url: string; images: string[] }) {
  if (!url || !images.length) return null;
  return (
    <section className="pt-20 sm:pt-28" aria-labelledby="ig-title">
      <div className="page-width text-center">
        <span className="eyebrow">Social Journal</span>
        <h2 id="ig-title" className="h-section">
          Instagram
        </h2>
        {handle && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-[12px] font-medium tracking-[0.2em] uppercase text-subtle hover:text-ink transition-colors"
          >
            @{handle.replace(/^@/, "")}
          </a>
        )}
      </div>
      <ul className="mt-10 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {images.slice(0, 6).map((src, i) => (
          <li key={i}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden border border-line/60 bg-cream-2"
              aria-label="View on Instagram"
            >
              <Img
                src={src}
                alt=""
                fill
                sizes="(min-width:700px) 17vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
