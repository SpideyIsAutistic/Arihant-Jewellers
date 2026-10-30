"""Writes a unique description + search description (<=155 chars) for every product.

Updates public/seed/catalog.json and scripts/catalogue.json. The admin dashboard's
"Apply updated product descriptions" card copies them into the live store
(only for products whose description is still the original template).
Usage: python3 scripts/product-copy.py
"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# One design note per piece, written from its photos: what makes it different from its neighbours.
NOTE = {
    "p001": "a chevron of pavé diamonds that dips to a single emerald drop",
    "p002": "a twisted band that wraps around a pear-shaped diamond cluster",
    "p003": "an open heart outlined in diamonds on a fine rose-gold band",
    "p004": "a wishbone curve lined with diamonds, made to sit flush with a second band",
    "p005": "a yellow-gold band with a carved leaf motif and a diamond accent",
    "p006": "two diamond chevrons stacked into one ring for a bold V on the finger",
    "p007": "emeralds fanned out like a fern frond and framed with diamonds",
    "p008": "a ruby halo ring and an emerald cluster ring, a pair that can be worn together",
    "p009": "a bypass design where a ruby and an emerald meet across a diamond-set shank",
    "p010": "a flowing wave line of diamonds that follows the curve of the finger",
    "p011": "a sharp pointed V in pavé diamonds that elongates the hand",
    "p012": "an openwork cage of diamond-set bars, wide enough to wear on its own",
    "p013": "three rose-gold chevrons set with diamonds in a layered V",
    "p014": "an emerald centre ringed with diamond petals in a flower cocktail design",
    "p015": "an emerald set high in a tiered diamond tower setting",
    "p016": "a yellow-gold swirl that curls around a single diamond",
    "p017": "a slim open V in gold with a small diamond at the point",
    "p018": "a men's ring with a square panel of diamonds and engraved shoulders",
    "p019": "a men's ring with a pavé diamond panel on a solid gold shank",
    "p020": "a men's signet with a black onyx face and a diamond line",
    "p021": "a gold ring made of interlocking links",
    "p022": "a rose-gold band with a raised panel of diamonds",
    "p023": "a men's band with six diamonds set in a brushed-gold panel",
    "p024": "a men's ring with several rows of diamonds across a wide face",
    "p025": "two open diamond arcs that frame the finger",
    "p026": "an open geometric outline traced in diamonds",
    "p027": "a rose-gold arch set with diamonds over an open band",
    "p028": "a men's ring with diamonds set in a neat grid",
    "p029": "a textured band with a strip of diamonds across the top",
    "p030": "a two-tone band with a white-gold diamond panel on yellow gold",
    "p031": "a men's ring with chain-link sides and a diamond centre",
    "p032": "a rose-gold band with a single solitaire diamond",
    "p033": "a slim band with a single solitaire diamond, easy to stack",
    "p034": "a two-tone eternity band with diamonds all the way round",
    "p035": "a classic band in two tones of gold, a simple wedding ring",
    "p036": "a rectangular emerald-cut Panna with lively green colour",
    "p037": "a deep green emerald-cut Panna with rich saturation",
    "p038": "an oval Pukhraj with warm golden-yellow colour",
    "p039": "an oval white sapphire, clear and bright",
    "p040": "an oval Manik with a strong red tone",
    "p041": "a pink ruby in an emerald (step) cut",
    "p042": "an oval Neelam with a clear blue tone",
    "p043": "a light blue sapphire with a soft, pale colour",
    "p044": "a cushion-cut Pukhraj with soft yellow colour",
    "p045": "an oval Gomed with a honey-brown glow",
    "p046": "an emerald-cut Gomed with deep cinnamon colour",
    "p047": "eight silver Lakshmi idols on a carved silver stand for the home temple",
    "p048": "a diamond pendant with matching earrings",
    "p049": "a gold choker with matching earrings",
    "p050": "a long gold necklace strung with coin motifs",
    "p051": "a gold necklace with a fringe of discs and a fan-shaped temple pendant",
    "p053": "a gold Ganesha pendant with fine detailing",
    "p055": "gold leaves with diamond accents along the neckline",
    "p056": "a gold necklace with drop details and matching earrings",
    "p057": "a gold saree pin to hold the pallu in place",
    "p058": "a gold necklace of layered fan-shaped panels",
    "p059": "a gold pendant shaped like a leaf",
    "p060": "a rose-gold necklace with a curved diamond line and matching earrings",
    "p061": "a diamond necklace with a teardrop centre and matching earrings",
    "p062": "diamond drop earrings that move as you walk",
    "p063": "a diamond necklace made of linked open shapes",
    "p064": "an emerald drop on a diamond pendant, with matching earrings",
    "p065": "a diamond collar necklace that sits close to the neck",
    "p066": "a gold necklace with jhumka drops and matching jhumka earrings",
    "p067": "a wide gold bridal choker with a flower centre and a drop",
    "p068": "a mangalsutra with a large gold pendant on black-bead strands",
    "p069": "a gold bridal choker with arched panels and small drops",
    "p070": "a kundan-style gold bridal necklace with layered drops",
    "p071": "a mangalsutra with a peacock-motif gold pendant",
    "p072": "a classic mangalsutra with a fan-shaped gold pendant",
    "p073": "a long mangalsutra with a gold pendant at the end",
    "p074": "a mangalsutra with a stone-set gold pendant",
    "p075": "a mangalsutra with a ruby drop",
    "p076": "a mangalsutra with a small gold pendant on a gold-and-bead chain",
    "p077": "a mangalsutra with a square temple-style gold pendant",
    "p078": "a mangalsutra with two black-bead strands and gold spacers",
    "p079": "a mangalsutra with a polki-style stone-set pendant",
    "p080": "a mangalsutra with a round gold medallion",
    "p081": "a mangalsutra with a gold leaf pendant",
    "p082": "a mangalsutra with two gold drops",
    "p083": "a mangalsutra with an emerald drop",
    "p084": "a mangalsutra with a stone-set teardrop pendant",
    "p085": "a fine gold chain of small beads with a drop pendant",
    "p087": "a black-bead chain with a gold pendant",
    "p088": "a gold chain with bead drops",
    "p089": "a beaded gold chain with a pendant at the centre",
    "p090": "a gold chain with small charms along it",
    "p091": "a black-bead mangalsutra with gold charms",
    "p092": "a gold necklace of round beads",
    "p093": "a thick gold rope chain",
    "p094": "a twisted gold rope chain with a strong sheen",
    "p095": "a heavy gold chain of braided links",
    "p097": "a gold curb chain with flat interlocking links",
    "p098": "a gold chain of graduated ball beads",
    "p099": "a gold chain with bead stations along its length",
    "p100": "a fine gold chain of small balls",
    "p101": "a layered gold chain with several strands",
    "p102": "a gold chain with three strands",
    "p103": "a gold chain with barrel-shaped beads",
    "p104": "a fine gold box chain",
    "p105": "a gold wheat chain with a woven look",
    "p106": "a long, fine gold chain",
    "p107": "a smooth gold snake chain",
    "p108": "a flat gold snake chain that lies flat on the skin",
    "p109": "a gold herringbone chain",
    "p110": "a wide gold herringbone chain",
}

WEAR = {"bridal": "for the bride", "wedding": "for weddings", "festive": "for festivals", "everyday": "for everyday wear",
        "gift": "as a gift", "self": "to treat yourself", "her": "for her"}
CAT = {"gemstones": "gemstone", "silver-articles": "silver article", "necklace-sets": "necklace set", "mangalsutra": "mangalsutra",
       "chains": "gold chain", "rings": "ring", "necklaces": "necklace", "pendants": "pendant", "earrings": "earrings", "brooches": "brooch"}


def copy(p):
    note = NOTE[p["id"]]
    tags = [t for t in p["tags"].split(",") if t in WEAR]
    wear = " and ".join(WEAR[t] for t in tags[:2])
    material = "18K gold" if (p.get("purity") or "").startswith("18K") else ("silver" if p["categoryId"] == "silver-articles" else "gold")
    if p["categoryId"] == "gemstones":
        desc = (f"{p['name']}: {note}. A loose natural gemstone from Arihant Jewellers, Thane, ready to be set in a ring or pendant. "
                f"Ask us for the weight in carats, certification and setting options, or see the stone in person at our showroom.")
        seo = f"{p['name']}: {note}. Loose natural gemstone at Arihant Jewellers, Thane. Ask for carat weight and certificate."
    else:
        stones = " and ".join(x.strip().lower() for x in p["stone"].split(",")) if p.get("stone") else ""
        made = "" if material.lower() in note.lower() and not stones else f" Made in {material}{' with ' + stones if stones else ''}."
        kind = CAT[p["categoryId"]].replace("gold ", "")
        see = "see it in person" if p["categoryId"] in ("silver-articles", "brooches") else "try it on"
        desc = (f"{p['name']}: {note}.{made} "
                f"{('A good choice ' + wear + '. ') if wear else ''}"
                f"Message us on WhatsApp for today's price and weight, or visit our showroom in Thane to {see}.")
        seo = f"{p['name']}: {note}. {material[0].upper() + material[1:]} {kind} from Arihant Jewellers, Thane."
    if len(seo) > 155:  # keep the note, drop the tail
        seo = f"{p['name']}: {note}. Arihant Jewellers, Thane."
    if len(seo) > 155:
        seo = seo[:152].rsplit(" ", 1)[0] + "…"
    return desc, seo


for rel in ("public/seed/catalog.json", "scripts/catalogue.json"):
    path = os.path.join(ROOT, rel)
    data = json.load(open(path))
    for p in data["products"]:
        p["description"], p["seoDescription"] = copy(p)
    json.dump(data, open(path, "w"), ensure_ascii=False)

seos = [p["seoDescription"] for p in data["products"]]
assert len(seos) == len(set(seos)), "search descriptions must be unique"
assert all(len(s) <= 155 for s in seos), max(seos, key=len)
assert set(NOTE) == {p["id"] for p in data["products"]}, "every product needs a note"
print(f"{len(seos)} products; search descriptions {min(map(len, seos))}-{max(map(len, seos))} chars, all unique")
