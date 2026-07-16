"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEditor } from "./editor-context";
import { SOCIALS, SOCIAL_PLATFORMS } from "@/components/social-icons";
import type { SocialPlatform } from "@/lib/types";

export function SocialsEditor() {
  const { profile, addSocial, updateSocial, removeSocial } = useEditor();
  const [picking, setPicking] = useState(false);

  return (
    <div className="space-y-3">
      {profile.socials.map((s, i) => {
        const meta = SOCIALS[s.platform];
        const Icon = meta.Icon;
        return (
          <div
            key={`${s.platform}-${i}`}
            className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] p-2.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/6 text-white/80">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <Input
                value={s.label ?? ""}
                onChange={(e) => updateSocial(i, { label: e.target.value })}
                placeholder={`Account name (e.g. shown as "${meta.label}")`}
                className="h-8 border-0 bg-transparent px-1 text-sm focus:ring-0"
                spellCheck={false}
              />
              <Input
                value={s.url}
                onChange={(e) => updateSocial(i, { url: e.target.value })}
                placeholder={meta.placeholder}
                className="h-8 border-0 bg-transparent px-1 text-xs text-white/60 focus:ring-0"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>
            <button
              onClick={() => removeSocial(i)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/30 hover:bg-red-500/10 hover:text-red-400"
              aria-label={`Remove ${meta.label}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      <div className="relative">
        <button
          onClick={() => setPicking((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/12 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
        >
          <Plus className="h-4 w-4" />
          Add account
        </button>
        {picking && (
          <div className="glass-strong absolute inset-x-0 top-full z-20 mt-1 rounded-xl p-2">
            <div className="grid grid-cols-4 gap-1">
              {SOCIAL_PLATFORMS.map((p) => {
                const meta = SOCIALS[p as SocialPlatform];
                const Icon = meta.Icon;
                return (
                  <button
                    key={p}
                    onClick={() => {
                      addSocial(p as SocialPlatform);
                      setPicking(false);
                    }}
                    className="flex flex-col items-center gap-1 rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px]">{meta.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 px-1 text-center text-[10px] text-white/35">
              You can add the same platform more than once.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
