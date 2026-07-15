import Link from "next/link";
import { AuroraBg } from "@/components/marketing/aurora-bg";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <AuroraBg />
      <Link href="/" className="mb-8" aria-label="Linkora home">
        <Logo />
      </Link>
      {children}
    </div>
  );
}
