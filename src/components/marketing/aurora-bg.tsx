/** Decorative animated gradient blobs + dotted grid for dark sections. */
export function AuroraBg() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-[0.35]" />
      <div className="animate-aurora absolute -top-40 left-1/4 h-[38rem] w-[38rem] rounded-full bg-brand-600/30 blur-[120px]" />
      <div
        className="animate-aurora absolute -top-20 right-1/4 h-[32rem] w-[32rem] rounded-full bg-accent-500/25 blur-[120px]"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="animate-aurora absolute top-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-brand-400/20 blur-[130px]"
        style={{ animationDelay: "-12s" }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}
