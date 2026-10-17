"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  nextPath?: string;
};

export function LoginForm({ nextPath }: Props) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phase, setPhase] = useState<"idle" | "otp">("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const next =
    nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/account/orders";

  async function signInGoogle() {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setMsg(null);
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setMsg("לא הצלחנו להתחבר. נסו שוב.");
      setBusy(false);
    }
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setMsg(null);
    const normalized = phone.replace(/\s/g, "");
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalized.startsWith("+") ? normalized : `+972${normalized.replace(/^0/, "")}`,
    });
    setBusy(false);
    if (error) {
      setMsg("שליחת הקוד נכשלה. בדקו את המספר ונסו שוב.");
      return;
    }
    setPhase("otp");
    setMsg("נשלח קוד לטלפון.");
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setMsg(null);
    const normalized = phone.replace(/\s/g, "");
    const e164 = normalized.startsWith("+")
      ? normalized
      : `+972${normalized.replace(/^0/, "")}`;
    const { error } = await supabase.auth.verifyOtp({
      phone: e164,
      token: otp,
      type: "sms",
    });
    setBusy(false);
    if (error) {
      setMsg("הקוד לא תקין או שפג תוקפו.");
      return;
    }
    window.location.href = next;
  }

  return (
    <div className="mt-8 space-y-4">
      <button
        type="button"
        disabled={busy}
        onClick={signInGoogle}
        className="nexa-btn-primary w-full justify-center"
      >
        המשך עם Google
      </button>

      <div className="flex items-center gap-3 text-[11px] tracking-wide text-[var(--color-text-faint)] uppercase">
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        או SMS
        <span className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      {phase === "idle" ? (
        <form onSubmit={sendOtp} className="space-y-3">
          <label className="block text-xs text-[var(--color-text-faint)]">
            טלפון נייד
            <input
              dir="ltr"
              inputMode="tel"
              autoComplete="tel"
              required
              maxLength={20}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="050-0000000"
              className="mt-1.5 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--color-accent)]"
            />
          </label>
          <button type="submit" disabled={busy} className="nexa-btn-accent w-full justify-center">
            שליחת קוד
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-3">
          <label className="block text-xs text-[var(--color-text-faint)]">
            קוד מה-SMS
            <input
              dir="ltr"
              inputMode="numeric"
              required
              maxLength={8}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1.5 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm tracking-[0.3em] text-white outline-none focus:border-[var(--color-accent)]"
            />
          </label>
          <button type="submit" disabled={busy} className="nexa-btn-accent w-full justify-center">
            אימות והמשך
          </button>
        </form>
      )}

      {msg ? <p className="text-xs text-[var(--color-text-muted)]">{msg}</p> : null}
    </div>
  );
}
