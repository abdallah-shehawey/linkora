export type SocialPlatform =
  | "instagram"
  | "twitter"
  | "tiktok"
  | "youtube"
  | "github"
  | "linkedin"
  | "facebook"
  | "whatsapp"
  | "telegram"
  | "spotify"
  | "email"
  | "website";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  /** Display name shown next to the icon; falls back to the handle in the URL. */
  label?: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  active: boolean;
  clicks: number;
  /** Optional leading emoji shown on the button. */
  emoji?: string;
  /** Featured links get an animated highlight treatment. */
  highlight?: boolean;
}

export type ButtonStyle =
  | "rounded"
  | "pill"
  | "square"
  | "outline"
  | "shadow"
  | "hard";

export interface Profile {
  uid: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  themeId: string;
  buttonStyle: ButtonStyle;
  socials: SocialLink[];
  links: LinkItem[];
  verified?: boolean;
  views: number;
  createdAt?: number;
  updatedAt?: number;
}

export function emptyProfile(uid: string, username: string, displayName: string): Profile {
  return {
    uid,
    username,
    displayName: displayName || username,
    bio: "",
    avatarUrl: "",
    themeId: "aurora",
    buttonStyle: "rounded",
    socials: [],
    links: [],
    verified: false,
    views: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
