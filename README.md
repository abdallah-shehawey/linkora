# Linkora

**One link for everything you are.** A modern, professional link-in-bio
platform — a Linktree alternative built to make people *choose it over the
others*.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 ·
Firebase (Auth + Firestore)**.

---

## ✨ What's inside

- **Marketing landing page** — animated hero, live theme showcase, feature
  bento, comparison table, CTA. The product is **100% free — no paid tiers**.
- **Auth** — email/password + Google sign-in.
- **Onboarding** — real-time username availability check + handle reservation.
- **Dashboard editor** with live phone preview:
  - Profile (avatar, name, bio)
  - Links: add / edit / **drag-and-drop reorder** / toggle / highlight / emoji
  - Social icons (12 platforms)
  - Design: **10 themes** + 6 button styles
  - Analytics: views, clicks, CTR, per-link bars
  - Settings: change handle, account, sign out
- **Public page** `linkora.app/<username>` — themed, fast, with view + click
  tracking, and a "claim this handle" page for unclaimed usernames.

---

## 🚀 Quick start

### 1. Create a Firebase project (2 minutes)

1. Go to the [Firebase Console](https://console.firebase.google.com) → **Add
   project**.
2. **Build → Authentication → Get started** → enable **Email/Password** and
   **Google**.
3. **Build → Firestore Database → Create database** (start in *production*
   mode — we ship rules below).
4. **Project settings (⚙️) → Your apps → Web (`</>`)** → register an app and
   copy the config values.

### 2. Configure the app

```bash
cp .env.local.example .env.local
# then paste your Firebase keys into .env.local
```

### 3. Publish the security rules

Copy [`firestore.rules`](./firestore.rules) into **Firestore → Rules →
Publish**, or with the CLI:

```bash
firebase deploy --only firestore:rules
```

### 4. Run it

```bash
npm install   # if you haven't already
npm run dev
```

Open <http://localhost:3000>. Sign up, pick a handle, and build your page.

> Add `http://localhost` (and later your Vercel domain) under
> **Authentication → Settings → Authorized domains** so Google sign-in works.

### Local development without a Firebase project

You can also develop fully offline against the **Firebase Emulator Suite**
(needs Java):

```bash
npm run emulators        # starts Auth + Firestore emulators with the rules
# in .env.local set: NEXT_PUBLIC_FIREBASE_EMULATOR=1  (plus any fake keys)
npm run dev
```

### Tests

```bash
npm run test:e2e
```

Spins up the emulators and runs `scripts/e2e-emulator.test.mts` against the
**real** app code and the **real** `firestore.rules`: signup → atomic handle
reservation → profile editing → anonymous public reads → analytics counters →
hostile writes (must be denied) → handle rename. 18 assertions.

---

## 🧱 Data model (Firestore)

| Collection  | Doc id     | Shape                                   | Access                    |
| ----------- | ---------- | --------------------------------------- | ------------------------- |
| `profiles`  | `uid`      | full `Profile` (links, socials, theme…) | public read, owner write  |
| `usernames` | `username` | `{ uid }` — handle → owner mapping      | public read, owner write  |
| `stats`     | `uid`      | `{ views, clicks: { [linkId]: n } }`    | public read, public write |

Handles are reserved atomically in a Firestore transaction so two people can
never grab the same one.

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new) — the Next.js preset needs no
   extra config.
3. Add the same `NEXT_PUBLIC_FIREBASE_*` env vars in **Vercel → Project →
   Settings → Environment Variables** (do **not** set
   `NEXT_PUBLIC_FIREBASE_EMULATOR` there). Set `NEXT_PUBLIC_SITE_URL` to your
   production URL for correct OpenGraph links.
4. Add your production domain (`your-app.vercel.app` / custom domain) to
   Firebase **Authentication → Settings → Authorized domains**.

> ⚠️ **Preview deployments:** every Vercel preview gets its own
> `*-git-*.vercel.app` domain. Google/email sign-in on a preview will fail with
> `auth/unauthorized-domain` until that domain is also whitelisted in Firebase.
> This is Firebase behaviour, not a bug — test auth on `localhost` or
> production, or whitelist the preview domain when needed.

---

## 🗂 Project structure

```text
src/
  app/
    page.tsx              Marketing landing page
    (auth)/login|signup   Auth screens
    onboarding/           Handle picker
    dashboard/            Editor (client)
    [username]/           Public profile page
  components/
    profile-view.tsx      Canonical page renderer (preview + public)
    marketing/            Landing sections
    auth/ onboarding/     Auth + guards
    dashboard/            Editor (context, links, design, analytics, …)
    public/               Public profile + not-found
    ui/                   Button, Input primitives
  lib/
    firebase.ts auth-context.tsx db.ts   Firebase glue
    types.ts themes.ts utils.ts demo.ts  Domain model
```

See [`KNOWN_GAPS.md`](./KNOWN_GAPS.md) for what's intentionally left for a v2.

## GitHub Container Registry

A tested Linux amd64 image is published to [GitHub Packages](https://github.com/abdallah-shehawey/linkora/pkgs/container/linkora) on each push to `main`. `latest` follows `main`; `sha-<commit>` identifies the source revision. Pin the registry digest when an exact image is required. Version tags (`v*`) also publish a versioned image.

```sh
docker run --rm -p 8080:3000 ghcr.io/abdallah-shehawey/linkora:latest
```

Open http://localhost:8080. On first publication GitHub makes packages private; the owner can make the package public in its package settings. Private images require a GitHub token with `read:packages`.

The published image uses the public Firebase browser configuration from the deployed Linkora website. Public client configuration is compiled into the image. The publish workflow reads these GitHub Actions repository **variables**:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_SITE_URL`

To use your own backend, build from source and supply these values with `docker build --build-arg NAME=value ... -t linkora .`. Server-only secrets belong in `docker run --env-file /path/to/runtime.env ...`, never build arguments. Local `.env` files and private keys are excluded from the build context.

Without Firebase variables the image shows the existing setup state. Configure your Firebase project before using accounts or saved links, and authorize your hosting domain in Firebase Authentication.
