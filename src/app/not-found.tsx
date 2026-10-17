import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[60dvh] max-w-md flex-col justify-center px-6 py-16 text-center"
    >
      <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--color-text-faint)] uppercase">
        404
      </p>
      <h1 className="mt-3 text-2xl tracking-[-0.03em] text-[var(--color-text)]">
        העמוד לא נמצא
      </h1>
      <p className="mt-3 text-sm text-[var(--color-text-muted)]">
        חזרו לבית או לחנות.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="nexa-btn-buy">
          בית
        </Link>
        <Link href="/shop" className="nexa-btn-accent">
          חנות
        </Link>
      </div>
    </main>
  );
}
