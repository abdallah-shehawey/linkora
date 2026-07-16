import Link from "next/link";
import {
  Palette,
  BarChart3,
  Zap,
  GripVertical,
  Sparkles,
  Globe,
  Check,
  X,
  MousePointerClick,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { AuroraBg } from "@/components/marketing/aurora-bg";
import { ClaimHandle } from "@/components/marketing/claim-handle";
import { ThemeShowcase } from "@/components/marketing/theme-showcase";
import { LiveStats, CreatorsLine } from "@/components/marketing/live-stats";
import { PhoneMockup } from "@/components/phone-mockup";
import { ProfileView } from "@/components/profile-view";
import { Logo } from "@/components/logo";
import { DEMO_PROFILE } from "@/lib/demo";
import { SITE_HOST } from "@/lib/site";

const FEATURES = [
  {
    icon: Palette,
    title: "Themes that actually look designed",
    body: "Ten hand-crafted themes, custom button shapes, highlights and colors. No cookie-cutter pages.",
  },
  {
    icon: BarChart3,
    title: "Analytics you'll understand",
    body: "See views and clicks per link in real time. Know exactly what your audience taps.",
  },
  {
    icon: GripVertical,
    title: "Drag, drop, done",
    body: "Reorder links with a buttery drag-and-drop. Changes go live the instant you save.",
  },
  {
    icon: Zap,
    title: "Blazing fast pages",
    body: "Built on Next.js. Your page loads in a blink — even on shaky mobile data.",
  },
  {
    icon: Globe,
    title: "Your own handle",
    body: `Claim ${SITE_HOST}/you. One clean link for every bio, everywhere.`,
  },
  {
    icon: ShieldCheck,
    title: "100% free, forever",
    body: "Every feature, every theme, all your analytics — free. No paid tiers, no watermarks, no surprises.",
  },
];

const STEPS = [
  { n: "01", title: "Claim your handle", body: "Pick your username and create an account in seconds." },
  { n: "02", title: "Add your links", body: "Drop in links, socials and a bio. Pick a theme you love." },
  { n: "03", title: "Share everywhere", body: "Put one Linkora link in every bio and watch the clicks roll in." },
];

const COMPARE = [
  { label: "Modern, designer-made themes", us: true, them: false },
  { label: "Per-link click analytics", us: true, them: false },
  { label: "Everything free — no paid tiers", us: true, them: false },
  { label: "No forced watermark", us: true, them: false },
  { label: "Custom button shapes & highlights", us: true, them: true },
  { label: "Drag-and-drop reordering", us: true, them: true },
  { label: "Lightning-fast page loads", us: true, them: false },
];

export default function Home() {
  return (
    <div className="relative">
      <Navbar />

      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44">
        <AuroraBg />
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="animate-fade-up min-w-0">
              <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-white/70">
                <Sparkles className="h-3.5 w-3.5 text-brand-300" />
                The modern link-in-bio · now in beta
              </span>

              <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                One link for{" "}
                <span className="gradient-text">everything</span> you are.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
                Linkora turns all your links into one stunning, professional
                page — with themes, real analytics and your own handle. Built
                for creators who want to stand out.
              </p>

              <div className="mt-8">
                <ClaimHandle />
                <p className="mt-3 text-sm text-white/40">
                  Free forever · No credit card · Live in 2 minutes
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["#0891b2", "#0ea5e9", "#06b6d4", "#22d3ee", "#67e8f9"].map(
                    (c) => (
                      <span
                        key={c}
                        className="h-8 w-8 rounded-full border-2 border-ink-950"
                        style={{ background: c }}
                      />
                    ),
                  )}
                </div>
                <CreatorsLine />
              </div>
            </div>

            <div className="animate-scale-in flex min-w-0 justify-center">
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-full bg-brand-600/20 blur-3xl" />
                <PhoneMockup className="animate-float">
                  <ProfileView profile={DEMO_PROFILE} preview />
                </PhoneMockup>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ STATS (live) ============================ */}
      <LiveStats />

      {/* ============================ FEATURES ============================ */}
      <section id="features" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to convert a bio into clicks"
            subtitle="The essentials done beautifully — plus the details other tools charge you for."
          />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] p-6 transition-all hover:border-white/16 hover:bg-white/[0.04]"
              >
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand-600/10 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="brand-gradient inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg shadow-brand-600/25">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ THEMES ============================ */}
      <section id="themes" className="relative overflow-hidden py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-900/10 to-transparent" />
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Themes"
            title="Pick a look. Make it yours."
            subtitle="Tap a theme and watch the page transform. This is the same live preview you get in the editor."
          />
          <div className="mt-14">
            <ThemeShowcase />
          </div>
        </div>
      </section>

      {/* ============================ COMPARE ============================ */}
      <section id="compare" className="relative py-24">
        <div className="mx-auto max-w-4xl px-4">
          <SectionHeading
            eyebrow="Why Linkora"
            title="The link-in-bio, leveled up"
            subtitle="We kept what works about the others — and fixed what doesn't."
          />
          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-semibold sm:gap-4 sm:px-6">
              <span className="text-white/50">Feature</span>
              <span className="flex w-12 justify-center text-white sm:w-20">
                <Logo showText={false} />
              </span>
              <span className="w-12 text-center text-white/40 sm:w-20">
                Others
              </span>
            </div>
            {COMPARE.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-white/5 px-4 py-4 text-sm last:border-0 sm:gap-4 sm:px-6"
              >
                <span className="text-white/80">{row.label}</span>
                <span className="flex w-12 justify-center sm:w-20">
                  <Badge ok={row.us} />
                </span>
                <span className="flex w-12 justify-center sm:w-20">
                  <Badge ok={row.them} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="How it works"
            title="From zero to live in three steps"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="relative rounded-3xl border border-white/8 bg-white/[0.02] p-7"
              >
                <span className="gradient-text text-5xl font-bold">{s.n}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CTA ============================ */}
      <section className="relative overflow-hidden py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 px-6 py-16 text-center sm:px-16">
            <div className="brand-gradient absolute inset-0 -z-10 opacity-20" />
            <AuroraBg />
            <MousePointerClick className="mx-auto h-10 w-10 text-brand-300" />
            <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Your link is waiting.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/60">
              Grab your handle before someone else does. It&apos;s free, and it
              takes two minutes.
            </p>
            <div className="mt-8 flex justify-center">
              <ClaimHandle />
            </div>
          </div>
        </div>
      </section>

      {/* ============================ FOOTER ============================ */}
      <footer className="border-t border-white/8 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row">
          <Logo />
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#themes" className="hover:text-white">Themes</a>
            <a href="#compare" className="hover:text-white">Why Linkora</a>
            <Link href="/login" className="hover:text-white">Log in</Link>
          </nav>
          <p className="text-sm text-white/35">
            © {new Date().getFullYear()} Linkora
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---------------------------------- bits ---------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-wider text-brand-300">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-white/55">{subtitle}</p>}
    </div>
  );
}

function Badge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">
      <Check className="h-4 w-4" />
    </span>
  ) : (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-white/30">
      <X className="h-4 w-4" />
    </span>
  );
}

