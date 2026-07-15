import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A realistic phone frame that clips its children (a ProfileView). */
export function PhoneMockup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[9/19] w-[280px] rounded-[2.6rem] border-[6px] border-ink-700 bg-ink-950 p-1.5 shadow-2xl shadow-black/60",
        className,
      )}
    >
      {/* Side buttons */}
      <span className="absolute -left-[8px] top-24 h-12 w-[3px] rounded-full bg-ink-700" />
      <span className="absolute -left-[8px] top-40 h-16 w-[3px] rounded-full bg-ink-700" />
      <span className="absolute -right-[8px] top-32 h-20 w-[3px] rounded-full bg-ink-700" />

      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem]">
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-ink-950" />
        <div className="h-full w-full overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
}
