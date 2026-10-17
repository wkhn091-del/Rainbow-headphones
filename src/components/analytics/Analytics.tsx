"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import {
  CONSENT_EVENT,
  readConsent,
  type Consent,
} from "@/lib/analytics/consent";

const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
const CLARITY = process.env.NEXT_PUBLIC_CLARITY_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function subscribeConsent(onStoreChange: () => void) {
  const onEvent = () => onStoreChange();
  window.addEventListener(CONSENT_EVENT, onEvent);
  window.addEventListener("storage", onEvent);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onEvent);
    window.removeEventListener("storage", onEvent);
  };
}

function getConsentSnapshot(): Consent | "unset" {
  return readConsent();
}

function getServerSnapshot(): Consent | "unset" {
  return "unset";
}

/**
 * Loads GA4 / Clarity / Meta Pixel only after cookie consent = accepted.
 */
export function Analytics() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerSnapshot,
  );

  if (consent !== "accepted") return null;

  return (
    <>
      {GA4 ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`}
            strategy="afterInteractive"
          />
          <Script id="nexa-ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA4}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {CLARITY ? (
        <Script id="nexa-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY}");
          `}
        </Script>
      ) : null}

      {PIXEL ? (
        <Script id="nexa-meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}
