"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";
import { saveProfile, getStats, type Stats } from "@/lib/db";
import type { LinkItem, Profile, SocialLink, SocialPlatform } from "@/lib/types";
import { uid as genId } from "@/lib/utils";

type SaveState = "saved" | "saving" | "dirty";

interface EditorContext {
  profile: Profile;
  stats: Stats;
  saveState: SaveState;
  patch: (data: Partial<Profile>) => void;
  addLink: () => void;
  updateLink: (id: string, data: Partial<LinkItem>) => void;
  removeLink: (id: string) => void;
  setLinks: (links: LinkItem[]) => void;
  addSocial: (platform: SocialPlatform) => void;
  updateSocial: (index: number, data: Partial<SocialLink>) => void;
  removeSocial: (index: number) => void;
}

const Ctx = createContext<EditorContext | null>(null);

export function EditorProvider({
  initial,
  children,
}: {
  initial: Profile;
  children: ReactNode;
}) {
  const { refreshProfile } = useAuth();
  const [profile, setProfile] = useState<Profile>(initial);
  const [stats, setStats] = useState<Stats>({ views: 0, clicks: {} });
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRun = useRef(true);

  // Load analytics once.
  useEffect(() => {
    getStats(initial.uid).then(setStats).catch(() => {});
  }, [initial.uid]);

  // Debounced autosave whenever the profile changes.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setSaveState("dirty");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSaveState("saving");
      try {
        // Persist only editable fields — never uid/username/createdAt
        // (username is owned by the reservation transaction).
        await saveProfile(profile.uid, {
          displayName: profile.displayName,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          themeId: profile.themeId,
          buttonStyle: profile.buttonStyle,
          socials: profile.socials,
          links: profile.links,
          verified: profile.verified ?? false,
          views: profile.views ?? 0,
        });
        setSaveState("saved");
        void refreshProfile();
      } catch {
        setSaveState("dirty");
      }
    }, 900);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const patch = useCallback((data: Partial<Profile>) => {
    setProfile((p) => ({ ...p, ...data }));
  }, []);

  const addLink = useCallback(() => {
    setProfile((p) => ({
      ...p,
      links: [
        { id: genId("lnk"), title: "", url: "", active: true, clicks: 0 },
        ...p.links,
      ],
    }));
  }, []);

  const updateLink = useCallback((id: string, data: Partial<LinkItem>) => {
    setProfile((p) => ({
      ...p,
      links: p.links.map((l) => (l.id === id ? { ...l, ...data } : l)),
    }));
  }, []);

  const removeLink = useCallback((id: string) => {
    setProfile((p) => ({ ...p, links: p.links.filter((l) => l.id !== id) }));
  }, []);

  const setLinks = useCallback((links: LinkItem[]) => {
    setProfile((p) => ({ ...p, links }));
  }, []);

  const addSocial = useCallback((platform: SocialPlatform) => {
    setProfile((p) => {
      if (p.socials.some((s) => s.platform === platform)) return p;
      return { ...p, socials: [...p.socials, { platform, url: "" }] };
    });
  }, []);

  const updateSocial = useCallback((index: number, data: Partial<SocialLink>) => {
    setProfile((p) => ({
      ...p,
      socials: p.socials.map((s, i) => (i === index ? { ...s, ...data } : s)),
    }));
  }, []);

  const removeSocial = useCallback((index: number) => {
    setProfile((p) => ({
      ...p,
      socials: p.socials.filter((_, i) => i !== index),
    }));
  }, []);

  return (
    <Ctx.Provider
      value={{
        profile,
        stats,
        saveState,
        patch,
        addLink,
        updateLink,
        removeLink,
        setLinks,
        addSocial,
        updateSocial,
        removeSocial,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useEditor(): EditorContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEditor must be used within <EditorProvider>");
  return ctx;
}
