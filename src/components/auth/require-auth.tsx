"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

function FullscreenSpinner() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-white/40" />
    </div>
  );
}

/** Shown when Firebase env vars are missing so the app fails gracefully. */
export function NotConfigured() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-3xl p-8 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-400" />
        <h1 className="mt-4 text-xl font-bold text-white">
          Firebase isn&apos;t configured yet
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Copy <code className="text-brand-300">.env.local.example</code> to{" "}
          <code className="text-brand-300">.env.local</code>, add your Firebase
          project keys, then restart the dev server. See{" "}
          <code className="text-brand-300">README.md</code> for the 2-minute
          setup.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-semibold text-brand-300 hover:text-brand-200"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}

/**
 * Gate that requires an authenticated user.
 * `requireProfile`: when true (dashboard), redirect to /onboarding if the user
 * hasn't created a profile yet. When false (onboarding), redirect to /dashboard
 * if they already have one.
 */
export function RequireAuth({
  children,
  requireProfile = true,
}: {
  children: React.ReactNode;
  requireProfile?: boolean;
}) {
  const { user, profile, loading, configured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !configured) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (requireProfile && !profile) {
      router.replace("/onboarding");
    } else if (!requireProfile && profile) {
      router.replace("/dashboard");
    }
  }, [loading, configured, user, profile, requireProfile, router]);

  if (!configured) return <NotConfigured />;
  if (loading) return <FullscreenSpinner />;
  if (!user) return <FullscreenSpinner />;
  if (requireProfile && !profile) return <FullscreenSpinner />;
  if (!requireProfile && profile) return <FullscreenSpinner />;

  return <>{children}</>;
}
