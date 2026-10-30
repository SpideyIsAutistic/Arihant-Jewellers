import { GOLD_RATE } from "@/content/local-pages";
import { LocalPageView, localMeta } from "@/components/layout/LocalPage";

const PATHS = { en: "/gold-rate-today", hi: "/hi/gold-rate-today", mr: "/mr/gold-rate-today" };
export const metadata = localMeta(GOLD_RATE.hi, "hi", PATHS);

export default function Page() {
  return <LocalPageView p={GOLD_RATE.hi} lang="hi" enPath={PATHS.en} />;
}
