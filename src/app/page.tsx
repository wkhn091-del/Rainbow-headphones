import dynamic from "next/dynamic";
import { ExperienceGate } from "@/components/experience/ExperienceGate";
import { ScrollDwell } from "@/components/experience/ScrollDwell";
import { BreatheSection } from "@/components/experience/BreatheSection";
import { StudioBento } from "@/components/experience/StudioBento";
import { ImmersiveHero } from "@/components/hero/ImmersiveHero";
import { ScrollCinema } from "@/components/hero/ScrollCinema";
import { SpecStripMask } from "@/components/motion/SpecStripMask";
import { StudioDepth } from "@/components/motion/StudioDepth";
import { Hero } from "@/components/hero/Hero";
import { HomeBelowFold } from "@/components/home/HomeBelowFold";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HomeNav } from "@/components/layout/HomeNav";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { ContinueResumeLazy } from "@/components/commerce/ContinueResumeLazy";
import { ProductJsonLd } from "@/components/seo/JsonLd";
import { LaunchStrip } from "@/components/commerce/LaunchStrip";
import { TrustRow } from "@/components/commerce/TrustRow";
import { ProofStrip } from "@/components/commerce/ProofStrip";
import { WhyNexa } from "@/components/commerce/WhyNexa";

const ProductScroll = dynamic(
  () =>
    import("@/components/product-scroll/ProductScroll").then(
      (m) => m.ProductScroll,
    ),
  { ssr: false },
);

/**
 * Motion of Millions page skeleton:
 * open → cinema pin → breath → product pin → numbers → proof → offer → calm conversion
 */
export default function Home() {
  return (
    <main id="main-content">
      <StudioDepth />
      <ProductJsonLd />
      <LaunchStrip />
      <HomeNav />
      <ExperienceGate>
        {/* E1-09 / hook */}
        <ImmersiveHero />
        {/* E1-25 sticky film — long scrub */}
        <ScrollCinema />
        {/* Mandatory gap between pins */}
        <ScrollDwell />
        <SpecStripMask />
        {/* E2-01 product choreography — one WebGL island */}
        <ProductScroll />
        {/* E1-15 breathe numbers */}
        <BreatheSection />
        <ProofStrip />
        <WhyNexa />
        {/* E1-52 bento ecosystem */}
        <StudioBento />
        <TrustRow />
        {/* Conversion — no pins, no competing WebGL until sticky buy */}
        <Hero />
        <HomeBelowFold />
      </ExperienceGate>
      <SiteFooter />
      <WhatsAppFloat />
      <CookieBanner />
      <ContinueResumeLazy />
    </main>
  );
}
