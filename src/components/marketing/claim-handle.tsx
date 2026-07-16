"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { slugifyUsername } from "@/lib/utils";
import { useSiteHost } from "@/lib/use-site-host";

export function ClaimHandle({ size = "lg" }: { size?: "lg" | "sm" }) {
  const router = useRouter();
  const host = useSiteHost();
  const [value, setValue] = useState("");

  const go = () => {
    const handle = slugifyUsername(value);
    router.push(handle ? `/signup?u=${encodeURIComponent(handle)}` : "/signup");
  };

  const big = size === "lg";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className={`glass group flex w-full items-center gap-1 rounded-2xl p-1.5 transition-all focus-within:ring-2 focus-within:ring-brand-400/60 ${
        big ? "max-w-md" : "max-w-sm"
      }`}
    >
      <span
        className={`pl-3 font-medium text-white/40 max-[380px]:hidden ${big ? "text-xs sm:text-base" : "text-xs sm:text-sm"}`}
      >
        {host}/
      </span>
      <input
        value={value}
        onChange={(e) => setValue(slugifyUsername(e.target.value))}
        placeholder="yourname"
        aria-label="Choose your username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        size={1}
        className={`w-0 min-w-0 flex-1 bg-transparent font-medium text-white outline-none placeholder:text-white/30 ${
          big ? "text-base" : "text-sm"
        }`}
      />
      <button
        type="submit"
        className={`brand-gradient inline-flex shrink-0 items-center gap-1.5 rounded-xl font-semibold text-white shadow-lg shadow-brand-600/25 transition-transform hover:-translate-y-0.5 ${
          big ? "h-11 px-5 text-sm" : "h-9 px-4 text-sm"
        }`}
      >
        Claim
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
