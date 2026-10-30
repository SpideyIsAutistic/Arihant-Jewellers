"use client";

import { useSiteAdmin, useParam } from "@/components/admin/data";
import { PageLoader } from "@/components/ui/PageLoader";
import { useLoad } from "@/lib/use-load";
import { getRawSettings } from "@/lib/settings";
import { DEFAULT_POLICIES, POLICY_PAGES, type PolicySlug } from "@/lib/policies";
import { saveStoreSettings } from "@/lib/actions/admin";
import { Card, Check, Field, PageHeader, TextArea } from "@/components/admin/ui";
import { ActionForm, SubmitButton } from "@/components/admin/client";

export default function SettingsAdmin() {
  const { data: s, error } = useLoad(getRawSettings);
  if (!s) return <PageLoader error={error} />;
  return (
    <>
      <PageHeader title="Settings" />
      <ActionForm action={saveStoreSettings} className="max-w-[920px] space-y-6">
        <Card title="Store details (shown in footer, contact & store pages)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Store name" name="storeName" defaultValue={s.storeName} />
            <Field label="Legal / registered name" name="legalName" defaultValue={s.legalName} hint="Used in copyright and terms." />
            <Field label="Email" name="email" type="email" defaultValue={s.email} />
            <Field label="Phone" name="phone" defaultValue={s.phone} placeholder="+91 …" />
            <Field label="WhatsApp number" name="whatsapp" defaultValue={s.whatsapp} hint="Powers every “Enquire on WhatsApp” button and the floating chat button. Include country code, e.g. 919876543210." />
            <Field label="Web3Forms access key" name="web3formsKey" defaultValue={s.web3formsKey} hint="Enquiry & contact forms are emailed to the address this key was created for (web3forms.com)." />
            <Field label="GSTIN" name="gstin" defaultValue={s.gstin} />
            <TextArea label="Showroom address" name="address" defaultValue={s.address} rows={3} />
            <div className="space-y-4">
              <Field label="Opening hours" name="hours" defaultValue={s.hours} placeholder="Mon–Sat: 10:30 am – 8:00 pm" />
              <Field label="Google Maps link" name="mapUrl" defaultValue={s.mapUrl} placeholder="https://maps.app.goo.gl/…" />
            </div>
            <Field label="Tagline" name="tagline" defaultValue={s.tagline} />
          </div>
        </Card>

        <Card title="Announcements & search">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextArea label="Announcement bar messages (one per line)" name="announcements" defaultValue={s.announcements.join("\n")} rows={4} />
            <TextArea label="Popular searches (one per line)" name="popularSearches" defaultValue={s.popularSearches.join("\n")} rows={4} />
          </div>
        </Card>

        <Card title="Social media">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instagram URL" name="instagram" defaultValue={s.social.instagram} />
            <Field label="Instagram handle" name="instagramHandle" defaultValue={s.instagramHandle} placeholder="arihantjewellers" />
            <Field label="Google Business Profile link" name="googleProfileUrl" defaultValue={s.googleProfileUrl} placeholder="https://maps.app.goo.gl/…" />
            <Field label="Google 'write a review' link" name="googleReviewUrl" defaultValue={s.googleReviewUrl} placeholder="https://g.page/r/…/review" />
            <Field label="Google rating" name="googleRating" defaultValue={s.googleRating} placeholder="4.8" hint="Copy from your Google profile now and then; leave blank to hide the rating." />
            <Field label="Number of Google reviews" name="googleReviewCount" defaultValue={s.googleReviewCount} placeholder="305" />
            <Field label="Facebook URL" name="facebook" defaultValue={s.social.facebook} />
            <Field label="YouTube URL" name="youtube" defaultValue={s.social.youtube} />
            <Field label="X (Twitter) URL" name="x" defaultValue={s.social.x} />
            <Field label="Pinterest URL" name="pinterest" defaultValue={s.social.pinterest} />
          </div>
        </Card>

        <Card title="Trust badges (icon|label, one per line)">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextArea label="Product page & home (first 4 used on product page)" name="trustBadges" defaultValue={s.trustBadges.map((t) => `${t.icon}|${t.label}`).join("\n")} rows={5} mono />
            <TextArea label="Home — service badges" name="serviceBadges" defaultValue={s.serviceBadges.map((t) => `${t.icon}|${t.label}`).join("\n")} rows={5} mono />
          </div>
          <p className="mt-2 text-[12px] text-subtle">Icons: purity, secure, quality, gift, courier, truck, store, support, exchange. Only list claims your business can stand behind.</p>
        </Card>

        <Card title="About">
          <div className="grid gap-4">
            <Field label="Story title" name="aboutTitle" defaultValue={s.aboutTitle} />
            <TextArea label="Short story (home page & top of About page)" name="aboutText" defaultValue={s.aboutText} rows={3} />
            <TextArea label="About page body" name="aboutPage" defaultValue={s.aboutPage} rows={10} hint="Formatting: '## ' for headings, '- ' for bullet points, blank line between paragraphs." />
          </div>
        </Card>

        <Card title="FAQs">
          <TextArea
            label="Questions & answers"
            name="faqs"
            defaultValue={s.faqs.map((f) => `${f.q}\n${f.a}`).join("\n\n")}
            rows={14}
            hint="First line = question, following line(s) = answer. Leave a blank line between FAQs. "
          />
        </Card>

        <div id="policies">
          <Card title="Policies — please review with your legal adviser">
            <div className="space-y-5">
              {(Object.keys(POLICY_PAGES) as PolicySlug[]).map((k) => (
                <TextArea
                  key={k}
                  label={POLICY_PAGES[k]}
                  name={`policy_${k}`}
                  defaultValue={s.policies?.[k] || DEFAULT_POLICIES[k]}
                  rows={10}
                  hint="Tokens: {contact} {legalName}"
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky bottom-0 -mx-1 border-t border-line bg-[#f6f4f0] px-1 py-3">
          <SubmitButton>Save settings</SubmitButton>
        </div>
      </ActionForm>
    </>
  );
}
