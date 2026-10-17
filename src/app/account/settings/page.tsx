import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export default async function SettingsPage() {
  await connection();
  const { configured } = getSupabaseEnv();
  const supabase = configured ? await createClient() : null;
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  return (
    <section>
      <h1 className="text-2xl font-semibold">הגדרות</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        שינוי מייל או טלפון ידרוש אימות מחדש (step-up).
      </p>

      <div className="nexa-glass mt-8 space-y-3 p-4 text-sm">
        <p>
          <span className="text-[var(--color-text-faint)]">מייל</span>
          <br />
          <bdi dir="ltr">{user?.email ?? "— (דמו / לא מחובר)"}</bdi>
        </p>
        <p>
          <span className="text-[var(--color-text-faint)]">טלפון</span>
          <br />
          <bdi dir="ltr">{user?.phone ?? "—"}</bdi>
        </p>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-[var(--color-text-faint)]">
        מחיקת חשבון: פנו ל-
        <a className="text-[var(--color-accent)]" href="mailto:support@nexaaudio.local">
          support@
        </a>{" "}
        או דרך תהליך מחיקה עצמית שיופעל אחרי חיבור מלא.
      </p>
    </section>
  );
}
