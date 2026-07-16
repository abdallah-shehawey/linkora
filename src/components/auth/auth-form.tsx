"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

const FIREBASE_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/invalid-email": "That email doesn't look right.",
  "auth/user-not-found": "No account with that email.",
  "auth/wrong-password": "Wrong email or password.",
  "auth/email-already-in-use": "That email is already registered — try logging in.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  "auth/too-many-requests": "Too many attempts. Try again in a bit.",
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.1 14.7 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c5.9 0 9.8-4.1 9.8-9.9 0-.7-.1-1.2-.2-1.7H12z"
      />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { user, profile, loading, signInEmail, signUpEmail, signInGoogle } =
    useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const presetUsername = params.get("u") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"email" | "google" | null>(null);

  // Already signed in (persisted session)? Skip the form entirely.
  // `busy` guards the in-flight flows, which navigate themselves and may
  // need to keep the ?u= preset.
  useEffect(() => {
    if (loading || busy || !user) return;
    router.replace(profile ? "/dashboard" : "/onboarding");
  }, [loading, busy, user, profile, router]);

  const isSignup = mode === "signup";
  const afterAuth = isSignup
    ? `/onboarding${presetUsername ? `?u=${encodeURIComponent(presetUsername)}` : ""}`
    : "/dashboard";

  const handleError = (err: unknown) => {
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code: string }).code)
        : "";
    toast.error(FIREBASE_ERRORS[code] ?? "Something went wrong. Try again.");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy("email");
    try {
      if (isSignup) {
        await signUpEmail(email, password, name);
      } else {
        await signInEmail(email, password);
      }
      router.push(afterAuth);
    } catch (err) {
      handleError(err);
      setBusy(null);
    }
  };

  const google = async () => {
    setBusy("google");
    try {
      await signInGoogle();
      router.push(afterAuth);
    } catch (err) {
      handleError(err);
      setBusy(null);
    }
  };

  return (
    <div className="glass-strong w-full max-w-md rounded-3xl p-8 shadow-2xl shadow-black/40">
      <h1 className="text-2xl font-bold tracking-tight text-white">
        {isSignup ? "Create your Linkora" : "Welcome back"}
      </h1>
      <p className="mt-1.5 text-sm text-white/50">
        {isSignup
          ? "Claim your handle and start building in minutes."
          : "Log in to manage your links."}
      </p>

      <button
        onClick={google}
        disabled={!!busy}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-white/12 bg-white/5 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
      >
        {busy === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-white/30">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {isSignup && (
          <Field label="Name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </Field>
        )}
        <Field label="Email">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
        </Field>

        <Button type="submit" disabled={!!busy} className="w-full" size="md">
          {busy === "email" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSignup ? (
            "Create account"
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        {isSignup ? "Already have an account? " : "New to Linkora? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-brand-300 hover:text-brand-200"
        >
          {isSignup ? "Log in" : "Create one free"}
        </Link>
      </p>
    </div>
  );
}
