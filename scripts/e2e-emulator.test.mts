/**
 * End-to-end test against the Firebase Emulator Suite.
 *
 * Exercises the REAL production code paths (src/lib/firebase.ts + db.ts) and
 * the REAL security rules (firestore.rules):
 *   signup → handle reservation → profile editing → public reads →
 *   analytics writes → hostile writes (must be denied) → handle change.
 *
 * Run:  npm run test:e2e
 * (starts emulators, runs this file, shuts them down)
 */

// Point the client SDK at the emulators BEFORE importing our libs.
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "fake-api-key";
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "localhost";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "demo-linkora";
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "demo-linkora.appspot.com";
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "0";
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "1:0:web:0";
process.env.NEXT_PUBLIC_FIREBASE_EMULATOR = "1";

const { getFirebaseAuth } = await import("../src/lib/firebase");
const {
  isUsernameAvailable,
  reserveAndCreateProfile,
  saveProfile,
  getProfileByUsername,
  getStats,
  recordView,
  recordClick,
  changeUsername,
} = await import("../src/lib/db");
const { emptyProfile } = await import("../src/lib/types");

const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = await import("firebase/auth");

let passed = 0;
let failed = 0;

function ok(name: string, cond: boolean, detail = "") {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name} ${detail}`);
  }
}

async function expectDenied(name: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    ok(name, false, "(write was ALLOWED — rules are broken!)");
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code: string }).code)
        : err instanceof Error
          ? err.message
          : String(err);
    ok(name, /permission-denied|username-taken/.test(code), `(got: ${code})`);
  }
}

const auth = getFirebaseAuth();

console.log("\n— User A signs up and claims a handle —");
ok("handle 'layla' initially available", await isUsernameAvailable("layla"));
ok("reserved handle 'admin' blocked", !(await isUsernameAvailable("admin")));

const a = await createUserWithEmailAndPassword(auth, "layla@test.dev", "secret123");
const profileA = emptyProfile(a.user.uid, "layla", "Layla Hassan");
await reserveAndCreateProfile(profileA);
ok("profile A created + handle reserved", true);
ok("handle 'layla' now taken", !(await isUsernameAvailable("layla")));

console.log("\n— User A edits her page —");
await saveProfile(a.user.uid, {
  bio: "Designer & creator",
  themeId: "sunset",
  links: [
    { id: "l1", title: "My shop", url: "https://shop.dev", active: true, clicks: 0 },
    { id: "l2", title: "Hidden", url: "https://x.dev", active: false, clicks: 0 },
  ],
});
ok("profile saved (links + theme)", true);

console.log("\n— Anonymous visitor reads the public page —");
await signOut(auth);
const pub = await getProfileByUsername("layla");
ok("public read works signed-out", pub !== null);
ok("saved data round-trips", pub?.bio === "Designer & creator" && pub?.themeId === "sunset");
ok("links present", pub?.links.length === 2);

console.log("\n— Anonymous visitor analytics —");
await recordView(pub!.uid);
await recordView(pub!.uid);
await recordClick(pub!.uid, "l1");
const stats = await getStats(pub!.uid);
ok("views counted", stats.views === 2, `(views=${stats.views})`);
ok("clicks counted", stats.clicks["l1"] === 1, `(clicks=${JSON.stringify(stats.clicks)})`);

console.log("\n— Hostile writes are denied —");
await expectDenied("anonymous can't edit A's profile", () =>
  saveProfile(pub!.uid, { bio: "hacked" }),
);

const b = await createUserWithEmailAndPassword(auth, "bob@test.dev", "secret123");
await expectDenied("B can't claim A's handle", () =>
  reserveAndCreateProfile(emptyProfile(b.user.uid, "layla", "Bob")),
);
await expectDenied("B can't edit A's profile", () =>
  saveProfile(pub!.uid, { bio: "hacked by bob" }),
);
await expectDenied("B can't steal A's handle via changeUsername", () =>
  changeUsername(b.user.uid, "layla", "bobland"),
);

console.log("\n— B claims his own handle (sanity) —");
await reserveAndCreateProfile(emptyProfile(b.user.uid, "bob", "Bob"));
ok("B's own reservation works", (await getProfileByUsername("bob")) !== null);

console.log("\n— A renames her handle —");
await signOut(auth);
await signInWithEmailAndPassword(auth, "layla@test.dev", "secret123");
await changeUsername(a.user.uid, "layla", "layla.creates");
ok("old handle freed", (await getProfileByUsername("layla")) === null);
const renamed = await getProfileByUsername("layla.creates");
ok("new handle resolves", renamed?.uid === a.user.uid);
ok("old handle available again", await isUsernameAvailable("layla"));

console.log(`\n${"=".repeat(46)}\n  ${passed} passed, ${failed} failed\n${"=".repeat(46)}`);
process.exit(failed === 0 ? 0 : 1);
