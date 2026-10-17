"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { NexaColorId } from "@/lib/catalog";
import { PRODUCT_PRICE_ILS, PRODUCT_SKU } from "@/lib/catalog";
import { copy } from "@/lib/copy/he";
import { initCheckout } from "@/app/actions/commerce";
import { PaymentMethods } from "@/components/commerce/PaymentMethods";
import { track } from "@/lib/analytics/track";
import { useIsClient } from "@/lib/client/mounted";

type Props = {
  open: boolean;
  onClose: () => void;
  colorId: NexaColorId;
};

/**
 * Headless checkout shell over the 3D canvas — PayPlus form slot later.
 * Cold Studio: no cards chrome, slide-over, AA contrast.
 */
export function CheckoutModal({ open, onClose, colorId }: Props) {
  const titleId = useId();
  const mounted = useIsClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    track("begin_checkout", { colorId, value: PRODUCT_PRICE_ILS, currency: "ILS" });
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, colorId]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await initCheckout({ email, colorId, qty: 1 });
      if (!result.ok) {
        setMessage(
          result.code === "sold_out"
            ? "Sold Out — המלאי אזל"
            : result.error,
        );
        return;
      }
      setOrderId(result.data.orderId);
      setDemoMode(Boolean(result.data.demo));
      if (result.data.checkoutUrl) {
        setMessage("מעבירים לסליקה מאובטחת…");
        window.location.href = result.data.checkoutUrl;
        return;
      }
      if (result.data.demo) {
        setMessage(
          `סימולציית קופה · נותרו ${result.data.remaining} · ללא Supabase/Grow`,
        );
        return;
      }
      setMessage(
        result.data.growConfigured
          ? `שריינו יחידה · נותרו ${result.data.remaining} · שגיאה בפתיחת Grow`
          : `שריינו יחידה · נותרו ${result.data.remaining} · ממתין ל-GROW_API_KEY`,
      );
    });
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80]" dir="rtl">
          <motion.button
            type="button"
            aria-label="סגור"
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col border-s border-[var(--color-border)] bg-[var(--color-bg)] shadow-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-6 py-5">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--color-text-faint)] uppercase">
                  Checkout · Hold
                </p>
                <h2
                  id={titleId}
                  className="mt-2 text-xl font-semibold tracking-tight text-white"
                >
                  תשלום מאובטח
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-text-faint)] uppercase hover:text-[var(--color-accent)]"
              >
                Close
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <dl className="space-y-2 font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-text-muted)]">
                <div className="flex justify-between gap-4">
                  <dt>SKU</dt>
                  <dd className="text-white" dir="ltr">
                    {PRODUCT_SKU}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>צבע</dt>
                  <dd className="text-white" dir="ltr">
                    {colorId}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>סכום</dt>
                  <dd className="text-[var(--color-accent)]">
                    ₪{PRODUCT_PRICE_ILS.toLocaleString("he-IL")}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 text-sm font-light text-[var(--color-text-muted)]">
                {copy.reassurance}
              </p>

              <PaymentMethods
                variant="full"
                className="mt-5"
                colorId={colorId}
              />

              <form onSubmit={submit} className="mt-8 space-y-4">
                <label className="block">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-text-faint)] uppercase">
                    מייל לקבלה
                  </span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="nexa-input mt-2"
                    placeholder="you@domain.com"
                    dir="ltr"
                  />
                </label>

                <button
                  type="submit"
                  disabled={pending}
                  className="nexa-btn-buy w-full disabled:opacity-50"
                >
                  {pending ? "משריינים מלאי…" : "שריון יחידה · המשך לתשלום"}
                </button>
              </form>

              {message ? (
                <p
                  className={`mt-4 font-[family-name:var(--font-mono)] text-xs ${
                    message.includes("Sold Out")
                      ? "text-[var(--color-danger)]"
                      : "text-[var(--color-accent)]"
                  }`}
                  role="status"
                >
                  {message}
                </p>
              ) : null}

              {orderId ? (
                <div className="mt-8 border border-[var(--color-border)] p-4">
                  <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-text-faint)] uppercase">
                    {demoMode
                      ? "Demo checkout · ללא סליקה חיה"
                      : "Grow Mesh · ממתין למפתח"}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    הזמנה <span dir="ltr">{orderId.slice(0, 8)}</span> · שוריינה
                  </p>
                  {demoMode ? (
                    <button
                      type="button"
                      className="nexa-btn-buy mt-4 w-full"
                      onClick={() => {
                        window.location.href = `/checkout?paid=1&order=${orderId}&demo=1`;
                      }}
                    >
                      השלם סימולציית תשלום
                    </button>
                  ) : (
                    <div className="mt-4 flex h-28 flex-col items-center justify-center gap-2 border border-dashed border-[var(--color-border)] px-4 text-center font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-text-faint)] uppercase">
                      <span>Bit · Apple Pay · Google Pay · אשראי</span>
                      <span className="normal-case tracking-normal text-[var(--color-text-muted)]">
                        יופיע כאן אחרי GROW_API_KEY
                      </span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
