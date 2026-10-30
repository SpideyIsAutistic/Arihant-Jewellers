// next/image loader for the static export: resizes via Unsplash's CDN, and picks the
// small (640px) or full (1600px) WebP of catalogue photos. Everything else is served as-is.
export default function loader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 78));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  }
  if (src.startsWith("/catalogue/")) return width <= 750 ? src.replace("/catalogue/", "/catalogue/sm/") : src;
  return src;
}
