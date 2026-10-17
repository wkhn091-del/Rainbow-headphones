import { PageShell } from "@/components/layout/PageShell";

export default function AccessibilityPage() {
  return (
    <PageShell title="הצהרת נגישות">
      <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
        <p>
          האתר שואף לעמוד בת״י 5568 ברמת AA. רכז נגישות: אבישי. פרטי קשר יושלמו לפני
          השקה.
        </p>
        <p>
          בתחתית המסך זמין תפריט נגישות (טקסט גדול, ניגודיות גבוהה, הפחתת תנועה).
          הווידג׳ט משלים — לא מחליף — נגישות בקוד (כותרות, מיקוד מקלדת, RTL, skip
          link).
        </p>
        <ul className="list-disc pe-5 space-y-1">
          <li>ניווט מקלדת ו-skip לתוכן ראשי</li>
          <li>תוויות לטפסים ולדיאלוג checkout</li>
          <li>כיבוד prefers-reduced-motion + העדפת תפריט</li>
        </ul>
      </div>
    </PageShell>
  );
}
