import { ScrollExperience } from "@/components/experience/ScrollExperience";
import { BreatheSection } from "@/components/experience/BreatheSection";
import { StudioBento } from "@/components/experience/StudioBento";
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
      {/* Acts 1–2: preload · reveal · drop · explode */}
      <ScrollExperience />
      {/* Act 3: horizontal breathe typography */}
      <BreatheSection />
      {/* Act 4: asymmetric studio bento + glass trust */}
      <StudioBento />
      <TrustRow />
      {/* Act 5: live 3D configurator + magnetic checkout + FOMO */}
      <Hero />
      <WhyNexa />
      <HomeBelowFold />
      <SiteFooter />
      <WhatsAppFloat />
      <CookieBanner />
      <ContinueResumeLazy />
    </main>
  );
}
