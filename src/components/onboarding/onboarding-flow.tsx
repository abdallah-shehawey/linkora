"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, X, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { isUsernameAvailable, reserveAndCreateProfile } from "@/lib/db";
import { emptyProfile } from "@/lib/types";
import { slugifyUsername, USERNAME_RE, RESERVED_USERNAMES } from "@/lib/utils";

type Status = "idle" | "checking" | "available" | "taken" | "invalid";

export function OnboardingFlow() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  const [username, setUsername] = useState(() =>
    slugifyUsername(params.get("u") ?? ""),
  );
  const [name, setName] = useState(user?.displayName ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [saving, setSaving] = useState(false);

  const valid = useMemo(
    () =>
      username.length >= 3 &&
      USERNAME_RE.test(username) &&
      !RESERVED_USERNAMES.has(username),
    [username],
  );

  useEffect(() => {
    if (!username) return setStatus("idle");
    if (!valid) return setStatus("invalid");
    setStatus("checking");
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const ok = await isUsernameAvailable(username);
        if (!cancelled) setStatus(ok ? "available" : "taken");
      } catch {
        if (!cancelled) setStatus("idle");
      }
    }, 450);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [username, valid]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || status !== "available" || saving) return;
    setSaving(true);
    try {
      const profile = emptyProfile(user.uid, username, name || user.displayName || username);
      profile.avatarUrl = user.photoURL ?? "";
      await reserveAndCreateProfile(profile);
      await refreshProfile();
      toast.success("Your Linkora is live! 🎉");
      router.push("/dashboard");
    } catch (err) {
      const msg =
        err instanceof Error && err.message === "username-taken"
          ? "That handle was just taken — try another."
          : "Couldn't create your page. Try again.";
      toast.error(msg);
      setStatus("taken");
      setSaving(false);
    }
  };

  return (
    <div className="glass-strong w-full max-w-md rounded-3xl p-8 shadow-2xl shadow-black/40">
      <h1 className="text-2xl font-bold tracking-tight text-white">
        Claim your handle
      </h1>
      <p className="mt-1.5 text-sm text-white/50">
        This is your public Linkora address. You can change it later.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div>
          <Field label="Username">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-sm text-white/40">
                <AtSign className="mr-1 h-3.5 w-3.5" />
                linkora.app/
              </span>
              <Input
                value={username}
                onChange={(e) => setUsername(slugifyUsername(e.target.value))}
                className="pr-10 pl-[7.5rem]"
                placeholder="yourname"
                autoCapitalize="none"
                spellCheck={false}
                autoFocus
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <StatusIcon status={status} />
              </span>
            </div>
          </Field>
          <StatusHint status={status} username={username} />
        </div>

        <Field label="Display name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </Field>

        <Button
          type="submit"
          disabled={status !== "available" || saving}
          className="w-full"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create my page"}
        </Button>
      </form>
    </div>
  );
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "checking")
    return <Loader2 className="h-4 w-4 animate-spin text-white/40" />;
  if (status === "available")
    return <Check className="h-4 w-4 text-emerald-400" />;
  if (status === "taken" || status === "invalid")
    return <X className="h-4 w-4 text-red-400" />;
  return null;
}

function StatusHint({ status, username }: { status: Status; username: string }) {
  if (!username) return null;
  const map: Record<Status, { text: string; cls: string } | null> = {
    idle: null,
    checking: { text: "Checking availability…", cls: "text-white/40" },
    available: { text: "Nice — that handle is yours!", cls: "text-emerald-400" },
    taken: { text: "That handle is taken. Try another.", cls: "text-red-400" },
    invalid: {
      text: "Use 3–30 letters, numbers, dots or underscores.",
      cls: "text-amber-400",
    },
  };
  const hint = map[status];
  if (!hint) return null;
  return <p className={`mt-1.5 text-xs ${hint.cls}`}>{hint.text}</p>;
}
