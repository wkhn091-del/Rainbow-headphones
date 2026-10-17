import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { DEMO_ORDERS } from "./demo-data";

export type AccountOrder = {
  public_id: string;
  status: string;
  total_agorot: number;
  created_at: string;
  items: { sku: string; color_id: string | null; qty: number }[];
  shipment: {
    carrier: string | null;
    tracking_code: string | null;
    status: string;
  } | null;
  warranty: {
    sku: string;
    starts_on: string;
    ends_on: string;
    status: string;
  } | null;
};

export async function getSessionUserId(): Promise<string | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function listOrdersForUser(): Promise<{
  orders: AccountOrder[];
  demo: boolean;
}> {
  const { configured } = getSupabaseEnv();
  // Demo orders only with explicit opt-in — never on anonymous/public deploys
  if (!configured) {
    if (process.env.ALLOW_ACCOUNT_DEMO === "1") {
      return {
        demo: true,
        orders: DEMO_ORDERS.map((o) => ({
          public_id: o.public_id,
          status: o.status,
          total_agorot: o.total_agorot,
          created_at: o.created_at,
          items: o.items.map((i) => ({ ...i })),
          shipment: { ...o.shipment },
          warranty: { ...o.warranty },
        })),
      };
    }
    return { demo: false, orders: [] };
  }

  const supabase = await createClient();
  const userId = await getSessionUserId();
  if (!supabase || !userId) return { orders: [], demo: false };

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      public_id,
      status,
      total_agorot,
      created_at,
      order_items ( sku, color_id, qty ),
      shipments ( carrier, tracking_code, status ),
      warranties ( sku, starts_on, ends_on, status )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !orders) return { orders: [], demo: false };

  return {
    demo: false,
    orders: orders.map((o) => {
      const items = (o.order_items as AccountOrder["items"] | null) ?? [];
      const shipments = o.shipments as
        | AccountOrder["shipment"][]
        | AccountOrder["shipment"]
        | null;
      const warranties = o.warranties as
        | AccountOrder["warranty"][]
        | AccountOrder["warranty"]
        | null;
      const shipment = Array.isArray(shipments) ? shipments[0] ?? null : shipments;
      const warranty = Array.isArray(warranties) ? warranties[0] ?? null : warranties;
      return {
        public_id: o.public_id,
        status: o.status,
        total_agorot: o.total_agorot,
        created_at: o.created_at,
        items,
        shipment,
        warranty,
      };
    }),
  };
}

export async function getOrderByPublicId(
  publicId: string,
): Promise<AccountOrder | null> {
  const { orders, demo } = await listOrdersForUser();
  const found = orders.find((o) => o.public_id === publicId) ?? null;
  if (found) return found;
  if (demo) return null;

  const supabase = await createClient();
  const userId = await getSessionUserId();
  if (!supabase || !userId) return null;

  const { data } = await supabase
    .from("orders")
    .select(
      `
      public_id,
      status,
      total_agorot,
      created_at,
      order_items ( sku, color_id, qty ),
      shipments ( carrier, tracking_code, status ),
      warranties ( sku, starts_on, ends_on, status )
    `,
    )
    .eq("user_id", userId)
    .eq("public_id", publicId)
    .maybeSingle();

  if (!data) return null;
  const items = (data.order_items as AccountOrder["items"] | null) ?? [];
  const shipments = data.shipments as AccountOrder["shipment"][] | null;
  const warranties = data.warranties as AccountOrder["warranty"][] | null;
  return {
    public_id: data.public_id,
    status: data.status,
    total_agorot: data.total_agorot,
    created_at: data.created_at,
    items,
    shipment: shipments?.[0] ?? null,
    warranty: warranties?.[0] ?? null,
  };
}
