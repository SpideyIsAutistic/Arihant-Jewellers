import type { StoreSettings } from "./settings";

export const POLICY_PAGES = {
  "shipping-policy": "Shipping Policy",
  "refund-policy": "Returns, Exchanges & Buy-Back",
  "privacy-policy": "Privacy Policy",
  "terms-of-service": "Terms of Service",
} as const;
export type PolicySlug = keyof typeof POLICY_PAGES;

/**
 * Standard statutory policy templates for Arihant Jewellers complying with:
 *  - Consumer Protection Act, 2019
 *  - Consumer Protection (E-Commerce) Rules, 2020
 *  - Bureau of Indian Standards (BIS) Hallmarking Regulations
 *  - Digital Personal Data Protection (DPDP) Act, 2023 & IT Act, 2000
 * Tokens in {braces} are populated dynamically from store settings.
 */
export const DEFAULT_POLICIES: Record<PolicySlug, string> = {
  "shipping-policy": `## Showroom Consultation & Secure Handover
Arihant Jewellers operates primarily as an online fine jewellery showcase and interactive catalogue. To ensure the highest level of security, authenticity verification, and personalized service for high-value gold and diamond creations, transactions are completed directly with our team at our Thane showroom or via personalized consultation.

## Showroom Collection
You are cordially invited to view, inspect, and take handover of your selected jewellery piece at our Thane showroom:
- **Location:** Beside Bank of Baroda Waghbill, Shop no. 8-G, Vijay Apt, Phase-3 Ghodbunder Road, Waghbil Naka Flyover, Thane West, Thane, Maharashtra 400615
- **Hours:** Mon – Sun: 10:00 AM – 2:00 PM, 5:00 PM – 9:30 PM

## Insured Delivery by Prior Arrangement
If you reside outside Thane / Mumbai or are unable to visit our showroom in person, personalized insured delivery may be arranged upon request:
- **Arrangement:** Enquire via WhatsApp or phone with our customer care desk.
- **Security:** High-value bullion and jewellery shipments are securely packaged, sealed with tamper-evident indicators, and dispatched through specialized insured courier services.
- **Transit Time:** In-stock creations typically dispatch within 2 business days following full verification. Custom and made-to-order creations follow the bespoke timeline agreed upon during consultation.
- **Handover Requirement:** Government-issued photo identification (such as Aadhaar, PAN card, or Passport) matching the invoice name may be required upon physical delivery.

## Questions & Enquiries
For assistance or delivery queries, contact us at {contact}.`,

  "refund-policy": `## Transparency & Jewellery Invoicing
Every jewellery piece purchased from Arihant Jewellers is accompanied by an itemized tax invoice detailing gross weight, net metal weight, metal purity, stone/diamond carat weight, making charges, current gold rate, and applicable 3% GST.

## Inspection & Acceptance
Because jewellery pieces are high-value precious commodities handcrafted in gold and silver, we encourage thorough personal inspection at our showroom before final handover.

## Exchange & Lifetime Buy-Back
In line with Indian retail jewellery maison standards:
- **Exchange:** Pieces may be exchanged at prevailing market bullion rates for another design in accordance with the terms specified on your original tax invoice.
- **Old Gold & Lifetime Buy-Back:** We offer transparent testing and valuation for hallmarked gold jewellery based on the net gold content calculated against the day's live market rate.
- **Custom / Bespoke Pieces:** Jewellery handcrafted to customized dimensions, engraved items, or custom-sourced gemstone settings are crafted specifically for you and are governed by individual bespoke agreements made at order booking.

## Inquiries & Assistance
For any questions regarding an exchange, valuation, or your invoice, contact us with your invoice number at {contact}.`,

  "privacy-policy": `## 1. Introduction & Data Fiduciary
{legalName} ("we", "us", "our") is dedicated to safeguarding your personal data in accordance with the **Digital Personal Data Protection (DPDP) Act, 2023**, the **Information Technology Act, 2000**, and the **Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011**.

## 2. Personal Information We Collect
We collect personal data only when strictly necessary to provide our services and respond to your requests:
- **Account Sign-In:** When you authenticate via Google Sign-In or email magic link, we receive your verified email address, full name (from Google), and account identifier.
- **Enquiries & Appointments:** Details submitted through our forms (full name, email address, mobile phone/WhatsApp number, reference photos, preferred appointment dates/times, and specific design requests).
- **Wishlist & Preferences:** Saved creations linked to your signed-in account so you can view them across devices.
- **Newsletter:** Email address when you affirmatively subscribe to private viewing invitations and collection announcements.
- **Customer Reviews:** Name, rating, and written review submitted for publication (published only upon editorial approval).

## 3. Lawful Purpose & Usage
Your personal information is processed exclusively to:
- Respond to product enquiries and provide accurate bullion price quotations.
- Coordinate showroom appointments and live video consultation calls.
- Maintain your personal wishlist across browsing sessions.
- Transmit service communications and, if opted in, curated updates regarding new collections.
- Comply with applicable legal, tax, and anti-money laundering regulations governing precious metals.

## 4. Storage & Security
- **Data Hosting:** Customer accounts, wishlists, and enquiries are stored in a secured Google Cloud Firebase database protected by rigorous role-based security rules.
- **Email Forwarding:** Form enquiries are routed securely to our store concierge inbox via Web3Forms over TLS encrypted connections.
- **Data Protection:** We implement reasonable physical, managerial, and technical security safeguards. We do not sell, rent, or trade your personal information to third-party data brokers.

## 5. Analytics & Cookies
With your consent, we utilize Google Analytics (GA4) and Meta Pixel to understand aggregate website traffic and evaluate advertising effectiveness. These analytics providers utilize cookies to record anonymous session metrics (such as page views and general locality). You may accept or decline analytical tracking via our Cookie Consent banner at any time.

## 6. Your Rights Under DPDP Act, 2023
You retain the right to:
- Access a summary of personal data held about you.
- Request correction, updating, or erasure of your personal data.
- Withdraw your consent at any time without affecting prior lawful processing.
- Nominate another individual to exercise your rights in the event of incapacity.

To exercise any of these rights, contact our Grievance Redressal desk at {contact}.

## 7. Statutory Grievance Redressal Officer
In compliance with Rule 5(4) of the Consumer Protection (E-Commerce) Rules, 2020 and Rule 3(2) of the Information Technology Rules, 2021, our designated Grievance Officer is:

- **Grievance Officer:** Compliance Officer, Arihant Jewellers
- **Address:** Beside Bank of Baroda Waghbill, Shop no. 8-G, Vijay Apt, Phase-3 Ghodbunder Road, Waghbil Naka Flyover, Thane West, Thane, Maharashtra 400615, India
- **Email:** {email}
- **Phone:** {phone}
- **Acknowledgement:** Within 48 hours of receipt.
- **Resolution Timeline:** Within 30 days from the date of receipt.`,

  "terms-of-service": `## 1. Terms Overview
This digital storefront is operated by {legalName}. Throughout the site, the terms "we", "us", and "our" refer to Arihant Jewellers. By accessing or browsing our catalogue, you acknowledge and agree to these Terms of Service and all related policies.

## 2. Indicative Pricing & Daily Metal Rates
- **Catalogue Display:** This website serves as a digital showroom catalogue. Displayed prices are indicative and calculated using live daily bullion rates, estimated gross weight, making charges, and applicable 3% Goods and Services Tax (GST).
- **Rate Fluctuation:** Bullion rates for 24K, 22K, 18K, 14K Gold and Fine 999 Silver fluctuate daily in line with prevailing domestic and international bullion markets.
- **Final Quotation:** Final prices, stone weights, making charges, and availability are verified and confirmed on your official tax invoice at our showroom or during direct consultation.
- **Handcrafted Characteristics:** Each fine jewellery piece is individually handcrafted. Minor variations in stone hue, texture, dimensions, and total metal weight (typically within standard trade tolerances) are intrinsic to artisan jewellery crafting.

## 3. BIS Hallmarking & HUID Authenticity
- All gold jewellery offered by Arihant Jewellers is **BIS Hallmarked** in strict compliance with Bureau of Indian Standards regulations.
- Every hallmarked article carries:
  1. The official **BIS Mark** (triangular logo).
  2. The purity/fineness grade: **22K916** (91.6% purity), **18K750** (75.0% purity), or **14K585** (58.5% purity).
  3. A unique 6-digit alphanumeric **Hallmark Unique Identification (HUID)** code laser-engraved onto the piece.
- Consumers may independently verify the authenticity and registration of their jewellery piece using the official Government of India **BIS CARE App** by entering the 6-digit HUID inscribed on the article and tax invoice.

## 4. Consultations & Transactions
Online payments and automated cart checkouts are paused on this website. Enquiries submitted on the site or via WhatsApp constitute requests for private viewing or price quotations and do not form a binding contract of sale until payment is formally completed and an authorized tax invoice is issued by Arihant Jewellers.

## 5. Intellectual Property
All brand names, trademarks, custom photography, jewellery designs, editorial copy, and multimedia assets appearing on this website are the proprietary property of {legalName} and protected under Indian and international copyright and intellectual property legislation.

## 6. Governing Law & Jurisdiction
These terms and all transactions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or claim arising out of or in connection with the website shall be subject to the exclusive jurisdiction of the competent courts in **Thane / Mumbai, Maharashtra**.

## 7. Grievance Redressal & Contact
For statutory compliance or consumer concerns:
- **Email:** {email}
- **Showroom Address:** {address}
- **Postal Code:** 400615, Thane, Maharashtra, India.`,
};

export function fillPolicy(text: string, s: StoreSettings) {
  const rupees = (p: number) => `₹${Math.round(p / 100).toLocaleString("en-IN")}`;
  const contact = [s.email && `email ${s.email}`, s.phone && `call ${s.phone}`].filter(Boolean).join(" or ") || "arihantjewellers2005@gmail.com";
  const email = s.email || "arihantjewellers2005@gmail.com";
  const phone = s.phone || "+91 98200 00000";
  const address = s.address || "Beside Bank of Baroda Waghbill, Shop no.8-G, Vijay Apt, Phase-3 Ghodbunder road, Thane West, Maharashtra 400615";
  const shippingCharges =
    s.freeShippingThreshold > 0
      ? `Shipping is free on orders of ${rupees(s.freeShippingThreshold)} and above. A flat fee of ${rupees(s.shippingFee)} applies to smaller orders.`
      : s.shippingFee > 0
        ? `A flat shipping fee of ${rupees(s.shippingFee)} applies to every order.`
        : "Shipping is free on all orders.";
  const codText = s.codEnabled
    ? `Cash on Delivery is available on orders up to ${rupees(s.codMaxOrder)} at serviceable PIN codes.`
    : "Cash on Delivery is currently not offered; all orders are prepaid.";
  return text
    .replaceAll("{deliveryDaysMin}", String(s.deliveryDaysMin))
    .replaceAll("{deliveryDaysMax}", String(s.deliveryDaysMax))
    .replaceAll("{returnDays}", String(s.returnDays))
    .replaceAll("{shippingCharges}", shippingCharges)
    .replaceAll("{codText}", codText)
    .replaceAll("{contact}", contact)
    .replaceAll("{email}", email)
    .replaceAll("{phone}", phone)
    .replaceAll("{address}", address)
    .replaceAll("{legalName}", s.legalName || "Arihant Jewellers");
}
