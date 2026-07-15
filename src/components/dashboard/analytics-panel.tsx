"use client";

import { Eye, MousePointerClick, TrendingUp, BarChart3 } from "lucide-react";
import { useEditor } from "./editor-context";
import { formatCount } from "@/lib/utils";

export function AnalyticsPanel() {
  const { profile, stats } = useEditor();
  const totalClicks = Object.values(stats.clicks).reduce((a, b) => a + b, 0);
  const ctr = stats.views > 0 ? Math.round((totalClicks / stats.views) * 100) : 0;

  const ranked = [...profile.links]
    .map((l) => ({ ...l, count: stats.clicks[l.id] ?? 0 }))
    .sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...ranked.map((l) => l.count));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Eye} label="Views" value={formatCount(stats.views)} />
        <Stat
          icon={MousePointerClick}
          label="Clicks"
          value={formatCount(totalClicks)}
        />
        <Stat icon={TrendingUp} label="CTR" value={`${ctr}%`} />
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <BarChart3 className="h-4 w-4 text-brand-300" />
          Clicks by link
        </h3>
        {ranked.length === 0 ? (
          <p className="rounded-xl border border-white/8 py-8 text-center text-sm text-white/40">
            Add links to start seeing analytics.
          </p>
        ) : (
          <div className="space-y-2.5">
            {ranked.map((l) => (
              <div
                key={l.id}
                className="rounded-xl border border-white/8 bg-white/[0.02] p-3"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate pr-2 text-white/80">
                    {l.title || "Untitled link"}
                  </span>
                  <span className="shrink-0 font-semibold text-white">
                    {formatCount(l.count)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="brand-gradient h-full rounded-full transition-all"
                    style={{ width: `${(l.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-white/35">
        Analytics update as visitors view your page and tap your links.
      </p>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <Icon className="h-4 w-4 text-brand-300" />
      <div className="mt-3 text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/45">{label}</div>
    </div>
  );
}
