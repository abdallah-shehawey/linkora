import type { IconType } from "react-icons";
import {
  FaInstagram,
  FaXTwitter,
  FaTiktok,
  FaYoutube,
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
  FaTelegram,
  FaSpotify,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa6";
import type { SocialPlatform } from "@/lib/types";
import { normaliseUrl } from "@/lib/utils";

export const SOCIALS: Record<
  SocialPlatform,
  { label: string; Icon: IconType; placeholder: string; prefix?: string }
> = {
  instagram: { label: "Instagram", Icon: FaInstagram, placeholder: "instagram.com/you" },
  twitter: { label: "X (Twitter)", Icon: FaXTwitter, placeholder: "x.com/you" },
  tiktok: { label: "TikTok", Icon: FaTiktok, placeholder: "tiktok.com/@you" },
  youtube: { label: "YouTube", Icon: FaYoutube, placeholder: "youtube.com/@you" },
  github: { label: "GitHub", Icon: FaGithub, placeholder: "github.com/you" },
  linkedin: { label: "LinkedIn", Icon: FaLinkedinIn, placeholder: "linkedin.com/in/you" },
  facebook: { label: "Facebook", Icon: FaFacebookF, placeholder: "facebook.com/you" },
  whatsapp: { label: "WhatsApp", Icon: FaWhatsapp, placeholder: "wa.me/2010..." },
  telegram: { label: "Telegram", Icon: FaTelegram, placeholder: "t.me/you" },
  spotify: { label: "Spotify", Icon: FaSpotify, placeholder: "open.spotify.com/..." },
  email: { label: "Email", Icon: FaEnvelope, placeholder: "you@mail.com", prefix: "mailto:" },
  website: { label: "Website", Icon: FaGlobe, placeholder: "yoursite.com" },
};

export const SOCIAL_PLATFORMS = Object.keys(SOCIALS) as SocialPlatform[];

/** Build the outbound href for a social entry. */
export function socialHref(platform: SocialPlatform, value: string): string {
  const v = value.trim();
  if (platform === "email") {
    return v.startsWith("mailto:") ? v : `mailto:${v}`;
  }
  return normaliseUrl(v);
}
