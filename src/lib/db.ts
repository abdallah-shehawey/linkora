import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type { Profile } from "./types";
import { RESERVED_USERNAMES } from "./utils";

const PROFILES = "profiles";
const USERNAMES = "usernames";
const STATS = "stats";

export interface Stats {
  views: number;
  clicks: Record<string, number>;
}

function profileRef(uid: string) {
  return doc(getDb(), PROFILES, uid);
}
function usernameRef(username: string) {
  return doc(getDb(), USERNAMES, username.toLowerCase());
}
function statsRef(uid: string) {
  return doc(getDb(), STATS, uid);
}

export async function getProfileByUid(uid: string): Promise<Profile | null> {
  const snap = await getDoc(profileRef(uid));
  return snap.exists() ? (snap.data() as Profile) : null;
}

export async function getProfileByUsername(
  username: string,
): Promise<Profile | null> {
  const nameSnap = await getDoc(usernameRef(username));
  if (!nameSnap.exists()) return null;
  const { uid } = nameSnap.data() as { uid: string };
  return getProfileByUid(uid);
}

/** Availability check that also rejects reserved handles. */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const name = username.toLowerCase();
  if (RESERVED_USERNAMES.has(name)) return false;
  const snap = await getDoc(usernameRef(name));
  return !snap.exists();
}

/**
 * Reserve the username and create the profile atomically so two people can't
 * grab the same handle.
 */
export async function reserveAndCreateProfile(profile: Profile): Promise<void> {
  const db = getDb();
  const name = profile.username.toLowerCase();
  await runTransaction(db, async (tx) => {
    const nameSnap = await tx.get(usernameRef(name));
    if (nameSnap.exists()) {
      throw new Error("username-taken");
    }
    tx.set(usernameRef(name), { uid: profile.uid });
    tx.set(profileRef(profile.uid), {
      ...profile,
      username: name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    tx.set(statsRef(profile.uid), { views: 0, clicks: {} });
  });
}

/** Persist profile fields (owner only). */
export async function saveProfile(
  uid: string,
  data: Partial<Profile>,
): Promise<void> {
  await setDoc(
    profileRef(uid),
    { ...data, updatedAt: Date.now(), _ts: serverTimestamp() },
    { merge: true },
  );
}

/** Move a handle from old -> new atomically. */
export async function changeUsername(
  uid: string,
  oldUsername: string,
  newUsername: string,
): Promise<void> {
  const db = getDb();
  const from = oldUsername.toLowerCase();
  const to = newUsername.toLowerCase();
  if (from === to) return;
  if (RESERVED_USERNAMES.has(to)) throw new Error("username-reserved");

  await runTransaction(db, async (tx) => {
    const toSnap = await tx.get(usernameRef(to));
    if (toSnap.exists()) throw new Error("username-taken");
    tx.set(usernameRef(to), { uid });
    tx.delete(usernameRef(from));
    tx.update(profileRef(uid), { username: to, updatedAt: Date.now() });
  });
}

export async function getStats(uid: string): Promise<Stats> {
  const snap = await getDoc(statsRef(uid));
  if (!snap.exists()) return { views: 0, clicks: {} };
  const data = snap.data() as Partial<Stats>;
  return { views: data.views ?? 0, clicks: data.clicks ?? {} };
}

/** Public: bump the page view counter. Best-effort, never throws. */
export async function recordView(uid: string): Promise<void> {
  try {
    await setDoc(statsRef(uid), { views: increment(1) }, { merge: true });
  } catch {
    /* analytics is best-effort */
  }
}

/** Public: bump a link click counter. Best-effort, never throws. */
export async function recordClick(uid: string, linkId: string): Promise<void> {
  try {
    await updateDoc(statsRef(uid), { [`clicks.${linkId}`]: increment(1) });
  } catch {
    try {
      await setDoc(
        statsRef(uid),
        { clicks: { [linkId]: increment(1) } },
        { merge: true },
      );
    } catch {
      /* best-effort */
    }
  }
}
