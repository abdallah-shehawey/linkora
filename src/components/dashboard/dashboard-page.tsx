"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Link2,
  Palette,
  BarChart3,
  Settings,
  Eye,
  Cloud,
  CloudUpload,
  Check,
  Share2,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth-context";
import { RequireAuth } from "@/components/auth/require-auth";
import { EditorProvider, useEditor } from "./editor-context";
import { ProfileEditor } from "./profile-editor";
import { LinksEditor } from "./links-editor";
import { SocialsEditor } from "./socials-editor";
import { DesignEditor } from "./design-editor";
import { AnalyticsPanel } from "./analytics-panel";
import { SettingsEditor } from "./settings-editor";
import { LivePreview } from "./live-preview";
import { cn } from "@/lib/utils";

type Tab = "links" | "design" | "analytics" | "settings";

const TABS: { id: Tab; label: string; icon: typeof Link2 }[] = [
  { id: "links", label: "Links", icon: Link2 },
  { id: "design", label: "Design", icon: Palette },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function DashboardPage() {
  return (
    <RequireAuth requireProfile>
      <DashboardInner />
    </RequireAuth>
  );
}

function DashboardInner() {
  const { profile } = useAuth();
  if (!profile) return null;
  return (
    <EditorProvider initial={profile}>
      <DashboardShell />
    </EditorProvider>
  );
}

function DashboardShell() {
  const { profile } = useEditor();
  const [tab, setTab] = useState<Tab>("links");
  const [mobilePreview, setMobilePreview] = useState(false);

  return (
    <div className="min-h-dvh">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
          <SaveStatus />
          <Link
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View site</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Editor column */}
        <div>
          {/* Tabs */}
          <div className="mb-6 flex gap-1 rounded-2xl border border-white/8 bg-white/[0.02] p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  tab === t.id
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/50 hover:text-white/80",
                )}
              >
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="animate-fade-in" key={tab}>
            {tab === "links" && (
              <div className="space-y-6">
                <ProfileEditor />
                <Section title="Social icons">
                  <SocialsEditor />
                </Section>
                <Section title="Links">
                  <LinksEditor />
                </Section>
              </div>
            )}
            {tab === "design" && <DesignEditor />}
            {tab === "analytics" && <AnalyticsPanel />}
            {tab === "settings" && <SettingsEditor />}
          </div>
        </div>

        {/* Preview column (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <LivePreview />
          </div>
        </aside>
      </div>

      {/* Mobile preview trigger */}
      <button
        onClick={() => setMobilePreview(true)}
        className="brand-gradient fixed bottom-6 right-6 z-40 flex h-14 items-center gap-2 rounded-full px-5 font-semibold text-white shadow-xl shadow-brand-600/40 lg:hidden"
      >
        <Share2 className="h-5 w-5" />
        Preview
      </button>

      {/* Mobile preview overlay */}
      {mobilePreview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink-950/95 backdrop-blur-xl lg:hidden">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobilePreview(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-1 items-start justify-center overflow-y-auto pb-10">
            <LivePreview />
          </div>
        </div>
      )}
    </div>
  );
}

function SaveStatus() {
  const { saveState } = useEditor();
  const map = {
    saved: { icon: Check, text: "Saved", cls: "text-emerald-400" },
    saving: { icon: CloudUpload, text: "Saving…", cls: "text-brand-300" },
    dirty: { icon: Cloud, text: "Unsaved", cls: "text-white/40" },
  } as const;
  const s = map[saveState];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        s.cls,
      )}
    >
      <s.icon className={cn("h-3.5 w-3.5", saveState === "saving" && "animate-pulse")} />
      <span className="hidden sm:inline">{s.text}</span>
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}
