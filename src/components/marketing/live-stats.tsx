"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/lib/themes";
import { countCreators, watchSiteStats } from "@/lib/db";
import { isFirebaseConfigured } from "@/lib/firebase";
import { formatCount } from "@/lib/utils";

/* ----------------------------- data hooks ----------------------------- */

// Shared cache so the hero line and the stats strip trigger a single
// aggregate query instead of one each.
let creatorsCache: { at: number; value: number } | null = null;

async function fetchCreators(): Promise<number> {
  if (creatorsCache && Date.now() - creatorsCache.at < 30_000) {
    return creatorsCache.value;
  }
  const value = await countCreators();
  creatorsCache = { at: Date.now(), value };
  return value;
}

/** Live creator count; refreshes every minute. `null` while loading. */
function useCreators(): number | null {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let alive = true;
    const refresh = () =>
      fetchCreators()
        .then((c) => alive && setN(c))
        .catch(() => {});
    refresh();
    const t = setInterval(refresh, 60_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);
  return n;
}

/** Live site-wide link-click total (realtime snapshot). `null` while loading. */
function useSiteClicks(): number | null {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return watchSiteStats((s) => setN(s.totalClicks));
  }, []);
  return n;
}

/** Real measured page load (DOMContentLoaded) for THIS visit. */
function usePageLoad(): string {
  const [label, setLabel] = useState("< 1s");
  useEffect(() => {
    const measure = () => {
      const [nav] = performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];
      if (!nav || nav.domContentLoadedEventEnd <= 0) return;
      const s = (nav.domContentLoadedEventEnd - nav.startTime) / 1000;
      setLabel(`${Math.max(s, 0.1).toFixed(1)}s`);
    };
    if (document.readyState === "complete") {
      measure();
      return;
    }
    const onLoad = () => setTimeout(measure, 0);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return label;
}

/** Animate a number towards its target so live updates feel alive. */
function useCountUp(target: number): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    const duration = 700;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(from + (target - from) * eased);
      fromRef.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value;
}

/* ----------------------------- components ----------------------------- */

/** The landing-page stats strip — real numbers, updating live. */
export function LiveStats() {
  const creatorsRaw = useCreators();
  const clicksRaw = useSiteClicks();
  const creators = useCountUp(creatorsRaw ?? 0);
  const clicks = useCountUp(clicksRaw ?? 0);
  const load = usePageLoad();

  const items = [
    { k: creatorsRaw === null ? "—" : formatCount(creators), v: "Creators" },
    { k: String(THEMES.length), v: "Themes" },
    { k: clicksRaw === null ? "—" : formatCount(clicks), v: "Link clicks" },
    { k: load, v: "Page load" },
  ];

  return (
    <section className="border-y border-white/5 bg-white/[0.015]">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-4">
        {items.map((s) => (
          <div key={s.v} className="text-center">
            <div className="text-3xl font-bold tabular-nums text-white sm:text-4xl">
              {s.k}
            </div>
            <div className="mt-1 text-sm text-white/45">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Hero line: "N creators already building" with the live count. */
export function CreatorsLine() {
  const creatorsRaw = useCreators();
  const creators = useCountUp(creatorsRaw ?? 0);
  return (
    <p className="text-sm text-white/50">
      <span className="font-semibold tabular-nums text-white">
        {creatorsRaw === null ? "…" : formatCount(creators)}
      </span>{" "}
      creators already building
    </p>
  );
}
