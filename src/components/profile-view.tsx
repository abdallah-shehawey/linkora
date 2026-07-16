"use client";

import type { CSSProperties } from "react";
import { BadgeCheck } from "lucide-react";
import type { Profile } from "@/lib/types";
import { getTheme, BUTTON_STYLES } from "@/lib/themes";
import { cn, initialsOf, normaliseUrl } from "@/lib/utils";
import { SOCIALS, socialHref, socialDisplayName } from "./social-icons";
import { LogoMark } from "./logo";

interface ProfileViewProps {
  profile: Profile;
  /** When true, link clicks are intercepted (used in editor / hero mockups). */
  preview?: boolean;
  onLinkClick?: (linkId: string, url: string) => void;
  className?: string;
}

export function ProfileView({
  profile,
  preview = false,
  onLinkClick,
  className,
}: ProfileViewProps) {
  const theme = getTheme(profile.themeId);
  const style = BUTTON_STYLES[profile.buttonStyle] ?? BUTTON_STYLES.rounded;
  const links = profile.links.filter((l) => l.active);

  const extraClass =
    style.extra === "shadow"
      ? "shadow-[0_12px_30px_-12px_rgba(0,0,0,0.55)]"
      : style.extra === "hard"
        ? "border-2 shadow-[4px_4px_0_0_var(--btn-fg)] hover:shadow-[2px_2px_0_0_var(--btn-fg)] hover:translate-x-[2px] hover:translate-y-[2px]"
        : "";
  const outline = style.extra === "outline";

  return (
    <div
      className={cn(
        "relative flex min-h-full w-full flex-col items-center overflow-hidden px-6 pt-16 pb-10",
        className,
      )}
      style={
        {
          background: "var(--page-bg)",
          color: "var(--fg)",
          ...theme.vars,
        } as CSSProperties
      }
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--ring)" }}
      />

      <div className="relative z-10 flex w-full max-w-[520px] flex-1 flex-col items-center">
        {/* Avatar */}
        <div
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-offset-2"
          style={{
            "--tw-ring-color": "var(--ring)",
            "--tw-ring-offset-color": "transparent",
          } as CSSProperties}
        >
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-2xl font-bold"
              style={{ background: "var(--btn-bg)" }}
            >
              {initialsOf(profile.displayName || profile.username)}
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="mt-4 flex items-center gap-1.5 text-xl font-bold tracking-tight">
          {profile.displayName || `@${profile.username}`}
          {profile.verified && (
            <BadgeCheck className="h-5 w-5" style={{ color: "var(--ring)" }} />
          )}
        </h1>
        <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
          @{profile.username}
        </p>

        {/* Bio */}
        {profile.bio && (
          <p
            className="mt-3 max-w-[38ch] text-center text-sm leading-relaxed text-balance"
            style={{ color: "var(--muted)" }}
          >
            {profile.bio}
          </p>
        )}

        {/* Socials — vertical rows: icon + account name */}
        {profile.socials.length > 0 && (
          <div className="mt-6 flex w-full flex-col gap-2.5">
            {profile.socials.map((s, i) => {
              const meta = SOCIALS[s.platform];
              if (!meta || !s.url) return null;
              const Icon = meta.Icon;
              return (
                <a
                  key={`${s.platform}-${i}`}
                  href={preview ? undefined : socialHref(s.platform, s.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => preview && e.preventDefault()}
                  aria-label={`${meta.label}: ${socialDisplayName(s)}`}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5",
                    extraClass,
                  )}
                  style={{
                    borderRadius: style.radius,
                    background: outline ? "transparent" : "var(--btn-bg)",
                    color: "var(--btn-fg)",
                    borderWidth: outline ? 1.5 : style.extra === "hard" ? 2 : 1,
                    borderStyle: "solid",
                    borderColor: "var(--btn-border)",
                  }}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background:
                        "color-mix(in oklab, var(--btn-fg) 10%, transparent)",
                      color: "var(--social-fg)",
                    }}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm font-semibold">
                      {socialDisplayName(s)}
                    </span>
                    <span className="block truncate text-xs opacity-60">
                      {meta.label}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        )}

        {/* Links */}
        <div className="mt-7 flex w-full flex-col gap-3.5">
          {links.map((link) => (
            <a
              key={link.id}
              href={preview ? undefined : normaliseUrl(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (preview) {
                  e.preventDefault();
                  return;
                }
                onLinkClick?.(link.id, link.url);
              }}
              className={cn(
                "group relative flex w-full items-center justify-center px-5 py-4 text-center text-[0.95rem] font-semibold transition-all duration-200 hover:-translate-y-0.5",
                extraClass,
                link.highlight && "overflow-hidden",
              )}
              style={{
                borderRadius: style.radius,
                background: outline ? "transparent" : "var(--btn-bg)",
                color: "var(--btn-fg)",
                borderWidth: outline ? 1.5 : style.extra === "hard" ? 2 : 1,
                borderStyle: "solid",
                borderColor: "var(--btn-border)",
              }}
            >
              {link.highlight && (
                <span className="shimmer pointer-events-none absolute inset-0 opacity-70" />
              )}
              {link.emoji && (
                <span className="absolute left-4 text-lg">{link.emoji}</span>
              )}
              <span className="relative">{link.title || "Untitled link"}</span>
            </a>
          ))}

          {links.length === 0 && (
            <div
              className="rounded-2xl border border-dashed py-10 text-center text-sm"
              style={{ borderColor: "var(--btn-border)", color: "var(--muted)" }}
            >
              No links yet.
            </div>
          )}
        </div>

        {/* Footer badge */}
        <a
          href={preview ? undefined : "/"}
          onClick={(e) => preview && e.preventDefault()}
          className="mt-auto flex items-center gap-1.5 pt-10 text-xs font-medium opacity-70 transition-opacity hover:opacity-100"
          style={{ color: "var(--muted)" }}
        >
          <LogoMark className="h-5 w-5 rounded-md" />
          Made with Linkora
        </a>
      </div>
    </div>
  );
}
