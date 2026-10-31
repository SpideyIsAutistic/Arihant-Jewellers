import { DHANTERAS } from "@/content/local-pages";
import { LocalPageView, localMeta } from "@/components/layout/LocalPage";

const PATHS = { en: "/festive/dhanteras-diwali", hi: "/hi/dhanteras", mr: "/mr/dhanteras" };
export const metadata = localMeta(DHANTERAS.mr, "mr", PATHS);

export default function Page() {
  return <LocalPageView p={DHANTERAS.mr} lang="mr" enPath={PATHS.en} />;
}
