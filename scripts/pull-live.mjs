// Downloads the live catalogue (site/catalog, site/content — both public) into data/live/,
// so the pre-built pages and sitemap match what's live (unlisted products left out, current names and photos).
// Runs before every build ("prebuild"). Skipped for emulator builds; if the download fails, the build
// falls back to public/seed and says so.
import fs from "fs";
import path from "path";

const out = path.join(process.cwd(), "data", "live");
if (process.env.NEXT_PUBLIC_USE_EMULATORS === "1") {
  fs.rmSync(out, { recursive: true, force: true }); // emulator builds use the seed, never a stale live copy
  process.exit(0);
}

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || JSON.parse(fs.readFileSync(".firebaserc", "utf8")).projects.default;
const base = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/site`;

/** Firestore REST value → plain JSON (the same shape the app stores). */
function plain(v) {
  if ("mapValue" in v) return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, plain(x)]));
  if ("arrayValue" in v) return (v.arrayValue.values ?? []).map(plain);
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("nullValue" in v) return null;
  return Object.values(v)[0]; // string, boolean, timestamp
}

try {
  fs.mkdirSync(out, { recursive: true });
  for (const doc of ["catalog", "content"]) {
    const res = await fetch(`${base}/${doc}`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`site/${doc}: HTTP ${res.status}`);
    const data = plain({ mapValue: await res.json() });
    if (doc === "catalog" && !Array.isArray(data.products)) throw new Error("site/catalog has no products");
    fs.writeFileSync(path.join(out, `${doc}.json`), JSON.stringify(data));
  }
  const n = JSON.parse(fs.readFileSync(path.join(out, "catalog.json"), "utf8")).products.length;
  console.log(`pull-live: ${n} products from the live store`);
} catch (e) {
  fs.rmSync(out, { recursive: true, force: true }); // never build from a half-written copy
  console.warn(`pull-live: couldn't download the live store (${e.message}); building from public/seed instead.`);
}
