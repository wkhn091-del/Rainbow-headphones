import { FLAGSHIP, LAUNCH, PRODUCT_SKU } from "@/lib/catalog";
import { PageShell } from "@/components/layout/PageShell";
import { ColdStartTrust } from "@/components/commerce/ColdStartTrust";
import { RecentlyViewed } from "@/components/commerce/RecentlyViewed";
import { TrackViewed } from "@/components/commerce/TrackViewed";
import { SmartSearchBar } from "@/components/search/SmartSearchBar";
import { ShopCatalog } from "@/components/shop/ShopCatalog";

export default function ShopPage() {
  return (
    <PageShell title="חנות">
      <TrackViewed
        sku={PRODUCT_SKU}
        nameHe={FLAGSHIP.name}
        href="/shop"
      />
      <p className="text-sm text-[var(--color-text-muted)]">
        מוצר דגל, אביזרים, ומחיר סופי שקוף בצ׳קאאוט — כולל מע״מ.
      </p>
      <div className="mt-4">
        <SmartSearchBar />
      </div>
      <ColdStartTrust />
      <RecentlyViewed className="mt-6" />
      <ShopCatalog remainingUnits={LAUNCH.totalUnits} />
    </PageShell>
  );
}
