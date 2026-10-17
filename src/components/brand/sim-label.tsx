/** Script rule 13 — mark non-real product photography */
export function SimLabel({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-[family-name:var(--font-mono)] text-[9px] tracking-[0.2em] text-white/55 uppercase ${className}`}
    >
      הדמיה
    </span>
  );
}
