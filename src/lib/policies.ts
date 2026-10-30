import type { StoreSettings } from "./settings";

export const POLICY_PAGES = {
  "shipping-policy": "Shipping Policy",
  "refund-policy": "Returns & Refunds",
  "privacy-policy": "Privacy Policy",
  "terms-of-service": "Terms & Conditions",
} as const;
export type PolicySlug = keyof typeof POLICY_PAGES;

/**
 * Default policy templates. The client MUST review these (ideally with legal counsel) and edit them in
 * Admin → Settings → Policies. Tokens in {braces} are filled from store settings.
 */
export const DEFAULT_POLICIES: Record<PolicySlug, string> = {
  "shipping-policy": `## Online ordering is paused
Arihant Jewellers currently works as an online catalogue. We do not take online orders or ship jewellery from this website.

## How to buy
Purchases are completed at our showroom in Thane, or directly with our team after you enquire on WhatsApp or through this website. If you need the piece delivered, ask our team and they will tell you what can be arranged.

## Questions
Contact us at {contact}.`,
  "refund-policy": `## Purchases at our showroom
Because online ordering is paused, all purchases are made at our showroom or with our team directly. The return, exchange and buy-back terms that apply to your piece are explained at the time of purchase and noted on your invoice.

## Questions
For anything about a piece you have bought, contact us at {contact} with your invoice number.`,
  "privacy-policy": `## What we collect
- **Signing in:** if you sign in with Google or with a link emailed to you, we receive your name (Google only), email address and an account ID.
- **Enquiries and appointments:** the details you enter: usually your name, email, phone number, message, and for appointments the date and time you prefer.
- **Wishlist:** when you are signed in, the pieces you save are stored with your account so you can see them on any device.
- **Newsletter:** your email address, if you subscribe.
- **Reviews:** your name, email and review. Only your name and review are published, after we approve them.

## How we use it
Only to answer your enquiry, arrange your visit or video call, help you choose a piece and, if you subscribe, send you news about new arrivals and offers. You can unsubscribe at any time.

## Where it is kept
Your details are stored in our website database (Google Firebase), which only our staff can open. Enquiries and appointment requests are also emailed to our store inbox through our form provider (Web3Forms). We do not sell your personal information or share it with anyone else.

## Storage on your device
Your browser remembers your sign-in, wishlist and recently viewed items. Signing out clears your wishlist from that browser.

## Your choices
You may ask us to access, correct or delete your personal information, including your account, by contacting {contact}.

## Updates
We may update this policy from time to time. The latest version will always be available on this page.`,
  "terms-of-service": `## About these terms
This website is operated by {legalName} to showcase our jewellery collection. By using it you agree to these terms.

## Catalogue & pricing
The website is a catalogue. Prices, where shown, are indicative and inclusive of applicable taxes; gold prices change with the daily metal rate. Final price, availability and weight are confirmed by our team when you enquire or visit the showroom. Jewellery is handcrafted and screens differ, so slight variations in colour, size and finish may occur. Weights shown are approximate.

## Enquiries & purchases
Online ordering and shipping are currently paused. Purchases are completed at our showroom or directly with our team after an enquiry. Appointment requests are confirmed by our team; a booking is not confirmed until we reply.

## Offers
Offers are valid for the stated period, cannot be exchanged for cash and, unless stated otherwise, cannot be combined.

## Contact
{contact}`,
};

export function fillPolicy(text: string, s: StoreSettings) {
  const rupees = (p: number) => `₹${Math.round(p / 100).toLocaleString("en-IN")}`;
  const contact = [s.email && `email ${s.email}`, s.phone && `call ${s.phone}`].filter(Boolean).join(" or ") || "the Contact Us page";
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
    .replaceAll("{legalName}", s.legalName);
}
