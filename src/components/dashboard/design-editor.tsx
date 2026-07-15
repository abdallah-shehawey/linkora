"use client";

import { Check } from "lucide-react";
import { useEditor } from "./editor-context";
import { THEMES, BUTTON_STYLES } from "@/lib/themes";
import type { ButtonStyle } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DesignEditor() {
  const { profile, patch } = useEditor();

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-sm font-semibold text-white">Theme</h3>
        <p className="mb-4 text-xs text-white/45">
          Pick a palette — your preview updates instantly.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {THEMES.map((t) => {
            const active = profile.themeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => patch({ themeId: t.id })}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border p-3 text-left transition-all",
                  active
                    ? "border-brand-400/60 ring-2 ring-brand-400/40"
                    : "border-white/10 hover:border-white/25",
                )}
              >
                <span
                  className="mb-2.5 flex h-14 w-full items-center justify-center rounded-xl"
                  style={{ background: t.swatch }}
                >
                  {active && (
                    <Check className="h-5 w-5 text-white drop-shadow" />
                  )}
                </span>
                <span className="text-xs font-semibold text-white">
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-white">Button style</h3>
        <p className="mb-4 text-xs text-white/45">
          Shape and treatment for your link buttons.
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {(Object.keys(BUTTON_STYLES) as ButtonStyle[]).map((style) => {
            const active = profile.buttonStyle === style;
            const meta = BUTTON_STYLES[style];
            return (
              <button
                key={style}
                onClick={() => patch({ buttonStyle: style })}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                  active
                    ? "border-brand-400/60 bg-brand-500/10"
                    : "border-white/10 hover:border-white/25",
                )}
              >
                <span
                  className="h-7 w-full border border-white/25 bg-white/10"
                  style={{
                    borderRadius: meta.radius,
                    boxShadow:
                      meta.extra === "hard"
                        ? "3px 3px 0 0 rgba(255,255,255,0.4)"
                        : meta.extra === "shadow"
                          ? "0 6px 14px -6px rgba(0,0,0,0.6)"
                          : undefined,
                    background: meta.extra === "outline" ? "transparent" : undefined,
                  }}
                />
                <span className="text-[11px] font-medium text-white/70">
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
