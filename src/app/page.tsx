import { ExperienceGate } from "@/components/experience/ExperienceGate";
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
import { WhyNexa } from "@/components/commerce/WhyNexa";

export default function Home() {
  return (
    <main id="main-content">
      <StudioDepth />
      <ProductJsonLd />
      <LaunchStrip />
      <HomeNav />
      <ExperienceGate>
        {/* Hook + scroll cinema videos */}
        <ImmersiveHero />
        <ScrollCinema />
        <SpecStripMask />
        {/* Descending 3D headphones (Quiet / NEXA) live inside Hero */}
        <Hero />
        {/* New acts after the classic scroll story */}
        <BreatheSection />
        <StudioBento />
        <TrustRow />
        <WhyNexa />
        <HomeBelowFold />
      </ExperienceGate>
      <SiteFooter />
      <WhatsAppFloat />
      <CookieBanner />
      <ContinueResumeLazy />
    </main>
  );
}
