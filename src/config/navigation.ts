/**
 * Header / footer navigation. Links point at categories (/collections/<category-slug>) or curated
 * collections (/collections/<collection-slug>); query strings pre-apply filters.
 * Edit this file to change the menu.
 */
const C = (slug: string) => `/catalogue/${slug}.webp`;

export type NavLink = { label: string; href: string };
export type NavPromo = { label: string; href: string; image: string };
export type NavItem = { label: string; href: string; links?: NavLink[]; promos?: NavPromo[] };

export const MAIN_NAV: NavItem[] = [
  {
    label: "Gold",
    href: "/collections/gold-jewellery",
    links: [
      { label: "All Gold", href: "/collections/gold-jewellery" },
      { label: "Necklaces", href: "/collections/necklaces" },
      { label: "Necklace Sets", href: "/collections/necklace-sets" },
      { label: "Mangalsutra", href: "/collections/mangalsutra" },
      { label: "Gold Chains", href: "/collections/chains" },
      { label: "Pendants", href: "/collections/pendants" },
      { label: "Brooches & Pins", href: "/collections/brooches" },
    ],
    promos: [
      { label: "Bridal Necklaces", href: "/collections/bridal", image: C("gold-kundan-style-bridal-necklace-1") },
      { label: "Mangalsutra", href: "/collections/mangalsutra", image: C("classic-gold-mangalsutra-1") },
    ],
  },
  {
    label: "Diamonds",
    href: "/collections/diamond-jewellery",
    links: [
      { label: "All Diamond Jewellery", href: "/collections/diamond-jewellery" },
      { label: "Diamond Rings", href: "/collections/rings" },
      { label: "Diamond Necklace Sets", href: "/collections/necklace-sets?q=diamond" },
      { label: "Earrings", href: "/collections/earrings" },
      { label: "Men's Rings", href: "/collections/rings?gender=Men" },
    ],
    promos: [
      { label: "Cocktail Rings", href: "/collections/rings", image: C("emerald-floral-cocktail-ring-2") },
      { label: "Diamond Sets", href: "/collections/necklace-sets", image: C("rose-gold-diamond-necklace-set-1") },
    ],
  },
  {
    label: "Rings",
    href: "/collections/rings",
    links: [
      { label: "All Rings", href: "/collections/rings" },
      { label: "Women's Rings", href: "/collections/rings?gender=Women" },
      { label: "Men's Rings", href: "/collections/rings?gender=Men" },
      { label: "Bands", href: "/collections/rings?q=band" },
      { label: "Bridal Rings", href: "/collections/wedding" },
    ],
    promos: [
      { label: "Statement Rings", href: "/collections/rings", image: C("emerald-fern-cocktail-ring-1") },
      { label: "Men's Rings", href: "/collections/rings?gender=Men", image: C("mens-onyx-and-diamond-signet-ring-2") },
    ],
  },
  {
    label: "Gemstones",
    href: "/collections/gemstones",
    links: [
      { label: "All Gemstones", href: "/collections/gemstones" },
      { label: "Emerald (Panna)", href: "/collections/gemstones?q=emerald" },
      { label: "Ruby (Manik)", href: "/collections/gemstones?q=ruby" },
      { label: "Sapphire (Pukhraj / Neelam)", href: "/collections/gemstones?q=sapphire" },
      { label: "Hessonite (Gomed)", href: "/collections/gemstones?q=hessonite" },
    ],
    promos: [
      { label: "Emerald", href: "/collections/gemstones?q=emerald", image: C("emerald-panna-emerald-cut-1") },
      { label: "Yellow Sapphire", href: "/collections/gemstones?q=sapphire", image: C("yellow-sapphire-pukhraj-cushion-1") },
    ],
  },
  { label: "Silver", href: "/collections/silver-articles" },
  { label: "Bridal", href: "/collections/bridal" },
  {
    label: "Collections",
    href: "/collections/all",
    links: [
      { label: "Shop All", href: "/collections/all" },
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Bestsellers", href: "/collections/bestsellers" },
      { label: "Festive", href: "/collections/festive" },
      { label: "Wedding", href: "/collections/wedding" },
      { label: "Everyday", href: "/collections/everyday" },
      { label: "Gift Store", href: "/collections/gift-store" },
    ],
    promos: [
      { label: "Festive", href: "/collections/festive", image: C("gold-jhumka-necklace-set-1") },
      { label: "Gifts", href: "/collections/gift-store", image: C("ashtalakshmi-silver-idol-set-on-carved-stand-1") },
    ],
  },
];

export const FOOTER_NAV = {
  about: [
    { label: "About Us", href: "/pages/about" },
    { label: "Contact Us", href: "/pages/contact" },
    { label: "Our Showroom", href: "/pages/store" },
    { label: "FAQs", href: "/pages/faq" },
    { label: "Book a Visit", href: "/pages/book-appointment" },
    { label: "Gold Rate Today", href: "/gold-rate-today" },
    { label: "Gemstone Guides", href: "/guides" },
    { label: "Ring Size Guide", href: "/pages/ring-size-guide" },
  ],
  shop: [
    { label: "Gold Jewellery", href: "/collections/gold-jewellery" },
    { label: "Diamond Jewellery", href: "/collections/diamond-jewellery" },
    { label: "Gemstones", href: "/collections/gemstones" },
    { label: "Bridal", href: "/collections/bridal" },
    { label: "Gift Store", href: "/collections/gift-store" },
    { label: "New Arrivals", href: "/collections/new-arrivals" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/policies/privacy-policy" },
    { label: "Terms & Conditions", href: "/policies/terms-of-service" },
  ],
};
