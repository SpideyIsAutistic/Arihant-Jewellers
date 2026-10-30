# Reference Specification — Arihant Jewellers storefront

Reference audited: `gargi.shop` (Shopify, **Prestige 10.7** theme) — collection page
`/collections/silver-jewellery`, home page, product page, contact page, header mega menu,
search panel, cart drawer, filter drawer, sort menu, tablet & phone header/toolbar.

**What is reused:** layout, proportions, spacing, typography scale, component behaviour and
interaction patterns.
**What is NOT reused:** Gargi/PNG logo, photography, banner artwork, product names, copy,
reviews/testimonials, contact details, app badges, third-party app code. All imagery is
free-licensed Unsplash photography (replaceable from the admin) and all copy is original.

---

## 1. Design tokens

| Token | Reference (Gargi) | Arihant mapping |
|---|---|---|
| Brand / header bg | `#E31E25` red | `#111111` black |
| Text | `#1C1C1C` | `#1A1A1A` |
| Subdued / compare-at price | `rgb(143,119,101)` | `#776653` warm taupe (AA contrast) |
| Footer / soft section bg | `#FDF7F2` | `#FAF6EF` cream |
| Cream accent (tabs, borders, chips) | pink-cream | `#EFE6D6` / `#E4D7C1` |
| Sale badge | red ribbon, white 11px bold | black ribbon, cream text |
| Sale price | red, 16px bold | black, 16px bold |
| Borders | `#DDDDDD` | `#E2DCD2` |
| Button radius / input radius | 0 | 0 |
| Image radius (cards, tiles) | `20px 0` (TL + BR) | same |
| Badge radius | `10px 0 0` + `clip-path: polygon(0 0,100% 0,90% 50%,100% 100%,0 100%)` | same |

Typography — **Montserrat** everywhere (heading 400–700, body 400).
- Body 16px / 1.65. Small 14–15px.
- Section heading: `clamp(22px, 2.3vw, 28px)`, weight 400, letter-spacing 2px.
- Product title (grid): 14px/1.1, weight 400, `#444`, 2-line clamp.
- Product title (carousel/home): 14px, weight 600, letter-spacing 2.1px.
- PDP title: 26px, weight 400, letter-spacing 2px.
- Buttons: 15px, uppercase, letter-spacing 0.1em (1.5px), padding 10px 28px.
- Wordmark only: Cormorant Garamond (client logo stand-in).

Containers: fluid with gutters 20px (<700) / 32px (700–999) / 48px (≥1000); max 1600px.
Section vertical spacing ≈ 48–64px desktop, 32–40px mobile.

## 2. Breakpoints
- `< 700px` phone: 2-column grid, hamburger drawer, stacked toolbar (Filters | Sort | view).
- `700–1149px` tablet: 3-column grid, hamburger, logo left of centre.
- `≥ 1150px` desktop: 4-column grid, two-row centred mega-menu nav.

## 3. Global components
1. **Announcement bar** (31px, white): rotating messages with ‹ › arrows; right side
   "Store Locator" + "Track Order" links (desktop). Phone: messages only, links row below.
2. **Header** (100px desktop / 72px phone, sticky, brand bg): logo left (140px), centred
   2-row nav (16.8px, weight 500, white), icons right (search, wishlist, account, bag with
   count bubble). Active/hovered item shows 2px underline.
3. **Mega menu**: full-width white panel under header; 2 link columns (grid, 16px, 68px row
   rhythm) + 2 promo images (radius 20px 0) with captions. Opens on hover/focus, closes on leave/Esc.
4. **Mobile menu**: left drawer with accordion sub-menus, account & store links.
5. **Search panel**: drops below header, full width; input with typewriter placeholder;
   predictive results — left column (matching categories + popular searches with highlighted
   match) and right 4-column product results; Enter → `/search?q=`.
6. **Cart drawer**: right, 460px, "Cart" title, free-shipping progress, line items with qty
   stepper/remove, subtotal, checkout CTA; empty state + "Bestsellers" carousel.
7. **Footer** (cream): collapsible "Popular searches" row; 5 columns — Newsletter (email +
   SUBSCRIBE), About, Shop by, Policies, Support; socials left / payment marks right;
   centred uppercase tracked copyright.
8. **Floating WhatsApp** button bottom-left (only when a WhatsApp number is configured).

## 4. Pages

### Home (`/`)
1. Hero slideshow (≈ 2.57:1 desktop, 4:5 phone), autoplay 6s, dot pagination.
2. "Explore Our Bestsellers" — category tabs (underlined active) → 4-up product carousel.
3. Promo slideshow with heading, sub-heading and SHOP NOW button.
4. "Shop By Recipient" — 3 tall tiles (radius 20px 0).
5. "New Arrivals" — 4-up carousel + VIEW ALL outline button.
6. Trust bar — 5 icon + label items.
7. "Shop By Category" — full-bleed mosaic tiles with bottom caption "Starting from ₹X / NAME".
8. "Shop By Price" — 3 typographic tiles.
9. "Shop the Look" — lifestyle image with hotspots + product card carousel + VIEW PRODUCT.
10. "Shop By Occasion" — 3 tiles with serif uppercase label.
11. "Explore our Collections" — promo slideshow.
12. Showroom banner.
13. Brand story split (text + READ MORE, two overlapping images).
14. Service bar (icons).
15. Testimonials (cream panel, avatar, quote, dots) — admin-managed, hidden when empty.
16. Instagram strip — linked to configured profile, hidden when not configured.
17. Recently viewed products (client storage).

### Collection (`/collections/[slug]`)
Hero banner (≈ 2.57:1) → breadcrumb (11px uppercase) → centred description clamped to 3
lines + "Read More" → **sticky toolbar** (full bleed, 1px borders: grid/list toggle | product
count | sort ▾ | FILTERS) → product grid (4/3/2 cols, gap 32px × 16px) with **in-grid quick
filter prompts** ("Which category would you prefer?", "How much discount…", "Which finish…")
inserted after every 8 products → infinite scroll (IntersectionObserver + Load more fallback).
- Sort: Relevance, Newest first, Oldest first, Price low→high, Price high→low, Discount high→low.
- Filter drawer (right, 340px, dimmed overlay): Category, Metal, Finish, Gender, Price
  (dual range), Discounts (≥50/40/30/20%) — each collapsible with counts; VIEW RESULTS button.

### Product card
Image 7:8, radius 20px 0, secondary image cross-fade on hover; ribbon badge "Save N%";
wishlist heart top-right; on hover two 44px white square buttons bottom (bag = buy now,
＋ = quick add / choose options). Title, price row (sale price left, rating right),
compare-at below.

### Product (`/products/[slug]`)
Two columns (52/48). Left: vertical stack of images (phone: swipe carousel + dots), then
accordions — Description, Specifications, Jewellery Care, Shipping & Returns. Right (sticky):
title + wishlist, SKU, price row + "N% OFF" ribbon, "Inclusive of all taxes", 2×2 trust
badges, size selector (variants), estimated-delivery pincode check, share icons, quantity,
ADD TO CART (outline) + BUY IT NOW (filled), Available Offers (coupons, expandable,
"+N MORE OFFERS"). Below: reviews (summary + list + write form), related products carousel,
recently viewed. Sticky bottom bar (gift wrap checkbox, qty, ADD TO CART) after main CTA
scrolls out of view.

### Others
Search results, Cart, Checkout, Order confirmation/track, Account (login, register, orders,
order detail), Wishlist, About, Contact (centred form: name/email row, message, full-width
SEND), FAQ, Store/showroom, Policies (shipping, privacy, refunds, terms).

## 5. Asset mapping
| Slot | Source |
|---|---|
| Logo | Text wordmark "ARIHANT / JEWELLERS" (replace with client logo file) |
| Hero / promo / tiles / product photos | Unsplash (Unsplash License), hot-linked from `images.unsplash.com` with imgix sizing; replaceable per item in admin |
| Icons | Hand-drawn inline SVG line icons |
| Fonts | Montserrat Variable + Cormorant Garamond via @fontsource (self-hosted) |

## 6. Functional requirements
Catalogue + search + filters + sort; cart + wishlist (persisted); checkout with server-side
price validation, coupons, gift wrap; payments via Razorpay (env keys) and optional COD;
order emails (SMTP env); customer accounts; order tracking; reviews (moderated);
newsletter; contact form; admin panel for products, categories, collections, banners,
offers/sales, coupons, orders, customers, reviews, testimonials, settings, subscribers,
messages.
