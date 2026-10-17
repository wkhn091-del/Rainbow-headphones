import Link from "next/link";

type Props = {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
};

const SIZE_CLASS = {
  sm: "text-[1.05rem] tracking-[-0.06em]",
  md: "text-[1.35rem] tracking-[-0.07em]",
  lg: "text-[1.75rem] tracking-[-0.08em]",
} as const;

/** Luxury wordmark — Silent Gallery typography, not a raster stamp */
export function BrandMark({ size = "md", href = "/", className = "" }: Props) {
  const inner = (
    <span
      className={`group inline-flex items-baseline gap-2 ${className}`}
      aria-label="Nexa Audio"
    >
      <span
        className={`font-[family-name:var(--font-display)] font-semibold text-[var(--color-text)] ${SIZE_CLASS[size]}`}
      >
        NEXA
      </span>
      <span
        className="hidden h-px w-6 bg-[var(--color-accent)] transition-all duration-300 group-hover:w-9 sm:block"
        aria-hidden
      />
      <span className="hidden font-[family-name:var(--font-mono)] text-[9px] tracking-[0.28em] text-[var(--color-text-faint)] uppercase sm:inline">
        Audio
      </span>
    </span>
  );

  if (!href) return inner;
  return (
    <Link
      href={href}
      className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      {inner}
    </Link>
  );
}

export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-[family-name:var(--font-display)] font-semibold tracking-[-0.06em] text-white ${className}`}
    >
      NEXA
      <span className="mt-1 block h-px w-full max-w-[3.5rem] bg-[var(--color-accent)]" />
    </span>
  );
}
