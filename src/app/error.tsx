"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[60dvh] max-w-md flex-col justify-center px-6 py-16 text-center"
    >
      <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--color-text-faint)] uppercase">
        Error
      </p>
      <h1 className="mt-3 text-2xl tracking-[-0.03em] text-[var(--color-text)]">
        משהו השתבש
      </h1>
      <p className="mt-3 text-sm text-[var(--color-text-muted)]">
        אפשר לנסות שוב. אם זה חוזר — כתבו למייל התמיכה.
      </p>
      {error.digest ? (
        <p
          className="mt-2 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-faint)]"
          dir="ltr"
        >
          {error.digest}
        </p>
      ) : null}
      <button type="button" onClick={reset} className="nexa-btn-buy mt-8">
        נסו שוב
      </button>
    </main>
  );
}
