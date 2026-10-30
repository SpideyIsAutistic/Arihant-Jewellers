"""Turns Arihant's edited / graded / AI photos into catalogue products.

Reads   _photos/  (copied from Downloads/Rings, Pictures/2026-10-13 Edited)  + _photos/_work/index.json
Writes  public/catalogue/<slug>-<n>.webp (1600px) + public/catalogue/sm/... (640px)
        scripts/catalogue.json  (products, categories, banners → consumed by build-seed.py)
Usage:  python3 scripts/import-photos.py [start] [end]   (process products[start:end]; run in chunks)

Crops: "full" keeps the frame; "auto" finds the in-focus ring (shallow depth of field);
(cx, cy, w) crops a 4:5 box centred at fractions cx, cy with width w of the frame (loose stones).
"""
import json, os, re, sys
import numpy as np
from PIL import Image, ImageOps, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHOTOS = os.path.join(ROOT, "_photos")
OUT = os.path.join(ROOT, "public/catalogue")
IDX = {e["i"]: e["path"] for e in json.load(open(os.path.join(PHOTOS, "_work/index.json")))}

# ── categories (slug, name, sortOrder) ──
CATS = [
    ("necklaces", "Necklaces", 1), ("necklace-sets", "Necklace Sets", 2), ("mangalsutra", "Mangalsutra", 3),
    ("chains", "Gold Chains", 4), ("rings", "Rings", 5), ("earrings", "Earrings", 6), ("pendants", "Pendants", 7),
    ("gemstones", "Gemstones", 8), ("silver-articles", "Silver Articles", 9), ("brooches", "Brooches & Pins", 10),
]

D18 = "18K Gold (750), Diamonds"
# name, category, metal, purity, stone, gender, tags, images
P = []
def add(name, cat, imgs, metal="Gold", purity=None, stone=None, gender="Women", tags="new", desc=None):
    P.append(dict(name=name, cat=cat, imgs=imgs, metal=metal, purity=purity, stone=stone, gender=gender, tags=tags, desc=desc))

# ── Diamond & gemstone rings (Arihant ring shoot; first image = main) ──
A = "auto"
add("Emerald Drop Chevron Diamond Ring", "rings", [124, 187, (122, "full")], purity=D18, stone="Diamonds, Emeralds", tags="new,bestseller,her")
add("Twisted Pear Diamond Ring", "rings", [127, 189], purity=D18, stone="Diamonds", tags="new,her,everyday")
add("Rose Gold Open Heart Diamond Ring", "rings", [188], purity=D18, stone="Diamonds", tags="new,her,gift")
add("Wishbone Diamond Ring", "rings", [267, 186, (334, "full")], purity=D18, stone="Diamonds", tags="new,everyday,her")
add("Gold Leaf Diamond Band", "rings", [174, 190], purity=D18, stone="Diamond", tags="new,everyday")
add("Double Chevron Diamond Ring", "rings", [192, 269, 270], purity=D18, stone="Diamonds", tags="bestseller,her")
add("Emerald Fern Cocktail Ring", "rings", [271, 193, 194], purity=D18, stone="Emeralds, Diamonds", tags="bestseller,festive,her")
add("Ruby Halo & Emerald Cluster Rings", "rings", [(337, "full"), 273], purity=D18, stone="Ruby, Emerald, Diamonds", tags="bestseller,bridal,wedding")
add("Ruby & Emerald Bypass Diamond Ring", "rings", [274, 195], purity=D18, stone="Ruby, Emerald, Diamonds", tags="festive,bridal")
add("Wave Diamond Ring", "rings", [196], purity=D18, stone="Diamonds", tags="new,everyday")
add("Pointed V Diamond Ring", "rings", [138, 197], purity=D18, stone="Diamonds", tags="everyday,her")
add("Diamond Cage Statement Band", "rings", [198, 276, 139, 199], purity=D18, stone="Diamonds", tags="bestseller,festive")
add("Triple Chevron Rose Gold Diamond Ring", "rings", [200, 201], purity=D18, stone="Diamonds", tags="new,her")
add("Emerald Floral Cocktail Ring", "rings", [(335, "full"), 140, 202], purity=D18, stone="Emerald, Diamonds", tags="bestseller,bridal,wedding")
add("Emerald Tower Diamond Ring", "rings", [203], purity=D18, stone="Emerald, Diamonds", tags="festive")
add("Gold Swirl Diamond Ring", "rings", [205], purity=D18, stone="Diamond", tags="everyday,gift")
add("Minimal V Gold Ring", "rings", [206, 141], purity=D18, stone="Diamond", tags="everyday,gift,self")
add("Men's Square Diamond Ring", "rings", [281], purity=D18, stone="Diamonds", gender="Men", tags="self")
add("Men's Pavé Panel Diamond Ring", "rings", [175], purity=D18, stone="Diamonds", gender="Men", tags="self,gift")
add("Men's Onyx & Diamond Signet Ring", "rings", [(336, "full"), 208, 209, 210], purity=D18, stone="Onyx, Diamonds", gender="Men", tags="bestseller,self")
add("Gold Link Ring", "rings", [144], purity="18K Gold (750)", tags="everyday,self")
add("Rose Gold Diamond Panel Band", "rings", [211, 285], purity=D18, stone="Diamonds", gender="Unisex", tags="everyday")
add("Men's Six-Diamond Band", "rings", [147], purity=D18, stone="Diamonds", gender="Men", tags="self,gift")
add("Men's Multi-Row Diamond Ring", "rings", [286, 212, 288, 289], purity=D18, stone="Diamonds", gender="Men", tags="bestseller,self")
add("Double Arc Open Diamond Ring", "rings", [214, 290], purity=D18, stone="Diamonds", tags="new,her")
add("Geometric Open Diamond Ring", "rings", [291], purity=D18, stone="Diamonds", tags="new")
add("Rose Gold Arch Diamond Ring", "rings", [215], purity=D18, stone="Diamonds", tags="her")
add("Men's Diamond Grid Ring", "rings", [176, 293, 216], purity=D18, stone="Diamonds", gender="Men", tags="bestseller,self")
add("Diamond Strip Textured Band", "rings", [152, 294], purity=D18, stone="Diamonds", gender="Unisex", tags="everyday")
add("Two-Tone Diamond Panel Band", "rings", [295], purity=D18, stone="Diamonds", gender="Unisex", tags="everyday")
add("Men's Link Diamond Ring", "rings", [296, 218, 219, 220, 297], purity=D18, stone="Diamonds", gender="Men", tags="self,gift")
add("Rose Gold Solitaire Band", "rings", [156], purity=D18, stone="Diamond", gender="Unisex", tags="gift")
add("Slim Solitaire Band", "rings", [298, 221], purity=D18, stone="Diamond", tags="everyday,gift")
add("Two-Tone Diamond Eternity Band", "rings", [222], purity=D18, stone="Diamonds", gender="Unisex", tags="wedding,gift")
add("Classic Two-Tone Gold Band", "rings", [299], purity="18K Gold (750)", gender="Unisex", tags="wedding")

# ── Loose gemstones ((index, cx, cy, width)) ──
G = dict(metal="Gemstone", gender="Unisex", tags="new")
add("Emerald (Panna) — Emerald Cut", "gemstones", [(177, .50, .50, .34), (309, .48, .50, .22), (162, .52, .47, .24), (303, .44, .45, .4), (224, .51, .46, .4)], stone="Emerald", **G)
add("Deep Green Emerald (Panna)", "gemstones", [(307, .51, .53, .3), (226, .51, .53, .3), (302, .50, .45, .3)], stone="Emerald", **G)
add("Yellow Sapphire (Pukhraj) — Oval", "gemstones", [(178, .52, .50, .36), (239, .52, .48, .28), (169, .48, .49, .28), (317, .51, .50, .28)], stone="Yellow Sapphire", **G)
add("White Sapphire — Oval", "gemstones", [(240, .49, .53, .28), (319, .48, .50, .28)], stone="White Sapphire", **G)
add("Ruby (Manik) — Oval", "gemstones", [(179, .41, .46, .4), (241, .48, .45, .3), (243, .46, .53, .28), (244, .51, .51, .28)], stone="Ruby", **G)
add("Pink Ruby — Emerald Cut", "gemstones", [(180, .57, .45, .42), (248, .49, .48, .3), (323, .49, .62, .3), (246, .50, .58, .3)], stone="Ruby", **G)
add("Blue Sapphire (Neelam)", "gemstones", [(181, .50, .53, .34), (251, .47, .55, .24), (325, .46, .53, .24)], stone="Blue Sapphire", **G)
add("Light Blue Sapphire", "gemstones", [(326, .51, .57, .28), (255, .51, .57, .28), (249, .50, .52, .28)], stone="Sapphire", **G)
add("Yellow Sapphire (Pukhraj) — Cushion", "gemstones", [(182, .51, .50, .36), (256, .53, .55, .28), (257, .48, .51, .28), (258, .53, .45, .28)], stone="Yellow Sapphire", **G)
add("Hessonite (Gomed) — Oval", "gemstones", [(183, .51, .50, .36), (329, .52, .57, .28), (264, .52, .55, .28)], stone="Hessonite", **G)
add("Hessonite (Gomed) — Emerald Cut", "gemstones", [(184, .48, .52, .36), (185, .50, .52, .36), (265, .53, .52, .26), (331, .50, .58, .26)], stone="Hessonite", **G)

# ── Showroom shoot: necklaces, sets, mangalsutra, chains, silver ──
F = lambda *ix: [(i, "full") for i in ix]
add("Ashtalakshmi Silver Idol Set on Carved Stand", "silver-articles", F(1, 2, 3, 0), metal="Silver", gender="Unisex", tags="bestseller,festive,gift", desc="Eight silver Lakshmi idols on an ornately carved silver stand — a centrepiece for the home temple and a treasured festive gift.")
add("Diamond Pendant & Earring Set", "pendants", F(4), purity=None, stone="Diamonds", tags="new,gift")
add("Gold Choker Necklace Set", "necklace-sets", F(5, 6), tags="bestseller,bridal,wedding")
add("Gold Coin Long Necklace", "necklaces", F(7, 8, 9, 10), tags="bestseller,festive,wedding")
add("Gold Temple Necklace", "necklaces", F(11), tags="festive,bridal")
add("Delicate Gold Necklace", "necklaces", F(12), tags="everyday,her")
add("Gold Ganesha Pendant", "pendants", F(13, 14), gender="Unisex", tags="gift,festive")
add("Gold Leaf Fringe Necklace", "necklaces", F(15), tags="festive")
add("Gold & Diamond Leaf Necklace", "necklaces", F(16, 21), stone="Diamonds", tags="new,her")
add("Gold Drop Necklace Set", "necklace-sets", F(17, 18), tags="wedding,her")
add("Gold Saree Brooch", "brooches", F(19, 20), tags="gift,festive")
add("Gold Fan Necklace", "necklaces", F(27, 22, 23, 28), tags="bestseller,bridal,wedding")
add("Gold Leaf Pendant", "pendants", F(26, 24, 25), tags="everyday,gift")
add("Rose Gold Diamond Necklace Set", "necklace-sets", F(30, 29, 31, 32), purity=D18, stone="Diamonds", tags="bestseller,her,wedding")
add("Diamond Drop Necklace Set", "necklace-sets", F(35, 33, 34, 36, 37), purity=D18, stone="Diamonds", tags="new,bridal,wedding")
add("Diamond Drop Earrings", "earrings", F(38, 39), purity=D18, stone="Diamonds", tags="gift,her")
add("Diamond Link Necklace", "necklaces", F(41, 40, 42), purity=D18, stone="Diamonds", tags="new,everyday")
add("Emerald Drop Diamond Pendant Set", "necklace-sets", F(44, 43, 45), purity=D18, stone="Emeralds, Diamonds", tags="festive,her")
add("Diamond Collar Necklace", "necklaces", F(47, 46), purity=D18, stone="Diamonds", tags="bridal,wedding")
add("Gold Jhumka Necklace Set", "necklace-sets", F(48, 49, 51, 50), tags="bestseller,bridal,festive")
add("Gold Bridal Choker", "necklaces", F(53, 52), tags="bridal,wedding")
add("Gold Pendant Mangalsutra", "mangalsutra", F(54, 55), tags="wedding,her")
add("Royal Gold Bridal Choker", "necklaces", F(56), tags="bridal,wedding")
add("Gold Kundan-Style Bridal Necklace", "necklaces", F(57, 58), tags="bestseller,bridal,wedding")
add("Gold Peacock Mangalsutra", "mangalsutra", F(59, 60), tags="wedding")
add("Classic Gold Mangalsutra", "mangalsutra", F(61, 62), tags="bestseller,wedding")
add("Long Gold Mangalsutra", "mangalsutra", F(63), tags="wedding")
add("Stone-Set Pendant Mangalsutra", "mangalsutra", F(64, 65), stone="Coloured stones", tags="new,wedding")
add("Ruby Drop Mangalsutra", "mangalsutra", F(66), stone="Ruby", tags="new")
add("Gold Pendant Chain Mangalsutra", "mangalsutra", F(67), tags="everyday")
add("Gold Temple Pendant Mangalsutra", "mangalsutra", F(68), tags="festive")
add("Gold Twin-Strand Mangalsutra", "mangalsutra", F(69), tags="wedding")
add("Polki-Style Pendant Mangalsutra", "mangalsutra", F(70, 71), stone="Coloured stones", tags="bridal")
add("Gold Medallion Mangalsutra", "mangalsutra", F(72, 73, 74), tags="wedding")
add("Gold Leaf Pendant Mangalsutra", "mangalsutra", F(75), tags="everyday")
add("Gold Twin-Drop Mangalsutra", "mangalsutra", F(76), tags="new")
add("Emerald Drop Mangalsutra", "mangalsutra", F(77), stone="Emerald", tags="festive")
add("Stone Teardrop Pendant Mangalsutra", "mangalsutra", F(78, 79), stone="Coloured stones", tags="bestseller")
add("Gold Drop Pendant Chain", "chains", F(80, 81), tags="everyday,her")
add("Fine Gold Pendant Chain", "chains", F(82), tags="everyday")
add("Black Bead Pendant Chain", "mangalsutra", F(83), tags="everyday")
add("Gold Bead Drop Chain", "chains", F(84, 85), tags="new")
add("Gold Pendant Necklace Chain", "chains", F(86, 87), tags="her")
add("Gold Charm Chain", "chains", F(88), tags="everyday")
add("Black Bead Charm Mangalsutra", "mangalsutra", F(89), tags="everyday")
add("Gold Bead Necklace", "chains", F(90), tags="festive")
add("Gold Rope Chain", "chains", F(91, 92), gender="Unisex", tags="bestseller,self")
add("Gold Twisted Rope Chain", "chains", F(93, 94), gender="Unisex", tags="self")
add("Heavy Gold Link Chain", "chains", F(95), gender="Men", tags="self")
add("Gold Braided Chain", "chains", F(96), gender="Unisex", tags="everyday")
add("Gold Curb Chain", "chains", F(97, 98), gender="Unisex", tags="bestseller,self")
add("Gold Ball Bead Chain", "chains", F(99, 100), tags="festive,her")
add("Gold Bead Station Chain", "chains", F(101, 102, 103), tags="everyday")
add("Fine Gold Ball Chain", "chains", F(104), tags="everyday")
add("Gold Layered Chain", "chains", F(105, 106), tags="new")
add("Gold Triple-Strand Chain", "chains", F(107, 108), tags="festive")
add("Gold Barrel Bead Chain", "chains", F(109, 110), tags="new")
add("Fine Gold Box Chain", "chains", F(111), gender="Unisex", tags="everyday,gift")
add("Gold Wheat Chain", "chains", F(112, 113), gender="Unisex", tags="everyday")
add("Long Fine Gold Chain", "chains", F(114), gender="Unisex", tags="everyday")
add("Gold Snake Chain", "chains", F(115, 116), gender="Unisex", tags="bestseller,everyday")
add("Gold Flat Snake Chain", "chains", F(117, 118), gender="Unisex", tags="everyday")
add("Gold Herringbone Chain", "chains", F(119), gender="Unisex", tags="new")
add("Wide Gold Herringbone Chain", "chains", F(120, 121), gender="Unisex", tags="bestseller,self")


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower().replace("&", "and").replace("'", "")).strip("-")


def load(path):
    im = Image.open(path)
    im.draft("RGB", (3200, 3200))
    return ImageOps.exif_transpose(im).convert("RGB")


def subject_box(im, pad=0.6):
    """Ring photos: shallow depth of field leaves the backdrop soft, so local sharpness marks the piece."""
    W, H = im.size
    s = 480 / max(W, H)
    g = np.asarray(im.resize((int(W * s), int(H * s))).convert("L"), dtype=np.float32)
    lap = np.abs(g[1:-1, 2:] + g[1:-1, :-2] + g[2:, 1:-1] + g[:-2, 1:-1] - 4 * g[1:-1, 1:-1])
    k = 13
    c = np.pad(lap, k, mode="edge").cumsum(0).cumsum(1)
    e = (c[2 * k:, 2 * k:] - c[:-2 * k, 2 * k:] - c[2 * k:, :-2 * k] + c[:-2 * k, :-2 * k])[: lap.shape[0], : lap.shape[1]]
    h, w = e.shape
    m = np.zeros_like(e)
    m[int(h * .08): int(h * .95), int(w * .08): int(w * .92)] = 1
    e = e * m
    ys, xs = np.nonzero(e >= np.percentile(e[m > 0], 97))
    if len(xs) < 20:
        return (0, 0, W, H)
    x0, x1 = np.percentile(xs, [3, 97]); y0, y1 = np.percentile(ys, [3, 97])
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    bh = max((y1 - y0) * (1 + pad), (x1 - x0) * (1 + pad) * 5 / 4, h * 0.35); bw = bh * 4 / 5
    if bw > w: bw = w; bh = bw * 5 / 4
    if bh > h: bh = h; bw = bh * 4 / 5
    l = min(max(cx - bw / 2, 0), w - bw); t = min(max(cy - bh / 2, 0), h - bh)
    return tuple(int(v / s) for v in (l + 1, t + 1, l + bw + 1, t + bh + 1))


def frac_box(im, cx, cy, wf):
    W, H = im.size
    bw = W * wf; bh = bw * 5 / 4
    if bh > H: bh = H; bw = bh * 4 / 5
    l = min(max(cx * W - bw / 2, 0), W - bw); t = min(max(cy * H - bh / 2, 0), H - bh)
    return (int(l), int(t), int(l + bw), int(t + bh))


def wide_box(im, cx, cy, hf, aspect):
    W, H = im.size
    bh = H * hf; bw = bh * aspect
    if bw > W: bw = W; bh = bw / aspect
    l = min(max(cx * W - bw / 2, 0), W - bw); t = min(max(cy * H - bh / 2, 0), H - bh)
    return (int(l), int(t), int(l + bw), int(t + bh))


# Home-page banners: (file, source index, crop). "autowide" centres on the in-focus ring.
BANNERS = [
    ("hero-bridal", 57, (.5, .42, .8, 2.57)),
    ("hero-diamond-rings", 274, ("autowide", 2.57)),
    ("hero-gemstones", 184, (.48, .5, .62, 2.57)),
    ("hero-silver", 1, (.5, .5, 1, 2.57)),
    ("promo-emerald", 140, ("autowide", 2.27)),
    ("promo-sapphire", 182, (.51, .5, .7, 2.27)),
    ("showroom", 0, (.5, .5, 1, 2.6)),
    ("about", 2, (.5, .5, 1, 2.6)),
]


def render_banner(name, i, mode):
    im = load(os.path.join(PHOTOS, IDX[i]))
    if mode[0] == "autowide":
        l, t, r, b = subject_box(im)
        cx, cy = (l + r) / 2 / im.width, (t + b) / 2 / im.height
        box = wide_box(im, cx, cy, min(1, (b - t) / im.height * 1.15), mode[1])
    else:
        box = wide_box(im, *mode)
    im = im.crop(box)
    for size, path in [(2400, f"{OUT}/{name}.webp"), (640, f"{OUT}/sm/{name}.webp")]:
        out = im.copy(); out.thumbnail((size, size), Image.LANCZOS)
        finish(out).save(path, "WEBP", quality=80, method=5)


def finish(im):
    """Light catalogue polish: a touch of contrast & sharpness after resizing."""
    im = ImageEnhance.Contrast(im).enhance(1.04)
    return ImageEnhance.Sharpness(im).enhance(1.15)


def render(spec, dest):
    if isinstance(spec, int): i, mode = spec, "auto"
    elif len(spec) == 2: i, mode = spec
    else: i, mode = spec[0], spec[1:]
    im = load(os.path.join(PHOTOS, IDX[i]))
    if mode == "auto": im = im.crop(subject_box(im))
    elif mode != "full": im = im.crop(frac_box(im, *mode))
    for size, path in [(1600, dest), (640, dest.replace("/catalogue/", "/catalogue/sm/"))]:
        out = im.copy(); out.thumbnail((size, size), Image.LANCZOS)
        finish(out).save(path, "WEBP", quality=80, method=5)


def main():
    os.makedirs(OUT + "/sm", exist_ok=True)
    start, end = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) > 2 else (0, len(P))
    for p in P[start:end]:
        slug = slugify(p["name"])
        for n, spec in enumerate(p["imgs"], 1):
            dest = f"{OUT}/{slug}-{n}.webp"
            if not os.path.exists(dest.replace("/catalogue/", "/catalogue/sm/")):
                render(spec, dest)
        print("done", start, slug, flush=True)
        start += 1


def manifest():
    cats = [dict(id=s, slug=s, name=n, sortOrder=o, image=None, isActive=True) for s, n, o in CATS]
    first = {}
    products, counts = [], {}
    for k, p in enumerate(P):
        slug = slugify(p["name"])
        counts[p["cat"]] = counts.get(p["cat"], 0) + 1
        # necklaces and necklace-sets both start "ne": give sets their own prefix so SKUs stay unique
        sku = f"AJ-{'NS' if p['cat'] == 'necklace-sets' else p['cat'][:2].upper()}-{counts[p['cat']]:03d}"
        imgs = [dict(url=f"/catalogue/{slug}-{n}.webp", alt=p["name"] if n == 1 else f"{p['name']} — view {n}") for n in range(1, len(p["imgs"]) + 1)]
        first.setdefault(p["cat"], imgs[0]["url"])
        desc = p["desc"] or (
            f"{p['name']} from the Arihant Jewellers collection"
            + (f", set with {p['stone'].lower()}" if p["stone"] and p["metal"] != "Gemstone" else "")
            + ". Ask us on WhatsApp for today's price, weight and availability, or visit our showroom in Thane to see it in person."
        )
        if p["metal"] == "Gemstone":
            desc = f"Natural {p['stone'].lower()} from Arihant Jewellers' gemstone collection. Ask us for weight (carats), origin and certification details, or to have it set in a ring or pendant of your choice."
        products.append(dict(
            id=f"p{k + 1:03d}", name=p["name"], slug=slug, sku=sku, categoryId=p["cat"], description=desc,
            metal=p["metal"], purity=p["purity"], finish=None, gender=p["gender"], stone=p["stone"], weightGrams=None,
            dimensions=None, price=0, compareAtPrice=None, tags=p["tags"], isActive=True, isSample=False,
            careInstructions=None, seoTitle=None, seoDescription=None, images=imgs,
            variants=[dict(id=f"v{k + 1:03d}", title="Default", sku=None, priceDelta=0, stock=1)],
            createdAt=1793300000000 - k * 60000, updatedAt=1793300000000,
        ))
    for c in cats:
        c["image"] = first.get(c["slug"])
    return dict(categories=cats, products=products)


if __name__ == "__main__":
    if sys.argv[1:2] == ["banners"]:
        for b in BANNERS: render_banner(*b); print("banner", b[0], flush=True)
    elif sys.argv[1:2] == ["manifest"]:
        json.dump(manifest(), open(os.path.join(ROOT, "scripts/catalogue.json"), "w"), ensure_ascii=False, indent=1)
        print(len(P), "products")
    else:
        main()
