"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Admin uploads live in Firestore (media/<id>) as data URLs — the free plan has no file storage. */
const mediaCache = new Map<string, Promise<string | null>>();
function useMedia(src: string | null | undefined) {
  const id = src?.startsWith("media:") ? src.slice(6) : null;
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!id) return;
    if (!mediaCache.has(id))
      mediaCache.set(
        id,
        Promise.all([import("firebase/firestore"), import("@/lib/firebase")]).then(([fs, fb]) =>
          fs.getDoc(fs.doc(fb.db(), "media", id)).then((d) => (d.data()?.data as string) ?? null),
        ),
      );
    let live = true;
    mediaCache.get(id)!.then((u) => live && setUrl(u));
    return () => {
      live = false;
    };
  }, [id]);
  return id ? url : src;
}

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
  fallbackClassName?: string;
  aspectRatio?: string | number;
  containerClassName?: string;
};

/**
 * Luxury Image wrapper:
 *  - Reserves exact aspect-ratio box (zero layout shift).
 *  - Soft cream shimmer placeholder while loading.
 *  - Fades in over 700ms ease-out with a subtle scale down from 1.03 to 1.0.
 *  - Handles cached images immediately (via img.complete) so they never flash or stay invisible.
 *  - Unsplash URLs optimized through CDN loader.
 *  - Broken images degrade gracefully to an elegant monogram placeholder.
 */
export function Img({
  src: rawSrc,
  alt,
  className,
  fallbackClassName,
  priority = false,
  fill,
  aspectRatio,
  containerClassName,
  ...rest
}: Props) {
  const src = useMedia(rawSrc);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Check if image is already cached in browser memory on mount
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  if (rawSrc?.startsWith("media:") && !src && !failed) {
    return <span aria-hidden className={cn("block bg-cream/90", fill ? "absolute inset-0" : "", className)} />;
  }

  if (!src || failed) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-cream-2 font-serif text-[clamp(18px,3vw,32px)] tracking-[0.25em] text-sand/80 select-none",
          fill ? "absolute inset-0" : "",
          fallbackClassName,
          className,
        )}
      >
        AJ
      </span>
    );
  }

  const isUnsplash = src.startsWith("https://images.unsplash.com/");
  const isCatalogue = src.startsWith("/catalogue/");

  const imageElement = (
    <>
      {/* Soft cream placeholder with slow subtle shimmer while loading */}
      {!loaded && !priority && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-0 overflow-hidden bg-cream/90 transition-opacity duration-700 ease-out",
            loaded ? "opacity-0" : "opacity-100",
          )}
        >
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite_linear] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </span>
      )}

      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        priority={priority}
        fill={fill}
        loading={priority ? undefined : "lazy"}
        className={cn(
          "transition-[opacity,transform] duration-700 ease-out will-change-[opacity,transform]",
          loaded || priority ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]",
          className,
        )}
        onLoad={() => setLoaded(true)}
        unoptimized={!isUnsplash && !isCatalogue}
        onError={() => setFailed(true)}
        {...rest}
      />
    </>
  );

  if (aspectRatio && !fill) {
    return (
      <span
        className={cn("relative block overflow-hidden bg-cream-2", containerClassName)}
        style={{ aspectRatio }}
      >
        {imageElement}
      </span>
    );
  }

  return imageElement;
}
