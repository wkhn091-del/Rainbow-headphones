/**
 * Breath chapter between two pins (book rule: never stack pins).
 * Psychology: P07 continuity + P18 honest scarcity tease — no fake stats.
 */
export function ScrollDwell() {
  return (
    <section
      className="relative z-[2] border-y border-white/8 bg-[#0c0c0c] px-5 py-20 sm:px-8 sm:py-28"
      aria-label="מעבר"
      data-depth="bone"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.32em] text-[var(--color-accent)] uppercase">
          אחרי הסינמה
        </p>
        <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(1.6rem,4.5vw,2.4rem)] leading-[1.15] font-semibold tracking-[-0.035em] text-white">
          עכשיו האוזנייה נכנסת למרחב שלכם
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--color-text-muted)]">
          גללו לאט. המודל יורד עם היד — לא רץ קדימה. מה שרואים בגלילה הוא מה שמגיע
          בקופסה.
        </p>
      </div>
    </section>
  );
}
