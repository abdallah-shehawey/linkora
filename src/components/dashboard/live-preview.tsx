"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import { useEditor } from "./editor-context";
import { PhoneMockup } from "@/components/phone-mockup";
import { ProfileView } from "@/components/profile-view";

export function LivePreview() {
  const { profile } = useEditor();
  const [copied, setCopied] = useState(false);
  const [nonce, setNonce] = useState(0);

  const path = `/${profile.username}`;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : `linkora.app${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Share bar */}
      <div className="glass mb-6 flex w-full max-w-sm items-center gap-1 rounded-xl p-1.5">
        <button
          onClick={copy}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/5"
        >
          {copied ? (
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4 shrink-0 text-white/40" />
          )}
          <span className="truncate text-white/70">
            linkora.app/{profile.username}
          </span>
        </button>
        <button
          onClick={() => setNonce((n) => n + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white"
          title="Refresh preview"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white"
          title="Open your page"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <PhoneMockup key={nonce}>
        <ProfileView profile={profile} preview />
      </PhoneMockup>
    </div>
  );
}
