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
  ArrowRight,
  MousePointerClick,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { AuroraBg } from "@/components/marketing/aurora-bg";
import { ClaimHandle } from "@/components/marketing/claim-handle";
import { ThemeShowcase } from "@/components/marketing/theme-showcase";
import { PhoneMockup } from "@/components/phone-mockup";
import { ProfileView } from "@/components/profile-view";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { DEMO_PROFILE } from "@/lib/demo";

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
    body: "Claim linkora.app/you. One clean link for every bio, everywhere.",
  },
  {
    icon: ShieldCheck,
    title: "Yours, forever free",
    body: "The core is free with no watermarks holding your page hostage. Upgrade only if you want more.",
  },
];

const STEPS = [
  { n: "01", title: "Claim your handle", body: "Pick your username and create an account in seconds." },
  { n: "02", title: "Add your links", body: "Drop in links, socials and a bio. Pick a theme you love." },
  { n: "03", title: "Share everywhere", body: "Put one Linkora link in every bio and watch the clicks roll in." },
];

const COMPARE = [
  { label: "Modern, designer-made themes", us: true, them: false },
  { label: "Per-link click analytics (free)", us: true, them: false },
  { label: "No forced watermark on free plan", us: true, them: false },
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
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-fade-up">
              <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-white/70">
                <Sparkles className="h-3.5 w-3.5 text-brand-300" />
                The modern link-in-bio · now in beta
              </span>

              <h1 className="mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
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
                  {["#7c3aed", "#ec4899", "#0ea5e9", "#f97316", "#22c55e"].map(
                    (c) => (
                      <span
                        key={c}
                        className="h-8 w-8 rounded-full border-2 border-ink-950"
                        style={{ background: c }}
                      />
                    ),
                  )}
                </div>
                <p className="text-sm text-white/50">
                  <span className="font-semibold text-white">2,000+</span>{" "}
                  creators already building
                </p>
              </div>
            </div>

            <div className="animate-scale-in flex justify-center">
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

      {/* ============================ STATS ============================ */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-4">
          {[
            { k: "2,000+", v: "Creators" },
            { k: "10", v: "Themes" },
            { k: "1.4M", v: "Link clicks" },
            { k: "< 1s", v: "Page load" },
          ].map((s) => (
            <div key={s.v} className="text-center">
              <div className="text-3xl font-bold text-white sm:text-4xl">
                {s.k}
              </div>
              <div className="mt-1 text-sm text-white/45">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

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
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-semibold">
              <span className="text-white/50">Feature</span>
              <span className="flex w-20 justify-center text-white">
                <Logo showText={false} />
              </span>
              <span className="w-20 text-center text-white/40">Others</span>
            </div>
            {COMPARE.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-white/5 px-6 py-4 text-sm last:border-0"
              >
                <span className="text-white/80">{row.label}</span>
                <span className="flex w-20 justify-center">
                  <Badge ok={row.us} />
                </span>
                <span className="flex w-20 justify-center">
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

      {/* ============================ PRICING ============================ */}
      <section id="pricing" className="relative py-24">
        <div className="mx-auto max-w-4xl px-4">
          <SectionHeading
            eyebrow="Pricing"
            title="Start free. Upgrade when you're ready."
            subtitle="No watermark tax. No paywall on the basics."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <PriceCard
              name="Free"
              price="$0"
              tagline="Everything you need to launch."
              cta="Get started"
              href="/signup"
              features={[
                "Your linkora.app handle",
                "Unlimited links",
                "All 10 themes",
                "Basic click analytics",
                "No watermark",
              ]}
            />
            <PriceCard
              featured
              name="Pro"
              price="$5"
              period="/mo"
              tagline="For creators who mean business."
              cta="Go Pro"
              href="/signup"
              features={[
                "Everything in Free",
                "Advanced analytics & CSV export",
                "Custom domain",
                "Scheduled & featured links",
                "Priority support",
              ]}
            />
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
            <a href="#pricing" className="hover:text-white">Pricing</a>
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

function PriceCard({
  name,
  price,
  period,
  tagline,
  features,
  cta,
  href,
  featured,
}: {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-8 ${
        featured
          ? "border-brand-400/40 bg-brand-600/[0.06] glow"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      {featured && (
        <span className="brand-gradient absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold text-white">
          Most popular
        </span>
      )}
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="mt-1 text-sm text-white/50">{tagline}</p>
      <div className="mt-5 flex items-end gap-1">
        <span className="text-4xl font-bold text-white">{price}</span>
        {period && <span className="pb-1 text-white/40">{period}</span>}
      </div>
      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
            <Check className="h-4 w-4 shrink-0 text-brand-300" />
            {f}
          </li>
        ))}
      </ul>
      <ButtonLink
        href={href}
        variant={featured ? "primary" : "secondary"}
        className="mt-8 w-full"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </ButtonLink>
    </div>
  );
}
