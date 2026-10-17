"use server";

import { customAlphabet } from "nanoid";
import { render } from "@react-email/components";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEmailFrom, getResend } from "@/lib/email/resend";
import { WaitlistConfirmation } from "@/emails/WaitlistConfirmation";
import {
  waitlistEmailSchema,
  waitlistInputSchema,
} from "@/lib/validators/waitlist";
import {
  FLAGSHIP,
  LAUNCH,
  PRODUCT_PRICE_ILS,
  PRODUCT_SKU,
} from "@/lib/catalog";
import type { NexaColorId } from "@/lib/catalog";
import { randomUUID } from "crypto";
import { sendSms } from "@/lib/sms/twilio";
import { notifySlack } from "@/lib/notify/slack";

const codeAlphabet = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

function allowDemoCommerce() {
  return (
    process.env.ALLOW_DEMO_CHECKOUT === "1" ||
    process.env.NODE_ENV === "development"
  );
}

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

function earlyAccessCode() {
  return `NEXA-${codeAlphabet()}`;
}

/**
 * Waitlist / sold-out alert — email + phone (SMS) required.
 * Issues a 48h early-access code (honored at sale open).
 */
export async function joinWaitlist(input: {
  email: string;
  phone: string;
  colorId?: NexaColorId;
  reason?: "early_access" | "sold_out";
}): Promise<ActionResult<{ code: string }>> {
  const parsed = waitlistInputSchema.safeParse(input);
  if (!parsed.success) {
    const phoneFail = parsed.error.issues.some((i) =>
      i.path.includes("phone"),
    );
    return {
      ok: false,
      error: phoneFail ? "מספר נייד לא תקין" : "כתובת מייל לא תקינה",
      code: phoneFail ? "invalid_phone" : "invalid_email",
    };
  }
  const { email, phone, colorId, reason } = parsed.data;

  const admin = createAdminClient();
  if (!admin) {
    if (!allowDemoCommerce()) {
      return {
        ok: false,
        error: "מערכת ההרשמה עדיין לא מוגדרת",
        code: "not_configured",
      };
    }
    const code = earlyAccessCode();
    console.info("[joinWaitlist:demo]", {
      emailLen: email.length,
      reason,
      colorId,
    });
    await Promise.all([
      sendWaitlistEmail(email, code),
      sendSms(
        phone,
        `Nexa Audio · קוד Early Access: ${code}. תקף 48ש׳ בפתיחה.`,
      ),
      notifySlack(`Waitlist demo · ${reason} · ${colorId ?? "-"}`),
    ]);
    return { ok: true, data: { code } };
  }

  const code = earlyAccessCode();

  const { data: existing } = await admin
    .from("waitlist")
    .select("id, early_access_code")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    const existingCode = existing.early_access_code ?? code;
    if (!existing.early_access_code) {
      await admin
        .from("waitlist")
        .update({
          early_access_code: existingCode,
          phone,
          color_id: colorId ?? null,
          reason,
        })
        .eq("id", existing.id);
    }
    await Promise.all([
      sendWaitlistEmail(email, existingCode),
      sendSms(
        phone,
        `Nexa Audio · קוד Early Access: ${existingCode}. תקף 48ש׳ בפתיחה.`,
      ),
    ]);
    return { ok: true, data: { code: existingCode } };
  }

  const { error: insertError } = await admin.from("waitlist").insert({
    email,
    phone,
    color_id: colorId ?? null,
    reason,
    early_access_code: code,
  });

  if (insertError) {
    console.error("[joinWaitlist:insert]", insertError.code);
    return { ok: false, error: "לא הצלחנו לשמור. נסו שוב.", code: "db_error" };
  }

  await Promise.all([
    sendWaitlistEmail(email, code),
    sendSms(
      phone,
      `Nexa Audio · קוד Early Access: ${code}. תקף 48ש׳ בפתיחה.`,
    ),
    notifySlack(`Waitlist · ${reason} · ${colorId ?? "-"} · ${email}`),
  ]);
  return { ok: true, data: { code } };
}

async function sendWaitlistEmail(email: string, code: string) {
  const resend = getResend();
  if (!resend) {
    console.info("[joinWaitlist:email:stub]", { sent: false });
    return;
  }
  try {
    const html = await render(
      WaitlistConfirmation({ email, earlyAccessCode: code }),
    );
    await resend.emails.send({
      from: getEmailFrom(),
      to: email,
      subject: "Nexa Audio · Early Access",
      html,
    });
  } catch (err) {
    console.error("[joinWaitlist:email]", err instanceof Error ? err.message : "fail");
  }
}

type InitCheckoutInput = {
  email: string;
  colorId?: NexaColorId;
  qty?: number;
};

type InitCheckoutData = {
  orderId: string;
  remaining: number;
  totalAmount: number;
  status: "pending";
};

type InitCheckoutDataExtended = InitCheckoutData & {
  growConfigured: boolean;
  checkoutUrl?: string;
  demo?: boolean;
};

/**
 * Reserve unit via decrement_stock RPC, create pending order,
 * optionally open Grow session when GROW_API_KEY is set.
 */
export async function initCheckout(
  input: InitCheckoutInput,
): Promise<ActionResult<InitCheckoutDataExtended>> {
  const parsed = waitlistEmailSchema.safeParse(input.email);
  if (!parsed.success) {
    return { ok: false, error: "כתובת מייל לא תקינה", code: "invalid_email" };
  }
  const email = parsed.data;
  const qty = Math.min(
    Math.max(Number(input.qty) || 1, 1),
    FLAGSHIP.maxQtyPerOrder,
  );
  const colorId = input.colorId ?? "titanium";
  const totalAmount = PRODUCT_PRICE_ILS * qty;

  const admin = createAdminClient();
  if (!admin) {
    if (!allowDemoCommerce()) {
      return {
        ok: false,
        error: "קופה עדיין לא מוגדרת",
        code: "not_configured",
      };
    }
    return {
      ok: true,
      data: {
        orderId: randomUUID(),
        remaining: Math.max(0, LAUNCH.totalUnits - qty),
        totalAmount,
        status: "pending",
        growConfigured: false,
        demo: true,
      },
    };
  }

  const { data: rpcRows, error: rpcError } = await admin.rpc("decrement_stock", {
    p_product_name: "Nexa Pro 3D",
    p_qty: qty,
  });

  if (rpcError) {
    console.error("[initCheckout:rpc]", rpcError.code);
    return { ok: false, error: "שגיאת מלאי. נסו שוב.", code: "rpc_error" };
  }

  const row = Array.isArray(rpcRows) ? rpcRows[0] : rpcRows;
  if (!row?.success) {
    if (row?.error_code === "sold_out") {
      return { ok: false, error: "Sold Out", code: "sold_out" };
    }
    return {
      ok: false,
      error: "לא ניתן לשריין יחידה",
      code: row?.error_code ?? "reserve_failed",
    };
  }

  // launch_orders = brief `orders` contract (avoids clash with account ledger)
  const { data: order, error: orderError } = await admin
    .from("launch_orders")
    .insert({
      email,
      total_amount: totalAmount,
      status: "pending",
      sku: PRODUCT_SKU,
      color_id: colorId,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    // Compensate stock so we never strand a reserved unit without an order
    await admin.rpc("release_stock", {
      p_product_name: "Nexa Pro 3D",
      p_qty: qty,
    });
    console.error("[initCheckout:order]", orderError?.code);
    return { ok: false, error: "יצירת הזמנה נכשלה", code: "order_error" };
  }

  const orderId = order.id as string;
  let checkoutUrl: string | undefined;
  let growConfigured = false;

  try {
    const { createGrowSession } = await import("@/lib/payments/grow");
    const { envFlags } = await import("@/lib/env/server");
    growConfigured = envFlags().grow;
    if (growConfigured) {
      const site =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
        "http://localhost:3000";
      const session = await createGrowSession({
        orderId,
        amountIls: totalAmount,
        email,
        description: `${PRODUCT_SKU} · ${colorId}`,
        successUrl: `${site}/checkout?paid=1&order=${orderId}`,
        cancelUrl: `${site}/#buy`,
      });
      if (session.ok) {
        checkoutUrl = session.checkoutUrl;
        await admin
          .from("launch_orders")
          .update({ grow_ref: session.providerRef })
          .eq("id", orderId);
      }
    }
  } catch (err) {
    console.error("[initCheckout:grow]", err instanceof Error ? err.message : err);
  }

  return {
    ok: true,
    data: {
      orderId,
      remaining: Number(row.remaining),
      totalAmount,
      status: "pending",
      growConfigured,
      checkoutUrl,
    },
  };
}
