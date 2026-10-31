import { DHANTERAS } from "@/content/local-pages";
import { LocalPageView, localMeta } from "@/components/layout/LocalPage";

const PATHS = { en: "/festive/dhanteras-diwali", hi: "/hi/dhanteras", mr: "/mr/dhanteras" };
export const metadata = localMeta(DHANTERAS.hi, "hi", PATHS);

export default function Page() {
  return <LocalPageView p={DHANTERAS.hi} lang="hi" enPath={PATHS.en} />;
}
