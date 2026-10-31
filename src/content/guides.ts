/** Gemstone buying guides (/guides/<slug>). `stone` matches the product's Stone field to list pieces in stock. */
export type Guide = {
  slug: string;
  title: string; // page title (site name is added)
  name: string; // e.g. "Panna (Emerald)"
  stone: string[];
  description: string; // <=155 chars, for search results
  intro: string;
  sections: { h: string; p: string[] }[];
  faqs: { q: string; a: string }[];
};

const CERT =
  "Ask for a report from an independent gem laboratory. It confirms the stone is natural, states its weight in carats and lists any treatment. We can arrange testing for any stone you choose from us.";
const RATTI = "In India stones are often weighed in ratti: one ratti is roughly 0.9 carat, so a 5-ratti stone is about 4.5 carats.";
const ASTRO =
  "These are traditional beliefs, not proven effects. Many families consult their own astrologer for the stone, weight, finger and day to wear it; we are happy to work to their advice.";

export const GUIDES: Guide[] = [
  {
    slug: "panna-emerald",
    title: "Panna (Emerald) Buying Guide",
    name: "Panna (Emerald)",
    stone: ["Emerald"],
    description: "How to choose a natural Panna (emerald): colour, clarity, oiling, certificates, ratti weight and how it is traditionally worn. Arihant Jewellers, Thane.",
    intro:
      "Panna is the Hindi name for emerald, the green variety of the mineral beryl. It is valued above all for its colour, and almost every natural emerald has small inclusions, so a perfectly clear stone at a low price deserves a second look.",
    sections: [
      {
        h: "Colour comes first",
        p: [
          "The most prized emeralds are a vivid, slightly bluish green that is neither too dark nor too pale. Very dark stones can look black indoors; very light ones are closer to green beryl. Look at the stone in daylight and under shop lights, because the colour shifts.",
        ],
      },
      {
        h: "Clarity and inclusions",
        p: [
          "Inclusions in emerald are called jardin (garden). Some are expected; what matters is that they do not reach the surface as cracks or make the stone look cloudy. Emerald is 7.5–8 on the hardness scale but brittle, so avoid stones with surface-reaching fissures for an everyday ring.",
          "The rectangular emerald cut with cut corners was developed for this stone because it protects the corners and shows the colour well.",
        ],
      },
      {
        h: "Oiling, treatment and certificates",
        p: [
          "Most emeralds are treated with oil or resin to fill fine fissures; this is standard in the trade. What you should know is the degree: minor, moderate or significant. " + CERT,
          RATTI,
        ],
      },
      {
        h: "How Panna is traditionally worn",
        p: [
          "In Vedic astrology Panna is the stone of Budh (Mercury) and is traditionally set in gold and worn on the little finger, often first put on on a Wednesday. " + ASTRO,
        ],
      },
      {
        h: "Care",
        p: [
          "Clean with lukewarm water and a soft brush. Avoid ultrasonic cleaners, steam and hot water, which can remove the oil and make fissures show. Take the ring off for heavy work.",
        ],
      },
    ],
    faqs: [
      { q: "Is a natural emerald always included?", a: "Almost always. Small inclusions (jardin) are normal and help show the stone is natural. Avoid cracks that reach the surface." },
      { q: "Should I buy an oiled emerald?", a: "Most emeralds are oiled, which is accepted in the trade. Ask for a lab report that states how much treatment the stone has had." },
      { q: "What weight Panna should I buy?", a: "That depends on your budget and, if you follow astrology, your astrologer's advice. Many people choose 3 to 7 ratti (about 2.7 to 6.4 carats)." },
    ],
  },
  {
    slug: "pukhraj-yellow-sapphire",
    title: "Pukhraj (Yellow Sapphire) Buying Guide",
    name: "Pukhraj (Yellow Sapphire)",
    stone: ["Yellow Sapphire"],
    description: "How to choose a natural Pukhraj (yellow sapphire): colour, clarity, heated vs unheated, certificates and how it is worn. Arihant Jewellers, Thane.",
    intro:
      "Pukhraj is yellow sapphire, a variety of the mineral corundum. At 9 on the hardness scale it is tough enough for a ring worn every day, and it is one of the most requested stones in Indian families.",
    sections: [
      {
        h: "Colour",
        p: [
          "Look for an even, bright canary or golden yellow without brown or green tints. Paler lemon stones cost less; strong, saturated yellow costs more. Colour should look the same across the stone, without patches.",
        ],
      },
      {
        h: "Clarity and cut",
        p: [
          "Good yellow sapphires are often eye-clean, meaning no inclusions are visible without magnification. Oval and cushion cuts are the most common because they keep the most weight from the rough. A well-cut stone sparkles evenly and has no dark 'window' in the middle.",
        ],
      },
      {
        h: "Heated or unheated",
        p: [
          "Many sapphires are gently heated to improve colour; this is permanent and widely accepted. Unheated stones with fine colour are rarer and priced higher. Beware of yellow topaz or citrine sold as Pukhraj; they look similar but are different minerals. " + CERT,
          RATTI,
        ],
      },
      {
        h: "How Pukhraj is traditionally worn",
        p: [
          "Pukhraj is linked with Guru (Jupiter) and is traditionally set in gold and worn on the index finger, often first worn on a Thursday. " + ASTRO,
        ],
      },
      {
        h: "Care",
        p: ["Sapphire is very durable. Clean it with warm soapy water and a soft brush, and store it apart from diamonds, which can scratch it."],
      },
    ],
    faqs: [
      { q: "Is heated Pukhraj natural?", a: "Yes. Heating only improves the colour of a natural sapphire and is permanent. The lab report will say whether the stone is heated or unheated." },
      { q: "How can I tell Pukhraj from yellow topaz?", a: "Not reliably by eye. A gem lab tests the stone's properties; ask for a report before buying an expensive stone." },
      { q: "Which metal is used for Pukhraj?", a: "It is traditionally set in yellow gold, though it can be set in any metal you prefer." },
    ],
  },
  {
    slug: "neelam-blue-sapphire",
    title: "Neelam (Blue Sapphire) Buying Guide",
    name: "Neelam (Blue Sapphire)",
    stone: ["Blue Sapphire", "Sapphire"],
    description: "How to choose a natural Neelam (blue sapphire): colour, clarity, treatments, certificates and the tradition of trying it first. Arihant Jewellers.",
    intro:
      "Neelam is blue sapphire, the best-known colour of corundum. It is hard (9 on the hardness scale), durable and comes in every shade from pale sky blue to deep royal blue.",
    sections: [
      {
        h: "Colour",
        p: [
          "The most valued colour is a rich, velvety medium-to-deep blue. Very dark stones can look inky indoors; pale ones are lighter in price. Some sapphires show colour zoning, bands of lighter and darker blue, which is easier to see from the side.",
        ],
      },
      {
        h: "Clarity and cut",
        p: [
          "Fine silk-like needles are common in natural sapphire and can soften the colour. Avoid stones with visible cracks. Oval and cushion shapes are most common; a good cut shows bright blue across the face without dull patches.",
        ],
      },
      {
        h: "Treatments and certificates",
        p: [
          "Heating is widely used to improve colour and is accepted. Other treatments, such as diffusion or glass filling, change the value a lot and must be disclosed. " + CERT,
          RATTI,
        ],
      },
      {
        h: "How Neelam is traditionally worn",
        p: [
          "Neelam is linked with Shani (Saturn). Tradition treats it as a strong stone: many people wear it on a trial basis for a few days before setting it, and wear it on the middle finger, often first on a Saturday. " + ASTRO,
        ],
      },
      {
        h: "Care",
        p: ["Clean with warm soapy water and a soft brush. Store separately so it doesn't scratch softer stones or get scratched by diamonds."],
      },
    ],
    faqs: [
      { q: "Can I try a Neelam before buying?", a: "Ask our team about seeing and trying the stone at the showroom before it is set." },
      { q: "Is a light blue sapphire still Neelam?", a: "Yes, it is still blue sapphire. Lighter stones are usually more affordable; your astrologer may have a preference." },
      { q: "What does 'unheated' mean on a report?", a: "The lab found no sign of heat treatment. Unheated stones with fine colour are rarer and priced higher." },
    ],
  },
  {
    slug: "manik-ruby",
    title: "Manik (Ruby) Buying Guide",
    name: "Manik (Ruby)",
    stone: ["Ruby"],
    description: "How to choose a natural Manik (ruby): colour, clarity, heating vs glass filling, certificates and how it is traditionally worn. Arihant Jewellers, Thane.",
    intro:
      "Manik is ruby, the red variety of corundum (the same mineral as sapphire). It is hard and durable, and its value rests mainly on the strength and purity of its red.",
    sections: [
      {
        h: "Colour",
        p: [
          "The most valued rubies are a strong, pure red to slightly purplish red. Pinker stones may be sold as pink sapphire or pink ruby; brownish or orange tones lower the price. Look at it in daylight and warm light.",
        ],
      },
      {
        h: "Clarity and cut",
        p: [
          "Small inclusions are normal in ruby. A completely clean, bright red stone at a low price may be synthetic or heavily treated. Ovals and cushions are most common, and a good cut shows red across the face without a washed-out centre.",
        ],
      },
      {
        h: "Heated, glass-filled and certificates",
        p: [
          "Heating is common and accepted. Glass-filled (composite) rubies are much cheaper materials that can be damaged by heat or chemicals; they must be sold as such. " + CERT,
          RATTI,
        ],
      },
      {
        h: "How Manik is traditionally worn",
        p: ["Manik is linked with Surya (the Sun) and is traditionally set in gold or copper and worn on the ring finger, often first on a Sunday. " + ASTRO],
      },
      {
        h: "Care",
        p: ["Warm soapy water and a soft brush are enough. If a ruby is glass-filled, avoid jewellers' torches, steam and ultrasonic cleaners."],
      },
    ],
    faqs: [
      { q: "What is a glass-filled ruby?", a: "Low-grade ruby whose fractures are filled with lead glass to look clearer. It costs far less than natural ruby and needs gentle care. A lab report will say if a stone is glass-filled." },
      { q: "Is pink ruby the same as ruby?", a: "Both are corundum; the line between pink sapphire and ruby depends on how strong the red is. The lab report names the stone." },
      { q: "Which finger is Manik worn on?", a: "Traditionally the ring finger of the working hand, but follow your astrologer's advice." },
    ],
  },
  {
    slug: "gomed-hessonite",
    title: "Gomed (Hessonite) Buying Guide",
    name: "Gomed (Hessonite)",
    stone: ["Hessonite"],
    description: "How to choose a natural Gomed (hessonite garnet): colour, clarity, origin, certificates and how it is traditionally worn. Arihant Jewellers, Thane.",
    intro:
      "Gomed is hessonite, an orange-brown variety of grossular garnet. It is more affordable than the precious stones, reasonably hard (about 7–7.5) and known for its warm honey-to-cinnamon colour.",
    sections: [
      {
        h: "Colour",
        p: [
          "Good Gomed is a clear honey, cinnamon or cola-brown with life and glow. Very dark stones can look dull; very light ones look washed out. The colour should be even across the stone.",
        ],
      },
      {
        h: "Clarity",
        p: [
          "Hessonite often shows a swirly, 'treacle-like' look inside caused by tiny crystals; mild swirling is normal and is a sign of a natural stone. Avoid cracks and heavy cloudiness.",
        ],
      },
      {
        h: "Certificates",
        p: ["Gomed is rarely treated, but glass imitations exist. " + CERT, RATTI],
      },
      {
        h: "How Gomed is traditionally worn",
        p: ["Gomed is linked with Rahu and is traditionally set in silver or panchdhatu and worn on the middle finger, often first on a Saturday. " + ASTRO],
      },
      {
        h: "Care",
        p: ["Clean with warm soapy water. Avoid knocks against hard surfaces and sudden temperature changes."],
      },
    ],
    faqs: [
      { q: "Is Gomed a precious stone?", a: "It is a semi-precious garnet, which makes good-sized stones affordable." },
      { q: "Are inclusions in Gomed a problem?", a: "Mild swirls are typical of natural hessonite. Avoid stones with cracks or heavy cloudiness." },
      { q: "What weight of Gomed do people choose?", a: "Often 5 to 9 ratti (about 4.5 to 8 carats), but follow your budget and your astrologer's advice." },
    ],
  },
];
