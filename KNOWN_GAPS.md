# Known gaps / v2 backlog

This is a complete, working MVP. The items below are deliberate trade-offs made
to ship a polished core fast — none of them block using the product.

## Architecture

- **Public pages render client-side.** `/[username]` fetches from Firestore in
  the browser (via the Web SDK), so the initial HTML isn't pre-rendered. For
  SEO + instant paint on public pages, add `firebase-admin` and fetch the
  profile in a Server Component (or the Firestore REST API with the public key)
  and use `generateMetadata` for per-profile OpenGraph tags.

- **Analytics writes are public.** `stats/{uid}` is world-writable so anonymous
  visitors can be counted (see `firestore.rules`). Before production, move view
  / click increments behind **App Check** or a small server route using the
  Admin SDK, to prevent counter tampering.

## Features not yet built

> The product is deliberately **100% free — no paid tier** (owner's decision,
> 2026-07-16). Don't reintroduce pricing/upgrade UI.

- **Custom domains** — needs DNS + Vercel domain API work.
- **Avatar uploads** — avatars are set via image URL; wire Firebase Storage for
  direct upload + cropping.
- **Scheduled / expiring links, link thumbnails, and per-day analytics charts.**
- **Password reset & email verification** flows (Firebase supports both; just
  add the screens).
- **Rate limiting** on username checks.

## Nice-to-haves

- Drag handle keyboard accessibility (dnd-kit keyboard sensor).
- More themes + a custom-color picker.
- i18n (the UI copy is English; the target audience may want Arabic).
