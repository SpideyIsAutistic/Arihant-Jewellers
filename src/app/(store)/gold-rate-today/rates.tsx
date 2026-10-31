"use client";

import { getMetalRates, ratesAgeHours } from "@/lib/gold-rates";
import { useLoad } from "@/lib/use-load";

const KEYS = ["gold24k", "gold22k", "gold18k", "silver"] as const;

/** Table wording per language (Hindi/Marathi pages reuse the same table). */
export const RATE_TEXT = {
  en: {
    rows: ["24K gold (999)", "22K gold (916)", "18K gold (750)", "Silver (999)"],
    head: ["Metal", "1 gram", "10 grams"],
    kg: "kg",
    error: "Couldn't load today's rates. Please message us on WhatsApp.",
    notPosted: "Today's rates haven't been posted yet. Message us on WhatsApp or call the showroom for today's gold rate.",
    stale: "These rates are more than a day old. Message us on WhatsApp for today's rate.",
    updated: (d: string) => `Last updated ${d}. Rates exclude making charges and 3% GST; ask us for a firm showroom quote.`,
    loading: "Loading today's rates…",
    locale: "en-IN",
  },
  hi: {
    rows: ["24 कैरेट सोना (999)", "22 कैरेट सोना (916)", "18 कैरेट सोना (750)", "चांदी (999)"],
    head: ["धातु", "1 ग्राम", "10 ग्राम"],
    kg: "किलो",
    error: "आज का भाव लोड नहीं हो सका। कृपया हमें WhatsApp पर संदेश भेजें।",
    notPosted: "आज का भाव अभी अपडेट नहीं हुआ है। आज के सोने के भाव के लिए हमें WhatsApp करें या शोरूम पर कॉल करें।",
    stale: "यह भाव एक दिन से ज़्यादा पुराना है। आज के भाव के लिए हमें WhatsApp करें।",
    updated: (d: string) => `अंतिम अपडेट: ${d}। भाव में मेकिंग चार्ज और 3% GST शामिल नहीं है; पक्की कीमत के लिए शोरूम से पूछें।`,
    loading: "आज का भाव लोड हो रहा है…",
    locale: "hi-IN",
  },
  mr: {
    rows: ["24 कॅरेट सोने (999)", "22 कॅरेट सोने (916)", "18 कॅरेट सोने (750)", "चांदी (999)"],
    head: ["धातू", "1 ग्रॅम", "10 ग्रॅम"],
    kg: "किलो",
    error: "आजचा दर लोड होऊ शकला नाही. कृपया आम्हाला WhatsApp वर संदेश पाठवा.",
    notPosted: "आजचा दर अजून अपडेट झालेला नाही. आजच्या सोन्याच्या दरासाठी आम्हाला WhatsApp करा किंवा शोरूमला फोन करा.",
    stale: "हा दर एक दिवसापेक्षा जुना आहे. आजच्या दरासाठी आम्हाला WhatsApp करा.",
    updated: (d: string) => `शेवटचे अपडेट: ${d}. दरात घडणावळ (मेकिंग चार्ज) आणि 3% GST समाविष्ट नाही; पक्क्या किमतीसाठी शोरूममध्ये विचारा.`,
    loading: "आजचा दर लोड होत आहे…",
    locale: "mr-IN",
  },
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Rates load in the browser from the store's saved rates, so the page never shows a number frozen at build time. */
export function LiveRatesTable({ lang = "en" }: { lang?: keyof typeof RATE_TEXT }) {
  const t = RATE_TEXT[lang];
  const { data: r, error } = useLoad(() => getMetalRates());
  if (error) return <p className="mt-10 text-center text-danger">{t.error}</p>;
  if (r && !r.lastUpdated) return <p className="mt-10 border border-line bg-cream px-5 py-6 text-center">{t.notPosted}</p>;
  const stale = r && ratesAgeHours(r) > 24;
  return (
    <div className="mt-10">
      <table className="w-full border border-line text-left text-[15px]">
        <thead className="bg-cream text-[12px] tracking-[0.12em] uppercase">
          <tr>
            <th className="px-4 py-3">{t.head[0]}</th>
            <th className="px-4 py-3 text-right">{t.head[1]}</th>
            <th className="px-4 py-3 text-right">{t.head[2]}</th>
          </tr>
        </thead>
        <tbody>
          {KEYS.map((key, i) => (
            <tr key={key} className="border-t border-line">
              <th className="px-4 py-3 font-normal">{key === "silver" ? t.rows[i] : <b>{t.rows[i]}</b>}</th>
              <td className="px-4 py-3 text-right">{r ? inr(r[key]) : "…"}</td>
              <td className="px-4 py-3 text-right">{r ? (key === "silver" ? `${inr(r[key] * 1000)} / ${t.kg}` : inr(r[key] * 10)) : "…"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {stale && <p className="mt-3 text-[14px] text-danger">{t.stale}</p>}
      <p className="mt-3 text-[13px] text-subtle">
        {r ? t.updated(new Date(r.lastUpdated).toLocaleString(t.locale, { day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })) : t.loading}
      </p>
    </div>
  );
}
