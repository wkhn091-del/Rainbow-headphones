import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { getServerEnv } from "@/lib/env/server";

export type GrowSessionInput = {
  orderId: string;
  amountIls: number;
  email: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
};

export type GrowSessionResult =
  | { ok: true; checkoutUrl: string; providerRef: string }
  | { ok: false; error: string; code: string };

/**
 * Grow Mesh session — server truth only (amount never from client).
 */
export async function createGrowSession(
  input: GrowSessionInput,
): Promise<GrowSessionResult> {
  const env = getServerEnv();
  if (!env.GROW_API_KEY) {
    return { ok: false, error: "Grow לא מוגדר", code: "not_configured" };
  }

  const base =
    process.env.GROW_API_BASE?.replace(/\/$/, "") ||
    "https://api.grow-il.com";

  try {
    const res = await fetch(`${base}/v1/checkout/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROW_API_KEY}`,
      },
      body: JSON.stringify({
        amount: Math.round(input.amountIls * 100),
        currency: "ILS",
        customer_email: input.email,
        description: input.description,
        metadata: { orderId: input.orderId },
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        payment_methods: ["bit", "apple_pay", "google_pay", "credit_card"],
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[grow:session]", res.status, text.slice(0, 200));
      return {
        ok: false,
        error: "יצירת סשן תשלום נכשלה",
        code: "grow_http",
      };
    }

    const data = (await res.json()) as {
      id?: string;
      url?: string;
      checkout_url?: string;
    };
    const checkoutUrl = data.checkout_url ?? data.url;
    const providerRef = data.id ?? input.orderId;
    if (!checkoutUrl) {
      return {
        ok: false,
        error: "תשובת Grow ללא URL",
        code: "grow_malformed",
      };
    }
    return { ok: true, checkoutUrl, providerRef };
  } catch (err) {
    console.error(
      "[grow:session:net]",
      err instanceof Error ? err.message : err,
    );
    return { ok: false, error: "רשת Grow לא זמינה", code: "grow_network" };
  }
}

/** HMAC-SHA256 hex, timing-safe. Also accepts raw secret header for dashboards that send it. */
export function verifyGrowWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = getServerEnv().GROW_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const clean = signature.replace(/^sha256=/i, "").trim();
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    const a = Buffer.from(clean, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length === b.length && timingSafeEqual(a, b)) return true;
  } catch {
    /* fall through */
  }

  // Some Mesh dashboards send the shared secret as the header value
  try {
    const a = Buffer.from(clean, "utf8");
    const b = Buffer.from(secret, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
