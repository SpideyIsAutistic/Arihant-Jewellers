"""Wide desktop banners for the home page service slides (public/catalogue/banner-*.webp).
The pieces sit on the right over a soft blurred, darkened background so the slide text reads on the left.
Usage: python3 scripts/service-banners.py
"""
import os
from PIL import Image, ImageFilter, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAT = os.path.join(ROOT, "public/catalogue")

BANNERS = {  # name: (size, [photos placed right-to-left])
    "banner-dhanteras": ((2400, 934), ["ashtalakshmi-silver-idol-set-on-carved-stand-1"]),
    "banner-gold-exchange": ((2400, 1057), ["gold-bridal-choker-1"]),
    "banner-savings-scheme": ((2400, 1057), ["gold-jhumka-necklace-set-1"]),
    "banner-custom-design": ((2400, 1057), ["emerald-floral-cocktail-ring-1"]),
}


def make(name, size, photos):
    W, H = size
    first = Image.open(os.path.join(CAT, photos[0] + ".webp")).convert("RGB")
    r = max(W / first.width, H / first.height)
    bg = first.resize((round(first.width * r), round(first.height * r)), Image.LANCZOS)
    bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
    bg = ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(40))).enhance(0.32)
    x = W
    for p in photos:
        im = Image.open(os.path.join(CAT, p + ".webp")).convert("RGB")
        im.thumbnail((int(W * 0.6 / len(photos)), H), Image.LANCZOS)  # photos take at most the right 60%
        x -= im.width
        # fade the photo's left edge into the background instead of a hard seam
        fade = max(1, im.width // 4)
        mask = Image.new("L", im.size, 255)
        for i in range(fade):
            mask.paste(int(255 * i / fade), (i, 0, i + 1, im.height))
        bg.paste(im, (x, (H - im.height) // 2), mask)
    assert x >= W * 0.4 - 1, f"{name}: photos leave too little room for text"
    bg.save(os.path.join(CAT, name + ".webp"), "WEBP", quality=82)
    sm = bg.copy()
    sm.thumbnail((640, 640))
    sm.save(os.path.join(CAT, "sm", name + ".webp"), "WEBP", quality=80)


for name, (size, photos) in BANNERS.items():
    make(name, size, photos)
print("made", ", ".join(BANNERS))
