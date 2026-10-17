"use client";

import { useState, useTransition, type FormEvent } from "react";
import { activateWarranty } from "@/app/actions/warranty";

export function WarrantyActivateForm() {
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const result = await activateWarranty({
        serial: String(fd.get("serial") ?? ""),
        email: String(fd.get("email") ?? ""),
      });
      setOk(result.ok);
      setMsg(result.ok ? result.data.message : result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block">
        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-text-faint)] uppercase">
          Serial
        </span>
        <input
          name="serial"
          required
          minLength={6}
          maxLength={32}
          className="nexa-input mt-2"
          placeholder="NEXA-XXXXXXXX"
          dir="ltr"
          autoComplete="off"
        />
      </label>
      <label className="block">
        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-text-faint)] uppercase">
          מייל הזמנה
        </span>
        <input
          name="email"
          type="email"
          required
          className="nexa-input mt-2"
          dir="ltr"
          autoComplete="email"
        />
      </label>
      <button type="submit" disabled={pending} className="nexa-btn-buy w-full">
        {pending ? "מאמתים…" : "הפעלת אחריות"}
      </button>
      {msg ? (
        <p
          role="status"
          className={`text-xs ${ok ? "text-[var(--color-accent)]" : "text-[var(--color-danger)]"}`}
        >
          {msg}
        </p>
      ) : null}
    </form>
  );
}
