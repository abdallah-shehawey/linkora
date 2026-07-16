"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Ghost, ArrowRight } from "lucide-react";
import { ProfileView } from "@/components/profile-view";
import { Logo } from "@/components/logo";
import { getProfileByUsername, recordView, recordClick } from "@/lib/db";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { Profile } from "@/lib/types";

type State =
  | { status: "loading" }
  | { status: "found"; profile: Profile }
  | { status: "missing" };

export function PublicProfile({ username }: { username: string }) {
  const [state, setState] = useState<State>(() =>
    isFirebaseConfigured ? { status: "loading" } : { status: "missing" },
  );
  const viewed = useRef(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let alive = true;
    getProfileByUsername(username)
      .then((profile) => {
        if (!alive) return;
        if (profile) {
          setState({ status: "found", profile });
          if (!viewed.current) {
            viewed.current = true;
            void recordView(profile.uid);
          }
        } else {
          setState({ status: "missing" });
        }
      })
      .catch(() => alive && setState({ status: "missing" }));
    return () => {
      alive = false;
    };
  }, [username]);

  if (state.status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ink-950">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    );
  }

  if (state.status === "missing") {
    return <NotFoundCard username={username} />;
  }

  const { profile } = state;
  return (
    <div className="min-h-dvh">
      <ProfileView
        profile={profile}
        onLinkClick={(id) => void recordClick(profile.uid, id)}
      />
    </div>
  );
}

function NotFoundCard({ username }: { username: string }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/20 blur-[120px]" />
      <Ghost className="h-14 w-14 text-white/30" />
      <h1 className="mt-6 text-2xl font-bold text-white">
        @{username} isn&apos;t on Linkora yet
      </h1>
      <p className="mt-2 max-w-sm text-white/50">
        This handle is up for grabs. Claim it before someone else builds their
        page here.
      </p>
      <Link
        href={`/signup?u=${encodeURIComponent(username)}`}
        className="brand-gradient mt-7 inline-flex h-12 items-center gap-2 rounded-xl px-6 font-semibold text-white shadow-lg shadow-brand-600/30 transition-transform hover:-translate-y-0.5"
      >
        Claim linkora.app/{username}
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link href="/" className="mt-10 opacity-60 transition-opacity hover:opacity-100">
        <Logo />
      </Link>
    </div>
  );
}
