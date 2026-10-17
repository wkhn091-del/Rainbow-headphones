import { PageShell } from "@/components/layout/PageShell";
import { WarrantyActivateForm } from "@/components/warranty/WarrantyActivateForm";

/** NFC / serial warranty activation shell — binds when Supabase live */
export default function WarrantyActivatePage() {
  return (
    <PageShell title="הפעלת אחריות">
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        סריקת NFC באריזה או הזנת Serial — מפעילים אחריות שנתיים ומקשרים לחשבון.
        בלי התשובה מהמחסן עדיין אפשר לבדוק את הטופס במצב דמו.
      </p>
      <div className="mt-8 max-w-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <WarrantyActivateForm />
      </div>
    </PageShell>
  );
}
