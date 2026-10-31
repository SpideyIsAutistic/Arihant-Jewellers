import type { StoreSettings } from "./settings";
import { absoluteUrl } from "./utils";

/** JewelryStore structured data for Google (home + showroom pages). Hours and pin match the Google Business Profile. */
export function storeJsonLd(s: StoreSettings, path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: s.storeName,
    image: absoluteUrl("/catalogue/showroom.webp"),
    url: absoluteUrl(path),
    telephone: s.phone || undefined,
    email: s.email || undefined,
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop no. 8-G, Vijay Apartment, Phase 3, Ghodbunder Road, beside Bank of Baroda, Waghbil Naka",
      addressLocality: "Thane West",
      addressRegion: "Maharashtra",
      postalCode: "400615",
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: 19.2543949, longitude: 72.9729153 },
    hasMap: s.googleProfileUrl || s.mapUrl || undefined,
    openingHoursSpecification: [
      ["10:00", "14:00"],
      ["17:00", "21:30"],
    ].map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens,
      closes,
    })),
    sameAs: [s.social?.instagram, s.social?.facebook, s.social?.youtube, s.googleProfileUrl].filter(Boolean),
  };
}
