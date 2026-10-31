# Arihant Jewellers — SEO audit (2026-10-30)

Status: **implemented & verified (build-level)** · Owner: TheGrowthBureau (site build) · Next: owner connects custom domain & Search Console

## Charter
- **Objective:** get Arihant's products, collections and showroom found in Google (and readable by AI search tools) for Thane jewellery searches.
- **Property:** https://arihant-jewellers-9dffa.web.app (Firebase Hosting, static Next.js export with full SSG pre-rendering).
- **Lanes run:** technical, page/metadata, structured data, local, images (light), Markdown discovery (light).

## Status of Findings

### F1 — Pre-render products and collections with per-page metadata · **RESOLVED**
- **Changes applied:**
  - `src/lib/server-catalog.ts` provides server-side catalogue access at build time using seed data.
  - `src/app/(store)/products/[slug]/page.tsx` now uses `generateStaticParams()` to pre-render all 110 active products (plus `_` fallback).
  - Dynamic `generateMetadata()` generates per-page `<title>`, `<meta name="description">`, `<link rel="canonical">`, OpenGraph images and Twitter tags.
  - `src/views/ProductPage.tsx` accepts `initialData` and `initialSettings`, rendering full H1, specification tables, gallery, and `Product` JSON-LD schema into the static HTML during SSG.
  - `src/app/(store)/collections/[slug]/page.tsx` now pre-renders all 23 collection & category routes (plus `_` fallback) with unique metadata.
  - `src/views/CollectionPage.tsx` prerenders `CollectionHero` H1, breadcrumbs, description, initial 24 product cards, and `BreadcrumbList` JSON-LD schema into the static HTML with clean `<Suspense>` isolation for client search parameters.

### F2 — Sitemap and clean robots.txt · **RESOLVED**
- **Changes applied:**
  - Added `src/app/sitemap.ts` which generates `out/sitemap.xml` with all 110 products, 23 collections, info pages (About, Store, Contact, FAQ), and 4 policy pages.
  - Updated `src/app/robots.ts` to include `Sitemap: https://arihant-jewellers-9dffa.web.app/sitemap.xml`, dropped the non-standard `Host:` header, and disallowed `/admin`, `/wishlist`, and `/search`.

### F3 — Canonical tags & production base URL · **RESOLVED**
- **Changes applied:**
  - `src/lib/utils.ts` and `src/app/layout.tsx` now default production builds to `https://arihant-jewellers-9dffa.web.app` (overriding any localhost defaults).
  - Every page (products, collections, policies, about, store, contact, faq) exports explicit `<link rel="canonical">` in its `<head>`.

### F4 — Local SEO & showroom details · **RESOLVED**
- **Changes applied:**
  - Default settings in `src/lib/settings.ts` updated with official showroom address in Thane West: `Beside Bank of Baroda Waghbill, Shop no.8-G,Vijay Apt,Phase-3 Ghodbunder road, Waghbil Naka Flyover, Thane West, Thane, Maharashtra 400615`, showroom hours (`Mon – Sun: 10:30 AM – 9:00 PM`), Instagram link, and Google Maps direction link.
  - Added `JewelryStore` JSON-LD structured data with GeoCoordinates, PostalAddress, OpeningHoursSpecification, and social profiles to the home page (`/`) and showroom page (`/pages/store`).

### F5 — Core content pages rendered to static HTML · **RESOLVED**
- **Changes applied:**
  - `/` (Home page) pre-renders full `<h1>Arihant Jewellers — gold, diamond and gemstone jewellery in Thane</h1>`, hero slideshow, bestseller products, trust badges, category mosaic, brand story, and showroom banner.
  - `/pages/about`, `/pages/store`, `/pages/contact`, `/pages/faq`, and `/policies/[slug]` pre-render full copy and semantic headings at build time.

### F6 — Product structured data · **MONITORED**
- Verified `out/products/emerald-floral-cocktail-ring.html` contains valid `schema.org/Product` JSON-LD with offer price, currency, SKU, description, and images.

### F7 — Catalogue images · **ONGOING**
- Catalogue photos (WebP 1600 px + 640 px) are served with matching product name alt text.
