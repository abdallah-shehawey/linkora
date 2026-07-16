import type { ButtonStyle } from "./types";

/**
 * A public-page theme is expressed purely as CSS custom properties so it can be
 * applied via an inline `style` on the page container — buttons, text and rings
 * all read from these vars.
 */
export interface Theme {
  id: string;
  name: string;
  isDark: boolean;
  /** Small swatch gradient used in the theme picker. */
  swatch: string;
  vars: {
    "--page-bg": string;
    "--fg": string;
    "--muted": string;
    "--btn-bg": string;
    "--btn-fg": string;
    "--btn-border": string;
    "--btn-hover-bg": string;
    "--btn-hover-fg": string;
    "--ring": string;
    "--social-fg": string;
  };
}

export const THEMES: Theme[] = [
  {
    id: "aurora",
    name: "Aurora",
    isDark: true,
    swatch: "linear-gradient(135deg,#0891b2,#0ea5e9)",
    vars: {
      "--page-bg":
        "radial-gradient(120% 80% at 50% -10%, #164e63 0%, #0b1a2a 45%, #070711 100%)",
      "--fg": "#ecfeff",
      "--muted": "rgba(236,254,255,0.65)",
      "--btn-bg": "rgba(255,255,255,0.08)",
      "--btn-fg": "#ffffff",
      "--btn-border": "rgba(255,255,255,0.14)",
      "--btn-hover-bg": "rgba(255,255,255,0.16)",
      "--btn-hover-fg": "#ffffff",
      "--ring": "#67e8f9",
      "--social-fg": "#a5f3fc",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    isDark: true,
    swatch: "linear-gradient(135deg,#0f172a,#334155)",
    vars: {
      "--page-bg": "linear-gradient(180deg,#0b1120 0%,#020617 100%)",
      "--fg": "#e2e8f0",
      "--muted": "rgba(226,232,240,0.6)",
      "--btn-bg": "rgba(148,163,184,0.08)",
      "--btn-fg": "#f8fafc",
      "--btn-border": "rgba(148,163,184,0.2)",
      "--btn-hover-bg": "rgba(148,163,184,0.18)",
      "--btn-hover-fg": "#ffffff",
      "--ring": "#38bdf8",
      "--social-fg": "#cbd5e1",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    isDark: true,
    swatch: "linear-gradient(135deg,#f97316,#e11d48)",
    vars: {
      "--page-bg":
        "radial-gradient(120% 90% at 50% -10%, #f97316 0%, #c026d3 55%, #2e1065 100%)",
      "--fg": "#fff7ed",
      "--muted": "rgba(255,247,237,0.72)",
      "--btn-bg": "rgba(255,255,255,0.12)",
      "--btn-fg": "#ffffff",
      "--btn-border": "rgba(255,255,255,0.2)",
      "--btn-hover-bg": "rgba(255,255,255,0.22)",
      "--btn-hover-fg": "#ffffff",
      "--ring": "#fde68a",
      "--social-fg": "#ffedd5",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    isDark: true,
    swatch: "linear-gradient(135deg,#0ea5e9,#14b8a6)",
    vars: {
      "--page-bg":
        "radial-gradient(120% 90% at 50% -10%, #0ea5e9 0%, #0f766e 50%, #062c3f 100%)",
      "--fg": "#ecfeff",
      "--muted": "rgba(236,254,255,0.68)",
      "--btn-bg": "rgba(255,255,255,0.1)",
      "--btn-fg": "#ffffff",
      "--btn-border": "rgba(255,255,255,0.18)",
      "--btn-hover-bg": "rgba(255,255,255,0.2)",
      "--btn-hover-fg": "#ffffff",
      "--ring": "#67e8f9",
      "--social-fg": "#cffafe",
    },
  },
  {
    id: "forest",
    name: "Forest",
    isDark: true,
    swatch: "linear-gradient(135deg,#16a34a,#065f46)",
    vars: {
      "--page-bg": "linear-gradient(180deg,#052e16 0%,#022c22 100%)",
      "--fg": "#ecfdf5",
      "--muted": "rgba(236,253,245,0.66)",
      "--btn-bg": "rgba(255,255,255,0.08)",
      "--btn-fg": "#ffffff",
      "--btn-border": "rgba(134,239,172,0.22)",
      "--btn-hover-bg": "rgba(134,239,172,0.18)",
      "--btn-hover-fg": "#ffffff",
      "--ring": "#86efac",
      "--social-fg": "#bbf7d0",
    },
  },
  {
    id: "noir",
    name: "Noir",
    isDark: true,
    swatch: "linear-gradient(135deg,#111111,#3f3f46)",
    vars: {
      "--page-bg": "#0a0a0a",
      "--fg": "#fafafa",
      "--muted": "rgba(250,250,250,0.55)",
      "--btn-bg": "rgba(255,255,255,0.06)",
      "--btn-fg": "#fafafa",
      "--btn-border": "rgba(255,255,255,0.14)",
      "--btn-hover-bg": "#fafafa",
      "--btn-hover-fg": "#0a0a0a",
      "--ring": "#fafafa",
      "--social-fg": "#e5e5e5",
    },
  },
  {
    id: "snow",
    name: "Snow",
    isDark: false,
    swatch: "linear-gradient(135deg,#ffffff,#e2e8f0)",
    vars: {
      "--page-bg": "linear-gradient(180deg,#ffffff 0%,#f1f5f9 100%)",
      "--fg": "#0f172a",
      "--muted": "rgba(15,23,42,0.55)",
      "--btn-bg": "#ffffff",
      "--btn-fg": "#0f172a",
      "--btn-border": "rgba(15,23,42,0.1)",
      "--btn-hover-bg": "#0f172a",
      "--btn-hover-fg": "#ffffff",
      "--ring": "#0f172a",
      "--social-fg": "#334155",
    },
  },
  {
    id: "bubblegum",
    name: "Bubblegum",
    isDark: false,
    swatch: "linear-gradient(135deg,#fbcfe8,#a5f3fc)",
    vars: {
      "--page-bg":
        "radial-gradient(120% 90% at 50% -10%, #fbcfe8 0%, #cffafe 55%, #a5f3fc 100%)",
      "--fg": "#164e63",
      "--muted": "rgba(22,78,99,0.6)",
      "--btn-bg": "rgba(255,255,255,0.75)",
      "--btn-fg": "#164e63",
      "--btn-border": "rgba(255,255,255,0.9)",
      "--btn-hover-bg": "#ffffff",
      "--btn-hover-fg": "#0891b2",
      "--ring": "#67e8f9",
      "--social-fg": "#0891b2",
    },
  },
  {
    id: "peach",
    name: "Peach",
    isDark: false,
    swatch: "linear-gradient(135deg,#fed7aa,#fecaca)",
    vars: {
      "--page-bg": "linear-gradient(180deg,#fff7ed 0%,#ffe4e6 100%)",
      "--fg": "#7c2d12",
      "--muted": "rgba(124,45,18,0.6)",
      "--btn-bg": "rgba(255,255,255,0.8)",
      "--btn-fg": "#7c2d12",
      "--btn-border": "rgba(124,45,18,0.12)",
      "--btn-hover-bg": "#7c2d12",
      "--btn-hover-fg": "#fff7ed",
      "--ring": "#fb923c",
      "--social-fg": "#9a3412",
    },
  },
  {
    id: "matrix",
    name: "Matrix",
    isDark: true,
    swatch: "linear-gradient(135deg,#052e16,#22c55e)",
    vars: {
      "--page-bg": "#04120a",
      "--fg": "#bbf7d0",
      "--muted": "rgba(187,247,208,0.55)",
      "--btn-bg": "rgba(34,197,94,0.08)",
      "--btn-fg": "#4ade80",
      "--btn-border": "rgba(74,222,128,0.3)",
      "--btn-hover-bg": "rgba(34,197,94,0.2)",
      "--btn-hover-fg": "#dcfce7",
      "--ring": "#22c55e",
      "--social-fg": "#4ade80",
    },
  },
];

export const DEFAULT_THEME = THEMES[0];

export function getTheme(id: string | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? DEFAULT_THEME;
}

/** Maps a button style to the radius + shape treatment used on the public page. */
export const BUTTON_STYLES: Record<
  ButtonStyle,
  { label: string; radius: string; extra?: string }
> = {
  rounded: { label: "Rounded", radius: "0.9rem" },
  pill: { label: "Pill", radius: "999px" },
  square: { label: "Square", radius: "0.25rem" },
  outline: { label: "Outline", radius: "0.9rem", extra: "outline" },
  shadow: { label: "Soft shadow", radius: "0.9rem", extra: "shadow" },
  hard: { label: "Hard shadow", radius: "0.5rem", extra: "hard" },
};
