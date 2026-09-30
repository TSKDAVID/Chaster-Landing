import { notFound } from "next/navigation";
import { Analytics } from "@/components/Analytics";
import { DeskAnatomy } from "@/components/sections/DeskAnatomy";
import { FaqThread } from "@/components/sections/FaqThread";
import { FinalCall } from "@/components/sections/FinalCall";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { MobileDock } from "@/components/sections/MobileDock";
import { Nav } from "@/components/sections/Nav";
import { PlanBuilder } from "@/components/sections/PlanBuilder";
import { Rules } from "@/components/sections/Rules";
import { Setup } from "@/components/sections/Setup";
import { ADDON_MODULES } from "@/config/modules";
import { planTotal, pricing } from "@/config/pricing";
import { isLocale, localePath, site } from "@/config/site";
import { getCopy } from "@/content";
import { BusinessTypeProvider } from "@/state/business-type";
import { PlanProvider } from "@/state/plan";

/** Structured data: one offer range from the base plan to every module switched on (§1.14). */
function jsonLd(locale: "ka" | "en", description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: locale,
    url: `${site.url}${localePath(locale)}`,
    description,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: pricing.currency,
      lowPrice: pricing.base.monthly,
      highPrice: planTotal(ADDON_MODULES),
      offerCount: 1 + ADDON_MODULES.length,
    },
  };
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getCopy(lang);

  return (
    <BusinessTypeProvider>
      <PlanProvider locale={lang}>
        <Nav copy={copy} locale={lang} />
        <main id="main">
          <Hero copy={copy} locale={lang} />
          <DeskAnatomy copy={copy} />
          <Setup copy={copy} />
          <PlanBuilder copy={copy} />
          <Rules copy={copy} />
          <FaqThread copy={copy} />
          <FinalCall copy={copy} />
        </main>
        <Footer copy={copy} locale={lang} />
        <MobileDock copy={copy} />
        <Analytics copy={copy.consent} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang, copy.meta.description)) }} />
      </PlanProvider>
    </BusinessTypeProvider>
  );
}
