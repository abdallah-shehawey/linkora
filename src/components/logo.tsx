import { cn } from "@/lib/utils";

/** The Linkora mark: two interlocking rounded links in the brand gradient. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-xl brand-gradient shadow-lg shadow-brand-600/30",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="white"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12a3 3 0 0 1 3-3h3a3 3 0 0 1 0 6h-1" />
        <path d="M15 12a3 3 0 0 1-3 3H9a3 3 0 0 1 0-6h1" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showText && (
        <span className="text-lg font-semibold tracking-tight text-white">
          Linkora
        </span>
      )}
    </span>
  );
}
