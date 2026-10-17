"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/lib/store/user";
import { useIsClient } from "@/lib/client/mounted";

export function AuthButton() {
  const router = useRouter();
  const { userId, displayName, setUser, clear } = useUserStore();
  const isClient = useIsClient();
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (!isClient) return;
    const supabase = createClient();
    if (!supabase) {
      queueMicrotask(() => setSessionReady(true));
      return;
    }

    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      const u = data.user;
      if (u) {
        setUser({
          userId: u.id,
          displayName:
            (u.user_metadata?.full_name as string | undefined) ??
            u.email?.split("@")[0] ??
            null,
          avatarUrl: (u.user_metadata?.avatar_url as string | undefined) ?? null,
        });
      }
      setSessionReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      if (!u) {
        clear();
        return;
      }
      setUser({
        userId: u.id,
        displayName:
          (u.user_metadata?.full_name as string | undefined) ??
          u.email?.split("@")[0] ??
          null,
        avatarUrl: (u.user_metadata?.avatar_url as string | undefined) ?? null,
      });
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [isClient, setUser, clear]);

  async function signOut() {
    const supabase = createClient();
    await supabase?.auth.signOut();
    clear();
    router.push("/");
  }

  if (!isClient || !sessionReady) {
    return (
      <span className="text-[11px] text-[var(--color-text-faint)] opacity-50">…</span>
    );
  }

  if (!userId) {
    return (
      <Link
        href="/login"
        className="text-[11px] tracking-[0.14em] text-[var(--color-accent)] uppercase transition-opacity hover:opacity-80"
      >
        התחברות
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/account/orders"
        className="max-w-[9rem] truncate text-[11px] text-[var(--color-text-muted)] hover:text-white"
      >
        {displayName ?? "האזור שלי"}
      </Link>
      <button
        type="button"
        onClick={signOut}
        className="text-[11px] tracking-[0.12em] text-[var(--color-text-faint)] uppercase hover:text-[var(--color-accent)]"
      >
        יציאה
      </button>
    </div>
  );
}
