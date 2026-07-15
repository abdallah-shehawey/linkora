import { Suspense } from "react";
import type { Metadata } from "next";
import { AuroraBg } from "@/components/marketing/aurora-bg";
import { Logo } from "@/components/logo";
import { RequireAuth } from "@/components/auth/require-auth";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import Link from "next/link";

export const metadata: Metadata = { title: "Get started" };

export default function OnboardingPage() {
  return (
    <RequireAuth requireProfile={false}>
      <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
        <AuroraBg />
        <Link href="/" className="mb-8" aria-label="Linkora home">
          <Logo />
        </Link>
        <Suspense>
          <OnboardingFlow />
        </Suspense>
      </div>
    </RequireAuth>
  );
}
