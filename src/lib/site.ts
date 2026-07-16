/**
 * Canonical site origin. Used for SEO metadata and as the SSR fallback for
 * user-facing URLs. Set NEXT_PUBLIC_SITE_URL when the deployment moves to a
 * custom domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://linkora-rouge.vercel.app";

/** Host part shown in the UI, e.g. "linkora-rouge.vercel.app". */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//i, "").replace(
  /\/+$/,
  "",
);

/** The origin the visitor is actually on (falls back to SITE_URL during SSR). */
export function siteOrigin(): string {
  return typeof window === "undefined" ? SITE_URL : window.location.origin;
}

/** The host the visitor is actually on (falls back to SITE_HOST during SSR). */
export function siteHost(): string {
  return typeof window === "undefined" ? SITE_HOST : window.location.host;
}
