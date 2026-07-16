"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, LogOut, X } from "lucide-react";
import { Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditor } from "./editor-context";
import { useAuth } from "@/lib/auth-context";
import { changeUsername, isUsernameAvailable } from "@/lib/db";
import { slugifyUsername, USERNAME_RE, RESERVED_USERNAMES } from "@/lib/utils";
import { siteHost } from "@/lib/site";
import { useSiteHost } from "@/lib/use-site-host";

type Status = "idle" | "checking" | "available" | "taken" | "invalid";

export function SettingsEditor() {
  const { profile, patch } = useEditor();
  const { user, signOut, refreshProfile } = useAuth();
  const host = useSiteHost();
  const [draft, setDraft] = useState(profile.username);
  // Result of the last async availability check, keyed by the handle checked.
  const [checked, setChecked] = useState<{ name: string; ok: boolean } | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  const changed = draft !== profile.username;
  const valid = useMemo(
    () =>
      draft.length >= 3 &&
      USERNAME_RE.test(draft) &&
      !RESERVED_USERNAMES.has(draft),
    [draft],
  );

  // Status is derived: only the debounced check writes state.
  const status: Status = !changed
    ? "idle"
    : !valid
      ? "invalid"
      : checked?.name === draft
        ? checked.ok
          ? "available"
          : "taken"
        : "checking";

  useEffect(() => {
    if (!changed || !valid) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const ok = await isUsernameAvailable(draft);
        if (!cancelled) setChecked({ name: draft, ok });
      } catch {
        /* stay in "checking"; a later edit retriggers the check */
      }
    }, 450);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [draft, changed, valid]);

  const saveUsername = async () => {
    if (status !== "available" || saving) return;
    setSaving(true);
    try {
      await changeUsername(profile.uid, profile.username, draft);
      // patch() makes `changed` false, so the derived status returns to idle.
      patch({ username: draft });
      await refreshProfile();
      toast.success(`You're now ${siteHost()}/${draft}`);
    } catch (err) {
      const taken = err instanceof Error && err.message === "username-taken";
      toast.error(taken ? "That handle is taken." : "Couldn't change handle.");
      if (taken) setChecked({ name: draft, ok: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-sm font-semibold text-white">Your handle</h3>
        <p className="mb-3 text-xs text-white/45">
          Changing this updates your public URL.
        </p>
        <Field label="Username">
          <div className="flex h-11 items-center rounded-xl border border-white/10 bg-white/5 pr-3.5 transition-colors focus-within:border-brand-400/60 focus-within:bg-white/8 focus-within:ring-2 focus-within:ring-brand-400/20">
            <span className="shrink-0 pl-3.5 text-xs text-white/40 sm:text-sm">
              {host}/
            </span>
            <input
              value={draft}
              onChange={(e) => setDraft(slugifyUsername(e.target.value))}
              size={1}
              className="h-full w-0 min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-white/30"
              autoCapitalize="none"
              spellCheck={false}
            />
            <span className="shrink-0">
              {status === "checking" && (
                <Loader2 className="h-4 w-4 animate-spin text-white/40" />
              )}
              {status === "available" && (
                <Check className="h-4 w-4 text-emerald-400" />
              )}
              {(status === "taken" || status === "invalid") && (
                <X className="h-4 w-4 text-red-400" />
              )}
            </span>
          </div>
        </Field>
        {changed && (
          <Button
            onClick={saveUsername}
            disabled={status !== "available" || saving}
            size="sm"
            className="mt-3"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save handle"}
          </Button>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-white">Account</h3>
        <div className="mt-3 space-y-3">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm">
            <span className="text-white/45">Signed in as</span>
            <div className="font-medium text-white">{user?.email}</div>
          </div>
          <Button variant="danger" onClick={() => signOut()} className="w-full">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </section>
    </div>
  );
}
