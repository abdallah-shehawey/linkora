"use client";

import { useSyncExternalStore } from "react";
import { SITE_HOST } from "./site";

// The host never changes during a page's lifetime — nothing to subscribe to.
const subscribe = () => () => {};

/**
 * The host to display in handle inputs / share bars. SSR and the first
 * client render use the build-time fallback, then React swaps in the host
 * the visitor is actually on.
 */
export function useSiteHost(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.host,
    () => SITE_HOST,
  );
}
