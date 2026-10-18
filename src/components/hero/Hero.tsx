"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  FLAGSHIP,
  NEXA_COLORS,
  PRODUCT_SKU,
  type NexaColorId,
} from "@/lib/catalog";
import { copy } from "@/lib/copy/he";
import { LIFESTYLE } from "@/lib/media/lifestyle";
import { BuyNowButton } from "./BuyNowButton";
import { ColorSwatches } from "./ColorSwatches";
import { PreorderForm } from "./PreorderForm";
import { StickyBuyBar } from "./StickyBuyBar";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { PaymentMethods } from "@/components/commerce/PaymentMethods";
import { TrackViewed } from "@/components/commerce/TrackViewed";
import { RecentlyViewed } from "@/components/commerce/RecentlyViewed";
import { LazyCanvas } from "@/components/canvas/LazyCanvas";
import { FomoCounter } from "@/components/experience/FomoCounter";
import { saveResume } from "@/lib/store/resume";
import { useIsClient } from "@/lib/client/mounted";
import { usePrefersReducedMotion } from "@/lib/client/reduced-motion";
import { isColorSoldOut } from "@/lib/stock/colors";

/**
 * Act 5 — checkout configurator: live 3D material swap + magnetic CTA + FOMO.
 */
export function Hero() {
  const buyAnchorRef = useRef<HTMLDivElement>(null);
  const [colorId, setColorId] = useState<NexaColorId>("titanium");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showSoldOutWaitlist, setShowSoldOutWaitlist] = useState(false);
  const mounted = useIsClient();
  const reduced = usePrefersReducedMotion();
  const soldOut = isColorSoldOut(colorId);

  const color = useMemo(
    () => NEXA_COLORS.find((c) => c.id === colorId) ?? NEXA_COLORS[0]!,
    [colorId],
  );

  useEffect(() => {
    if (!mounted) return;
    saveResume({ sku: PRODUCT_SKU, colorId, lastPath: "/" });
    if (!isColorSoldOut(colorId)) setShowSoldOutWaitlist(false);
  }, [colorId, mounted]);

  return (
    <>
      <TrackViewed
        sku={PRODUCT_SKU}
        nameHe={FLAGSHIP.name}
        href="/#buy"
      />

      <section
        id="buy"
        data-depth="steel"
        className="nexa-atmosphere nexa-depth-wash relative z-[45] isolate border-t border-[var(--color-border)] px-5 py-16 sm:px-8 sm:py-24"
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-80"
          style={{
            background: `radial-gradient(ellipse 55% 45% at 80% 25%, ${color.hex}33, transparent 58%)`,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 end-0 z-0 w-1/2 opacity-25 mix-blend-luminosity max-lg:hidden"
          style={{
            backgroundImage: `url(${LIFESTYLE.desk.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: "linear-gradient(to left, black, transparent)",
            WebkitMaskImage: "linear-gradient(to left, black, transparent)",
          }}
          aria-hidden
        />

        <div className="relative z-[1] mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div ref={buyAnchorRef} className="order-2 lg:order-1 lg:max-w-md lg:justify-self-end">
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-accent)] uppercase">
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.85rem,3.5vw,2.6rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-white">
              {copy.buyHeadline}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
              בחרו צבע — האוזנייה בתמונה משתנה מיד.{" "}
              <span className="text-white/80">מי שמתלבט — מפסיד את המלאי.</span>
            </p>
            <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-text-faint)]">
              {copy.stockHint}
            </p>

            <div className="mt-8 rounded-sm border border-white/10 bg-white/[0.03] p-5">
              <p className="mb-4 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--color-text-faint)] uppercase">
                {copy.colorLabel} · לוחצים ורואים
              </p>
              <ColorSwatches value={colorId} onChange={setColorId} />
              <p
                className="mt-4 text-sm font-medium transition-colors duration-300"
                style={{ color: color.hex }}
              >
                {color.nameHe}
                <span className="ms-2 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-text-faint)] uppercase">
                  {color.nameEn}
                </span>
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <FomoCounter className="mb-2" />
              <BuyNowButton
                colorId={colorId}
                id="buy-cta"
                onCheckout={() => setCheckoutOpen(true)}
                onSoldOut={() => setShowSoldOutWaitlist(true)}
              />
              <p className="text-[11px] text-[var(--color-text-faint)]">
                {copy.reassurance} · {copy.priceNote}
              </p>
              {(soldOut || showSoldOutWaitlist) && (
                <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-text-faint)] uppercase">
                    Waitlist · {color.nameHe}
                  </p>
                  <PreorderForm colorId={colorId} reason="sold_out" />
                </div>
              )}
              <PaymentMethods
                className="mt-5"
                colorId={colorId}
                onColorChange={setColorId}
              />
              <RecentlyViewed className="mt-6" />
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <div
              className="relative aspect-[4/5] overflow-hidden border border-white/12 bg-[#0a0a0c] sm:aspect-[5/6]"
              style={{ boxShadow: `0 0 48px ${color.hex}33` }}
            >
              <div className="absolute inset-0">
                {mounted ? (
                  <LazyCanvas
                    color={color}
                    reducedMotion={reduced}
                    explodeOnScroll={false}
                    showBlueprint={false}
                  />
                ) : null}
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
                <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-white/60 uppercase">
                  Live material
                </p>
                <p
                  className="border border-white/15 bg-black/50 px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] uppercase backdrop-blur-sm"
                  style={{ color: color.hex }}
                >
                  {color.nameEn}
                </p>
              </div>
              <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16 text-sm text-white/70">
                לחיצה על צבע מעדכנת את המודל עצמו — בלי תמונות סטטיות
              </p>
            </div>
          </div>
        </div>

        <StickyBuyBar
          colorId={colorId}
          onCheckout={() => setCheckoutOpen(true)}
          onSoldOut={() => {
            setShowSoldOutWaitlist(true);
            document
              .getElementById("buy")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </section>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        colorId={colorId}
      />

      <section
        id="preorder"
        data-depth="cyan"
        className="nexa-atmosphere nexa-depth-wash relative border-t border-[var(--color-border)] px-5 py-20 sm:px-8"
      >
        <div className="relative z-[1] mx-auto grid max-w-5xl items-stretch gap-0 overflow-hidden border border-white/12 shadow-[0_40px_80px_rgba(0,0,0,0.45)] md:grid-cols-2">
          <div className="relative min-h-[300px] md:min-h-[460px]">
            <Image
              src={LIFESTYLE.case.src}
              alt={LIFESTYLE.case.alt}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 md:bg-gradient-to-l" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] text-[var(--color-accent)] uppercase">
                Launch access
              </p>
              <p className="mt-2 max-w-xs text-lg text-white">
                הנרתיק הקשיח · מוכן לנסיעה מהיום הראשון
              </p>
            </div>
          </div>
          <div className="relative flex flex-col justify-center overflow-hidden px-6 py-12 sm:px-12">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, #161a20 0%, #0c0e12 55%, #12161c 100%)",
              }}
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }} aria-hidden />
            <div className="relative">
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-accent)] uppercase">
                Private list
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl tracking-[-0.035em] text-white sm:text-3xl">
                {copy.preorderTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {copy.launchNote}
                <br />
                <span className="text-white/70">
                  מי שנרשם קודם — קונה קודם. בלי תור ביום הפתיחה.
                </span>
              </p>
              <div className="mt-8 border border-white/12 bg-black/35 p-6 backdrop-blur-md sm:p-8">
                <PreorderForm colorId={colorId} reason="early_access" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
