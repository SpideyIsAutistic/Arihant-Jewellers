"""Builds public/seed/{catalog,content}.json — the starter data the admin dashboard can load once.

Sources: the old SQLite store (data/arihant.db: categories, collections, settings) and
scripts/catalogue.json (products made from Arihant's real photos, see scripts/import-photos.py).
Usage: python3 scripts/build-seed.py [--samples]   (--samples also keeps the old Unsplash demo products)
"""
import json, sqlite3, sys, time, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db = sqlite3.connect(os.path.join(ROOT, "data/arihant.db"))
db.row_factory = sqlite3.Row
now = int(time.time() * 1000)


def camel(k):
    a, *b = k.split("_")
    return a + "".join(x.title() for x in b)


def rows(sql):
    out = []
    for r in db.execute(sql):
        d = {camel(k): r[k] for k in r.keys()}
        for k, v in list(d.items()):
            if k.startswith("is") or k == "ruleOnSale":
                d[k] = bool(v)
            if k.endswith("At") and isinstance(v, int):
                d[k] = v * 1000
        out.append(d)
    return out


settings = {}
for r in db.execute("select key, value from settings"):
    if r["key"] != "metal_rates":
        settings[r["key"]] = json.loads(r["value"])
# Catalogue-mode copy replaces the old shop/shipping wording (new defaults live in src/lib/settings.ts)
for k in ["announcements", "trustBadges", "serviceBadges", "faqs", "aboutText", "aboutPage", "popularSearches"]:
    settings.pop(k, None)
settings["email"] = settings.get("email") or "arihantjewellers2005@gmail.com"
settings["instagramHandle"] = settings.get("instagramHandle") or "arihant_jewellers_2005"
settings["social"] = {**settings.get("social", {}), "instagram": settings.get("social", {}).get("instagram") or "https://www.instagram.com/arihant_jewellers_2005/"}

cat_path = os.path.join(ROOT, "scripts/catalogue.json")
cat = json.load(open(cat_path)) if os.path.exists(cat_path) else {"categories": [], "products": [], "banners": [], "collections": []}

categories = rows("select * from categories order by sort_order")
by_slug = {c["slug"]: c for c in categories}
for c in cat["categories"]:  # add / override categories needed by the real catalogue
    base = by_slug.get(c["slug"]) or {"id": c["slug"], "createdAt": now, "description": None, "seoTitle": None, "seoDescription": None, "heroImage": None, "isActive": True}
    base.update(c)
    by_slug[c["slug"]] = base
categories = sorted(by_slug.values(), key=lambda c: c["sortOrder"])
by_slug_new = {c["slug"] for c in cat["categories"]}
used = {p["categoryId"] for p in cat["products"]}
if not "--samples" in sys.argv:
    for c in categories:
        c["isActive"] = c["id"] in used  # hide empty demo categories

collections = [c for c in rows("select * from collections order by sort_order")
               if c["ruleMinPrice"] is None and c["ruleMaxPrice"] is None and not c["ruleOnSale"] and c["slug"] not in ("silver-jewellery", "gifts-for-mom")]
def col(slug, title, desc, **rules):
    base = dict(id=slug, slug=slug, title=title, description=desc, image=None, heroImage=None, ruleTag=None, ruleMetal=None, ruleCategoryId=None,
                ruleMinPrice=None, ruleMaxPrice=None, ruleOnSale=False, productIds=None, sortOrder=0, isActive=True, seoTitle=None, seoDescription=None, createdAt=now)
    base.update(rules); return base
collections += [
    col("diamond-jewellery", "Diamond Jewellery", "Diamond rings, necklace sets and earrings in 18K gold.", ruleTag="diamond"),
    col("gemstones-collection", "Precious Gemstones", "Natural emeralds, rubies, sapphires and hessonites.", ruleMetal="Gemstone"),
]
for c in collections:
    if c["slug"] == "gold-jewellery": c["description"] = "Gold necklaces, sets, mangalsutras, chains, pendants and rings from Arihant Jewellers."

products = list(cat["products"])
for p in products:  # diamond tag powers the Diamond Jewellery collection
    if p.get("stone") and "diamond" in p["stone"].lower() and "diamond" not in p["tags"]:
        p["tags"] += ",diamond"
def ban(placement, order, title, image, href, subtitle=None, cta="Explore", mobile=None, align="left"):
    return dict(id=f"{placement}-{order}", placement=placement, title=title, subtitle=subtitle, ctaLabel=cta, href=href, image=f"/catalogue/{image}.webp",
                mobileImage=f"/catalogue/{mobile}.webp" if mobile else None, align=align, theme="dark", meta=None, sortOrder=order, isActive=True, createdAt=now)
banners = [
    ban("hero", 0, "The Bridal Edit", "hero-bridal", "/collections/bridal", "Gold necklaces & sets for the big day", mobile="gold-kundan-style-bridal-necklace-1"),
    ban("hero", 1, "Diamonds, Set in Gold", "hero-diamond-rings", "/collections/diamond-jewellery", "Cocktail rings, bands & sets in 18K gold", mobile="ruby-and-emerald-bypass-diamond-ring-1"),
    ban("hero", 2, "Precious Gemstones", "hero-gemstones", "/collections/gemstones", "Emerald, ruby, sapphire & hessonite", mobile="hessonite-gomed-emerald-cut-1"),
    ban("hero", 3, "Silver for the Home Temple", "hero-silver", "/collections/silver-articles", "The Ashtalakshmi idol set", mobile="ashtalakshmi-silver-idol-set-on-carved-stand-2", align="center"),
    ban("promo", 0, "Cocktail Rings", "promo-emerald", "/collections/rings", "Statement pieces with emeralds & diamonds", cta="Shop rings"),
    ban("promo", 1, "Pukhraj, Panna & More", "promo-sapphire", "/collections/gemstones", "Natural gemstones, ready to set", cta="View gemstones"),
    ban("recipient", 0, "Her", "emerald-floral-cocktail-ring-1", "/collections/gifts-for-her", cta=None),
    ban("recipient", 1, "Him", "mens-onyx-and-diamond-signet-ring-2", "/collections/rings?gender=Men", cta=None),
    ban("recipient", 2, "You", "gold-snake-chain-1", "/collections/for-you", cta=None),
    ban("occasion", 0, "Wedding", "gold-bridal-choker-1", "/collections/wedding", cta=None),
    ban("occasion", 1, "Festive", "gold-jhumka-necklace-set-1", "/collections/festive", cta=None),
    ban("occasion", 2, "Everyday", "diamond-link-necklace-1", "/collections/everyday", cta=None),
] + [ban("instagram", k, None, img, None, cta=None) for k, img in enumerate([
    "ruby-halo-and-emerald-cluster-rings-1", "gold-fan-necklace-1", "yellow-sapphire-pukhraj-cushion-1",
    "rose-gold-diamond-necklace-set-1", "emerald-panna-emerald-cut-1", "gold-coin-long-necklace-1"])]
if "--samples" in sys.argv:
    imgs, vars_ = {}, {}
    for r in rows("select * from product_images order by position"):
        imgs.setdefault(r["productId"], []).append({"url": r["url"], "alt": r["alt"]})
    for r in rows("select * from variants order by position"):
        vars_.setdefault(r["productId"], []).append({"id": r["id"], "title": r["title"], "sku": r["sku"], "priceDelta": r["priceDelta"], "stock": r["stock"]})
    for p in rows("select * from products"):
        p["images"], p["variants"] = imgs.get(p["id"], []), vars_.get(p["id"], [])
        products.append(p)
    banners = banners or rows("select * from banners")

DESC = {
    "necklaces": "Gold necklaces from delicate everyday pieces to bridal chokers and temple designs — and diamond necklaces in 18K gold.",
    "necklace-sets": "Necklaces with matching earrings, in gold and in diamonds — ready for weddings, festivals and family celebrations.",
    "mangalsutra": "Traditional and contemporary mangalsutras in gold with black beads — long, short and stone-set pendants.",
    "chains": "Gold chains for men and women — rope, curb, snake, herringbone, bead and pendant chains.",
    "rings": "Diamond cocktail rings, bands, solitaires and men's rings, crafted in 18K gold.",
    "earrings": "Diamond and gold earrings to wear on their own or with a matching set.",
    "pendants": "Gold and diamond pendants — devotional, floral and modern designs.",
    "gemstones": "Natural precious gemstones — emerald (Panna), ruby (Manik), yellow sapphire (Pukhraj), blue sapphire (Neelam) and hessonite (Gomed). Ask us about weights and certification.",
    "silver-articles": "Silver idols and articles for the home temple and for gifting.",
    "brooches": "Gold saree pins and brooches.",
    "bridal": "Bridal gold necklaces, chokers, sets and diamond rings for the bride and her family.",
    "festive": "Jhumka sets, temple gold and statement rings to celebrate every festival.",
}

# No stock photography: banner images come from Arihant's own shoot, others are cleared.
HERO = {"rings": "hero-diamond-rings", "gemstones": "hero-gemstones", "silver-articles": "hero-silver", "necklaces": "hero-bridal",
        "necklace-sets": "hero-bridal", "bridal": "hero-bridal", "wedding": "hero-bridal", "diamond-jewellery": "hero-diamond-rings",
        "gemstones-collection": "promo-sapphire", "gold-jewellery": "hero-bridal", "festive": "promo-emerald"}
for c in categories + collections:
    c["heroImage"] = f"/catalogue/{HERO[c['slug']]}.webp" if c["slug"] in HERO else None
    if c.get("image") and not str(c["image"]).startswith("/catalogue/"):
        c["image"] = None
    for k in ("seoTitle", "seoDescription"):
        c[k] = None
    c["description"] = DESC.get(c["slug"], c["description"])

os.makedirs(os.path.join(ROOT, "public/seed"), exist_ok=True)
json.dump({"products": products}, open(os.path.join(ROOT, "public/seed/catalog.json"), "w"), ensure_ascii=False)
json.dump(
    {"categories": categories, "collections": collections, "offers": [], "banners": banners, "testimonials": [], "reviews": [], "settings": settings, "metalRates": None},
    open(os.path.join(ROOT, "public/seed/content.json"), "w"),
    ensure_ascii=False,
)
size = os.path.getsize(os.path.join(ROOT, "public/seed/catalog.json"))
print(f"{len(products)} products, {len(categories)} categories ({sum(c['isActive'] for c in categories)} active), {len(collections)} collections, {len(banners)} banners; catalog.json {size//1024} KB")
assert size < 900_000, "site/catalog would exceed Firestore's 1 MB document limit"
