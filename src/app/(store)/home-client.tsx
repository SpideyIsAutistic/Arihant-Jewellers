"use client";

import Link from "next/link";
import { getBanners, getTestimonials } from "@/lib/content";
import { getCatalog, getCardsByTag, getCategoryStartingPrices, getNewArrivals } from "@/lib/catalog";
import { getSettings } from "@/lib/settings";
import { Slideshow, type Slide } from "@/components/home/Slideshow";
import { TabbedProducts } from "@/components/home/TabbedProducts";
import { TileRow } from "@/components/home/Tiles";
import { TrustBar } from "@/components/home/TrustBar";
import { ServiceBanners } from "@/components/home/ServiceBanners";
import { CategoryMosaic } from "@/components/home/CategoryMosaic";
import { ShopTheLook, type LookSpot } from "@/components/home/ShopTheLook";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramStrip, ShowroomBanner, StorySplit } from "@/components/home/Story";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import type { Banner } from "@/db/schema";
import { useLoad } from "@/lib/use-load";
import { PageLoader } from "@/components/ui/PageLoader";

const toSlide = (b: Banner): Slide => ({
  id: b.id,
  title: b.title,
  subtitle: b.subtitle,
  ctaLabel: b.ctaLabel,
  href: b.href,
  image: b.image,
  mobileImage: b.mobileImage,
  align: b.align,
});

function Section({ title, children, className = "", id }: { title?: string; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section className={`pt-20 sm:pt-28 ${className}`} aria-labelledby={id}>
      {title && (
        <h2 id={id} className="h-section mb-10 px-5 sm:mb-14">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

const loadHome = () =>
  Promise.all([
    getBanners(),
    getSettings(),
    getCatalog(),
    getCardsByTag("bestseller", 40),
    getNewArrivals(12),
    getCategoryStartingPrices(),
    getTestimonials(),
  ]);

type HomeData = Awaited<ReturnType<typeof loadHome>>;

export default function HomeClient({ initialData }: { initialData?: HomeData }) {
  const { data: liveData, error } = useLoad(loadHome);
  const data = liveData ?? initialData;
  if (!data) return <PageLoader error={error} />;
  return <Home data={data} />;
}

function Home({ data }: { data: HomeData }) {
  const [banners, settings, catalog, bestsellers, newArrivals, catPrices, testimonials] = data;

  const tabCats = ["rings", "necklaces", "necklace-sets", "mangalsutra", "chains", "gemstones"];
  const tabs = tabCats
    .map((slug) => {
      const cat = catalog.categories.find((c) => c.slug === slug);
      return { label: cat?.name ?? slug, cards: bestsellers.filter((b) => b.categorySlug === slug).concat(catalog.cards.filter((c) => c.categorySlug === slug && !c.tags.includes("bestseller"))).slice(0, 8) };
    })
    .filter((t) => t.cards.length >= 2);

  const look = banners.look[0];
  let spots: LookSpot[] = [];
  if (look?.meta) {
    try {
      const meta = JSON.parse(look.meta) as { hotspots?: { productId: string; x: number; y: number }[] };
      spots = (meta.hotspots ?? [])
        .map((h) => ({ card: catalog.cards.find((c) => c.id === h.productId)!, x: h.x, y: h.y }))
        .filter((s) => s.card);
    } catch {
      spots = [];
    }
  }

  const mosaic = catPrices
    .filter((c) => c.count > 0)
    .slice(0, 6)
    .map((c) => ({ slug: c.category.slug, name: c.category.name, image: c.category.image, from: c.from }));

  const storyImgs = [banners.promo[0]?.image, banners.hero[0]?.image].filter(Boolean) as string[];

  return (
    <>
      <h1 className="sr-only">Arihant Jewellers — gold, diamond and gemstone jewellery in Thane</h1>
      <Slideshow slides={banners.hero.map(toSlide)} priority />

      <section className="page-width pt-2" aria-label="Festive offers and services">
        <ServiceBanners />
      </section>

      <Section title="Explore Our Bestsellers" id="bestsellers-title">
        <div className="page-width">
          <TabbedProducts tabs={tabs} />
        </div>
      </Section>

      {banners.promo.length > 0 && (
        <Section title="Made to Be Worn, Meant to Be Felt" id="promo-title">
          <Slideshow slides={banners.promo.map(toSlide)} variant="promo" />
        </Section>
      )}

      {banners.recipient.length > 0 && (
        <Section title="Shop By Recipient" id="recipient-title">
          <div className="page-width">
            <TileRow tiles={banners.recipient} labelPosition="top" />
          </div>
        </Section>
      )}

      {newArrivals.length > 0 && (
        <Section title="New Arrivals" id="new-title">
          <div className="page-width">
            <ProductCarousel cards={newArrivals} />
            <div className="mt-10 flex justify-center">
              <Link href="/collections/new-arrivals" className="btn-outline px-7">
                View all
              </Link>
            </div>
          </div>
        </Section>
      )}

      <Section>
        <div className="page-width">
          <TrustBar items={settings.trustBadges} />
        </div>
      </Section>

      {mosaic.length > 0 && (
        <Section title="Shop By Category" id="category-title">
          <CategoryMosaic tiles={mosaic} />
        </Section>
      )}

      {look && spots.length > 0 && (
        <Section title={look.title ?? "Shop the Look"} id="look-title">
          <div className="page-width">
            <ShopTheLook image={look.image} title={look.title ?? "Shop the look"} spots={spots} />
          </div>
        </Section>
      )}

      {banners.occasion.length > 0 && (
        <Section title="Shop By Occasion" id="occasion-title">
          <div className="page-width">
            <TileRow tiles={banners.occasion} labelPosition="bottom" />
          </div>
        </Section>
      )}

      {banners.collections.length > 0 && (
        <Section title="Explore our Collections" id="collections-title">
          <Slideshow slides={banners.collections.map(toSlide)} variant="promo" />
        </Section>
      )}

      <Section>
        <ShowroomBanner
          image="/catalogue/showroom.webp"
          address={settings.address}
          mapUrl={settings.mapUrl}
          hours={settings.hours}
        />
      </Section>

      {storyImgs.length === 2 && (
        <Section>
          <div className="page-width">
            <StorySplit title={settings.aboutTitle} text={settings.aboutText} imageA={storyImgs[1]} imageB="/catalogue/rose-gold-diamond-necklace-set-1.webp" />
          </div>
        </Section>
      )}

      <Section>
        <div className="page-width">
          <TrustBar items={settings.serviceBadges} />
        </div>
      </Section>

      <Testimonials items={testimonials} />

      <InstagramStrip handle={settings.instagramHandle} url={settings.social.instagram} images={banners.instagram.map((b) => b.image)} />

      <RecentlyViewed />
    </>
  );
}
