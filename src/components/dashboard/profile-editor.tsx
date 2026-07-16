"use client";

import { useEditor } from "./editor-context";
import { Input, Textarea, Field } from "@/components/ui/input";
import { initialsOf } from "@/lib/utils";

const BIO_MAX = 160;

export function ProfileEditor() {
  const { profile, patch } = useEditor();

  return (
    <div className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-400/40">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="brand-gradient flex h-full w-full items-center justify-center text-lg font-bold text-white">
              {initialsOf(profile.displayName || profile.username)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Field label="Avatar URL" hint="paste an image link">
            <Input
              value={profile.avatarUrl}
              onChange={(e) => patch({ avatarUrl: e.target.value })}
              placeholder="https://…/photo.jpg"
              className="h-10"
              autoCapitalize="none"
              spellCheck={false}
            />
          </Field>
        </div>
      </div>

      <Field label="Display name">
        <Input
          value={profile.displayName}
          onChange={(e) => patch({ displayName: e.target.value })}
          placeholder="Your name"
        />
      </Field>

      <Field label="Bio" hint={`${profile.bio.length}/${BIO_MAX}`}>
        <Textarea
          value={profile.bio}
          onChange={(e) => patch({ bio: e.target.value.slice(0, BIO_MAX) })}
          placeholder="A line about you…"
          rows={2}
        />
      </Field>
    </div>
  );
}
