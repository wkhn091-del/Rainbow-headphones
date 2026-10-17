import { PageShell } from "@/components/layout/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell title="מדיניות פרטיות">
      <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
        <p>
          מדיניות זו נכתבת בהתאם לתיקון 13 לחוק הגנת הפרטיות. טיוטה מורחבת לפני
          השקה מלאה.
        </p>
        <p>
          מעבדים נתונים ב-Supabase, Resend, Twilio וסולק התשלומים. פרטי אשראי לא
          נשמרים אצלנו. אנליטיקס (GA4 / Pixel / Clarity) רק אחרי הסכמת עוגיות.
        </p>
      </div>
    </PageShell>
  );
}
