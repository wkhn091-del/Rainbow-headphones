"use client";

import { useState, useTransition, type FormEvent } from "react";
import { joinWaitlist } from "@/app/actions/commerce";
import { copy } from "@/lib/copy/he";
import { track } from "@/lib/analytics/track";
import type { NexaColorId } from "@/lib/catalog";

type Status = "idle" | "ok" | "error";

type Props = {
  colorId?: NexaColorId;
  reason?: "early_access" | "sold_out";
};

function LuxeField({
  name,
  type,
  placeholder,
  label,
  required,
  dir,
  inputMode,
  autoComplete,
  maxLength,
}: {
  name: string;
  type: string;
  placeholder: string;
  label: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
  inputMode?: "email" | "tel" | "text";
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <label className="nexa-field-luxe group">
      <span className="nexa-field-luxe__label">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        className="nexa-input-luxe"
        dir={dir}
        aria-label={label}
      />
      <span className="nexa-field-luxe__line" aria-hidden />
    </label>
  );
}

export function PreorderForm({
  colorId,
  reason = "early_access",
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("company") ?? "").trim()) {
      setStatus("ok");
      return;
    }
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();

    startTransition(async () => {
      const result = await joinWaitlist({
        email,
        phone,
        colorId,
        reason,
      });
      if (!result.ok) {
        setStatus("error");
        setError(result.error);
        return;
      }
      setCode(result.data.code);
      setStatus("ok");
      track("generate_lead", { method: reason, colorId });
      e.currentTarget.reset();
    });
  }

  if (status === "ok") {
    return (
      <div role="status" className="space-y-3">
        <p className="text-sm text-[var(--color-accent)]">
          {reason === "sold_out"
            ? "נרשמתם — נעדכן ב-SMS ובמייל כשהצבע חוזר."
            : copy.preorderSuccess}
        </p>
        {code ? (
          <p
            className="border border-[var(--color-border)] px-3 py-2 font-[family-name:var(--font-mono)] text-sm tracking-[0.2em] text-white"
            dir="ltr"
          >
            {code}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      data-lenis-prevent
      className="relative flex w-full flex-col gap-5"
    >
      <LuxeField
        name="email"
        type="email"
        required
        maxLength={120}
        autoComplete="email"
        inputMode="email"
        placeholder="name@studio.co.il"
        label="מייל"
        dir="ltr"
      />
      <LuxeField
        name="phone"
        type="tel"
        required
        maxLength={20}
        autoComplete="tel"
        inputMode="tel"
        placeholder="050-0000000"
        label="נייד · SMS"
        dir="ltr"
      />
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <button
        type="submit"
        disabled={pending}
        className="nexa-btn-buy min-h-12 w-full tracking-[-0.01em]"
      >
        {pending
          ? "שומרים…"
          : reason === "sold_out"
            ? "התראה כשחוזר למלאי"
            : copy.preorderSubmit}
      </button>
      <p className="text-center text-[11px] tracking-[0.02em] text-[var(--color-text-faint)]">
        מייל + SMS · בלי התחייבות · הקוד נשלח בפתיחה
      </p>
      {status === "error" && (
        <p className="text-xs text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
