import {
  FLAGSHIP,
  LAUNCH,
  PRODUCT_PRICE_ILS,
  PRODUCT_SKU,
} from "@/lib/catalog";

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function ProductJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: FLAGSHIP.name,
    sku: PRODUCT_SKU,
    brand: { "@type": "Brand", name: "Nexa Audio" },
    description:
      "אוזניות Nexa Pro 3D עם ביטול רעשים אקטיבי, שמע מרחבי ואחריות שנתיים.",
    offers: {
      "@type": "Offer",
      priceCurrency: "ILS",
      price: PRODUCT_PRICE_ILS,
      availability: "https://schema.org/PreOrder",
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Nexa Audio" },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "batteryHours", value: FLAGSHIP.batteryHours },
      { "@type": "PropertyValue", name: "launchUnits", value: LAUNCH.totalUnits },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nexa Audio",
    url: "https://nexaaudio.co.il",
    email: "support@nexaaudio.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "תל אביב",
      addressCountry: "IL",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
