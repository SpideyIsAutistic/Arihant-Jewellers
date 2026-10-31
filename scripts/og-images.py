"""Makes 1200x630 JPG share images (WhatsApp/Facebook previews don't reliably show WebP).

public/og/<slug>.jpg for each product (first photo), public/og/default.jpg for everything else.
Usage: python3 scripts/og-images.py
"""
import json, os
from PIL import Image, ImageFilter, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public/og")
W, H = 1200, 630
os.makedirs(OUT, exist_ok=True)


def card(src, dest):
    im = Image.open(src).convert("RGB")
    # blurred, darkened fill so portrait photos don't leave bars
    bg = im.copy()
    bg_ratio = max(W / bg.width, H / bg.height)
    bg = bg.resize((round(bg.width * bg_ratio), round(bg.height * bg_ratio)), Image.LANCZOS)
    bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
    bg = ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(28))).enhance(0.55)
    fg = im.copy()
    fg.thumbnail((W, H), Image.LANCZOS)
    bg.paste(fg, ((W - fg.width) // 2, (H - fg.height) // 2))
    bg.save(dest, "JPEG", quality=82, optimize=True, progressive=True)


products = json.load(open(os.path.join(ROOT, "public/seed/catalog.json")))["products"]
for p in products:
    if p["images"] and p["images"][0]["url"].startswith("/catalogue/"):
        card(os.path.join(ROOT, "public" + p["images"][0]["url"]), os.path.join(OUT, f"{p['slug']}.jpg"))
card(os.path.join(ROOT, "public/catalogue/hero-bridal.webp"), os.path.join(OUT, "default.jpg"))
for f in os.listdir(os.path.join(ROOT, "public/catalogue")):  # collection banners
    if f.startswith(("hero-", "promo-", "showroom")) and f.endswith(".webp"):
        card(os.path.join(ROOT, "public/catalogue", f), os.path.join(OUT, f.replace(".webp", ".jpg")))
made = [f for f in os.listdir(OUT) if f.endswith(".jpg")]
assert len(made) > len(products), (len(made), len(products))
print(f"{len(made)} share images, {sum(os.path.getsize(os.path.join(OUT, f)) for f in made) // 1024} KB total")
