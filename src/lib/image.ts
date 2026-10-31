"use client";

/** Resizes an image in the browser to a WebP data URL under `maxChars` (Firestore docs cap at 1 MB; the free plan has no file storage). */
export async function compressImage(file: File, maxChars = 700_000, maxPx = 1600): Promise<string> {
  const bmp = await createImageBitmap(file);
  let max = maxPx;
  for (let q = 0.82; ; q -= 0.12) {
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const data = c.toDataURL("image/webp", q);
    if (data.length < maxChars) return data;
    if (q < 0.5) {
      max = Math.round(max * 0.75);
      q = 0.94;
    }
  }
}
