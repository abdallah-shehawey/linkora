"use client";

import { useState } from "react";
import { THEMES } from "@/lib/themes";
import { demoWithTheme } from "@/lib/demo";
import { ProfileView } from "@/components/profile-view";
import { PhoneMockup } from "@/components/phone-mockup";
import { cn } from "@/lib/utils";

export function ThemeShowcase() {
  const [themeId, setThemeId] = useState(THEMES[0].id);

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div className="order-2 lg:order-1">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {THEMES.map((t) => {
            const active = t.id === themeId;
            return (
              <button
                key={t.id}
                onClick={() => setThemeId(t.id)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all",
                  active
                    ? "border-brand-400/60 ring-2 ring-brand-400/40"
                    : "border-white/10 hover:border-white/25",
                )}
              >
                <span
                  className="mb-3 block h-16 w-full rounded-xl"
                  style={{ background: t.swatch }}
                />
                <span className="text-sm font-semibold text-white">
                  {t.name}
                </span>
                <span className="block text-xs text-white/40">
                  {t.isDark ? "Dark" : "Light"}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-sm text-white/50">
          10 hand-crafted themes and counting — plus button shapes, highlights
          and custom colors. Your page, your vibe.
        </p>
      </div>

      <div className="order-1 flex justify-center lg:order-2">
        <PhoneMockup className="animate-float">
          <ProfileView profile={demoWithTheme(themeId)} preview />
        </PhoneMockup>
      </div>
    </div>
  );
}
