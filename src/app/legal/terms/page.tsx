import { PageShell } from "@/components/layout/PageShell";

export default function TermsPage() {
  return (
    <PageShell title="תקנון והחזרות">
      <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
        <p>טיוטה משפטית — גוף מלא לפני השקה עם עורך דין.</p>
        <ul className="list-disc space-y-2 ps-5">
          <li>החזרה: 14 יום באריזה מקורית.</li>
          <li>אחריות: שנתיים חלופי-עד-הבית.</li>
          <li>LAUNCH15: 15% על הזוג הראשון בלבד + נרתיק.</li>
          <li>מקסימום 2 זוגות להזמנה.</li>
        </ul>
      </div>
    </PageShell>
  );
}
