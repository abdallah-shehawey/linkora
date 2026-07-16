"use client";

import { useEffect } from "react";

/** Registers the service worker that makes Linkora installable as a PWA. */
export function PwaRegister() {
  useEffect(() => {
    if (
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
