"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  publicId: string;
};

export function ReorderButton({ publicId }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function reorder() {
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/account/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      checkoutUrl?: string;
      error?: string;
    };
    setBusy(false);
    if (!res.ok || !data.ok || !data.checkoutUrl) {
      setErr(data.error ?? "לא הצלחנו להזמין שוב.");
      return;
    }
    router.push(data.checkoutUrl);
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={reorder}
        className="nexa-btn-accent text-xs"
      >
        {busy ? "טוען…" : "הזמן שוב"}
      </button>
      {err ? <p className="mt-1 text-[11px] text-red-300/80">{err}</p> : null}
    </div>
  );
}
