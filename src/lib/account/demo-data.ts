import "server-only";

/** Shown only when Supabase env is missing — never mixed with live user data */
export const DEMO_ORDERS = [
  {
    public_id: "nx_demo_8k2m",
    status: "shipped",
    total_agorot: 129_000,
    created_at: "2026-10-10T10:00:00.000Z",
    items: [{ sku: "nexa-pro-3d", color_id: "titanium", qty: 1 }],
    shipment: {
      carrier: "HFD",
      tracking_code: "HFD-DEMO-001",
      status: "בדרך",
    },
    warranty: {
      sku: "nexa-pro-3d",
      starts_on: "2026-10-10",
      ends_on: "2028-10-10",
      status: "active",
    },
  },
] as const;
