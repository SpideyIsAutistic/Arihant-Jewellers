# Arihant Jewellers — catalogue website

Next.js 15 + TypeScript + Tailwind, exported as a **static site** and hosted on **Firebase (free Spark plan)**.
There is no server: the browser reads the catalogue from Firestore, and `firestore.rules` is the security.

## What the site does
- **Catalogue** of Arihant's jewellery (online checkout & shipping are switched off for now).
- **Enquire on WhatsApp** on every product + a floating WhatsApp button (number set in Admin → Settings).
- **Web3Forms**: the Contact page and each product's *Send an enquiry* form email the store's inbox.
- **Admin panel** at `/admin` — sign in with Google; only accounts in *Admin → Admin access* (plus the owner
  account written in `firestore.rules`) get in, and the database rejects edits from anyone else.
- Live gold rates, offers, collections, banners, reviews (held for approval), newsletter sign-ups.

## Data model (Firestore)
| Path | What | Who can write |
|---|---|---|
| `site/catalog` | all products (with images & options) | admins |
| `site/content` | categories, collections, offers, banners, testimonials, approved reviews, settings, metal rates | admins |
| `media/{id}` | images uploaded in the admin panel (resized WebP, stored as data URLs — Spark has no Cloud Storage) | admins |
| `reviews/{id}` | new reviews awaiting approval | anyone can create a valid one |
| `subscribers/{id}` | newsletter emails | anyone can create |
| `admins/{email}` | Google accounts allowed into /admin | admins |

The whole public site is two documents, so a visit costs ~2 Firestore reads (free plan: 50k/day).
Catalogue photos live in `public/catalogue/` (1600px WebP + `sm/` 640px versions) and are served by Firebase Hosting.

## Setup (once)
1. `npm install`
2. Create a Firebase project (Spark plan): enable **Firestore** (asia-south1), **Authentication → Google**,
   and register a **Web app with Hosting**. Put its config in `.env.local` (see `.env.example`) and the
   project id in `.firebaserc`.
3. Put the owner Google account in `firestore.rules` (`isOwner`).
4. `npm run deploy` (builds `out/` and deploys hosting + rules). Sign in at `/admin` with the owner account and
   click **Load starter catalogue** on the dashboard (loads `public/seed/*.json`). Then add the client's Google
   accounts under **Admin access**.

## Develop
```bash
npm run dev                       # http://localhost:3000 (uses the project in .env.local)
# or fully local with emulators:
NEXT_PUBLIC_USE_EMULATORS=1 npm run build && firebase emulators:start
node tests/rules.test.mjs firestore.rules   # with the firestore emulator running
```

## Rebuilding the starter catalogue
`python3 scripts/build-seed.py` regenerates `public/seed/` from `scripts/catalogue.json` (real photo products)
and `data/arihant.db` (categories/collections/settings from the old version). The dashboard import only runs
while the store is empty, so it never overwrites live data.

## How dynamic pages work on static hosting
`/products/<slug>` and `/collections/<slug>` are exported once as `/products/_` and `/collections/_`;
`firebase.json` rewrites every slug to them and the page reads the slug from the URL.
Admin edit screens use `?id=` instead.
