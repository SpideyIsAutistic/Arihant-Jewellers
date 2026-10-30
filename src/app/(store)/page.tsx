import { getServerHomeData } from "@/lib/server-catalog";
import { absoluteUrl } from "@/lib/utils";
import { storeJsonLd } from "@/lib/store-schema";
import HomeClient from "./home-client";

export default function HomePage() {
  const data = getServerHomeData();
  const settings = data[1];

  const localBusinessJsonLd = storeJsonLd(settings, "/");

  return (
    <>
      <HomeClient initialData={data} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
    </>
  );
}
