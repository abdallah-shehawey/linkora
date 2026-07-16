import type { Profile } from "./types";

/** Sample profile used in the marketing hero + theme showcase. */
export const DEMO_PROFILE: Profile = {
  uid: "demo",
  username: "layla.creates",
  displayName: "Layla Hassan",
  bio: "Designer & content creator ✦ Turning ideas into pixels. Book a call or grab my latest drop below.",
  avatarUrl:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#c4b5fd'/><stop offset='1' stop-color='#f472b6'/>
        </linearGradient></defs>
        <rect width='200' height='200' fill='url(#g)'/>
        <text x='50%' y='54%' font-family='sans-serif' font-size='84' font-weight='700'
          fill='white' text-anchor='middle' dominant-baseline='middle'>L</text>
      </svg>`,
    ),
  themeId: "aurora",
  buttonStyle: "rounded",
  verified: true,
  views: 12840,
  socials: [
    { platform: "instagram", url: "instagram.com/layla", label: "layla.creates" },
    { platform: "youtube", url: "youtube.com/@layla", label: "Layla Hassan" },
    { platform: "tiktok", url: "tiktok.com/@layla", label: "@layla" },
  ],
  links: [
    { id: "l1", title: "✦ Shop my new collection", url: "#", active: true, clicks: 0, highlight: true },
    { id: "l2", title: "Book a 1:1 design session", url: "#", active: true, clicks: 0, emoji: "🎨" },
    { id: "l3", title: "Latest YouTube video", url: "#", active: true, clicks: 0, emoji: "▶️" },
    { id: "l4", title: "Free brand starter kit", url: "#", active: true, clicks: 0, emoji: "🎁" },
    { id: "l5", title: "Newsletter — join 8k readers", url: "#", active: true, clicks: 0, emoji: "✉️" },
  ],
};

export function demoWithTheme(themeId: string): Profile {
  return { ...DEMO_PROFILE, themeId };
}
