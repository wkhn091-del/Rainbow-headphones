import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const instant = false;

type Props = {
  searchParams: Promise<{ next?: string; setup?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { next, setup } = await searchParams;
  const { configured } = getSupabaseEnv();

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-center px-5 py-12"
    >
      <Link
        href="/"
        className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-white"
      >
        Nexa Audio
      </Link>
      <h1 className="mt-8 text-xl font-semibold text-white">התחברות</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        Google או קוד SMS. אפשר תמיד לקנות כאורח בלי התחברות.
      </p>

      {!configured ? (
        <div className="nexa-glass mt-8 space-y-3 p-4 text-sm text-[var(--color-text-muted)]">
          <p className="text-[var(--color-accent)]">
            {setup === "1"
              ? "האזור האישי נעול עד חיבור Supabase"
              : "מצב פיתוח — Supabase לא מוגדר"}
          </p>
          <p>
            העתיקו <bdi dir="ltr">.env.example</bdi> ל-<bdi dir="ltr">.env.local</bdi> והדביקו
            URL + anon key. הזמנות דמו לא חשופות לציבור.
          </p>
          <Link href="/checkout" className="nexa-btn-accent inline-flex">
            המשך לתשלום כאורח
          </Link>
        </div>
      ) : (
        <LoginForm nextPath={next} />
      )}

      <p className="mt-8 text-center text-xs text-[var(--color-text-faint)]">
        <Link href="/" className="text-[var(--color-accent)] hover:opacity-80">
          חזרה למוצר
        </Link>
      </p>
    </main>
  );
}
