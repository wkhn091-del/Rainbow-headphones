import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { getSessionUserId } from "@/lib/account/orders";

export default async function AddressesPage() {
  await connection();
  const { configured } = getSupabaseEnv();

  if (!configured) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">כתובות</h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          מצב דמו — אחרי חיבור Supabase אפשר לשמור כתובות למשלוח.
        </p>
        <div className="nexa-glass mt-6 p-4 text-sm text-[var(--color-text-faint)]">
          תל אביב · רחוב הדגמה 1 (דמו)
        </div>
      </section>
    );
  }

  const supabase = await createClient();
  const userId = await getSessionUserId();
  const { data: addresses } =
    supabase && userId
      ? await supabase
          .from("addresses")
          .select("id, label, city, street, house_number, is_default")
          .eq("user_id", userId)
          .order("is_default", { ascending: false })
      : { data: [] };

  return (
    <section>
      <h1 className="text-2xl font-semibold">כתובות</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        כתובת ברירת מחדל למשלוחים עתידיים. שינוי דורש אימות מחדש.
      </p>
      {!addresses?.length ? (
        <p className="mt-10 text-sm text-[var(--color-text-faint)]">
          אין כתובות שמורות. אפשר להוסיף בצ׳קאאוט הבא.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {addresses.map((a) => (
            <li key={a.id} className="nexa-glass p-4 text-sm">
              <p className="text-white">
                {a.label ?? "כתובת"}
                {a.is_default ? (
                  <span className="mr-2 text-[10px] text-[var(--color-accent)]">ברירת מחדל</span>
                ) : null}
              </p>
              <p className="mt-1 text-[var(--color-text-muted)]">
                {a.city}, {a.street}
                {a.house_number ? ` ${a.house_number}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
