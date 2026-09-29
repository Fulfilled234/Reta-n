# Retain

Never lose a customer quietly. Retain logs who visited your shop, watches who's
gone quiet, and hands you a ready-to-send WhatsApp message — you tap "Send,"
your own WhatsApp opens, nothing routes through Meta's Cloud API.

## Stack

React + TypeScript + Vite, Tailwind CSS, installable as a PWA.

**No login, no server.** Your shop's data (shop name, customers, visit
history) lives only in this browser, on this device, in `localStorage` —
nothing is sent anywhere. That's a deliberate trade: no signup step to lose
people at the door, and no account anywhere that could ever be breached. The
cost is that clearing browser data, or switching phones, loses the list
unless it's exported first — use "Export my list" on the Today screen
regularly, or before switching devices.

## 1. Install

```bash
npm install
```

## 2. Run it

```bash
npm run dev
```

That's the whole setup — no environment variables, no accounts to create.

## 3. Add real PWA icons

`vite.config.ts` references `/icon-192.png` and `/icon-512.png` for the
install prompt. Drop your own PNGs into `public/` at those names and sizes —
a simple green square with the white bolt (see `public/favicon.svg`) works
well.

## What's stubbed vs. real

- **Storage** — fully real, backed by `localStorage` (see `src/lib/storage.ts`).
  Nothing is mocked; every screen reads and writes real data on this device.
- **Free-plan customer limit (20)** — enforced in `ShopContext.tsx`.
- **Payments** — not wired up. When you're ready to charge for Pro, the
  simplest path without a server is Paystack's client-side popup
  (`react-paystack`), which on success just flips the local `shop.plan` to
  `'pro'`. If you later want billing to survive a device switch, that's the
  point at which you'd introduce a lightweight account (see below).
- **"Brought back" / "Nudges sent" counts** — reflect what the owner has
  tapped in Retain (Send / Came back), not delivery or read receipts. wa.me
  can't report those back, so the copy on Today is intentionally honest about
  that.
- **Push notifications** ("3 people went quiet today") — not included; this
  needs a server to schedule them, which is out of scope for a local-first
  app. A same-device alternative is a local reminder via the Notifications
  API when the PWA is opened.

## If you want optional cloud backup later

Keep the app local-first by default, and add an *optional* "Back up my list"
button that only syncs to a server (e.g. Supabase) when someone deliberately
taps it — asking for just an email at that moment, not a signup gate up
front. Most owners will never see it.

## Design tokens

See `tailwind.config.js` — green (`brand`) for the logo and primary actions,
amber (`quiet`) for customers going quiet, terracotta (`lost`) for long-silent
customers, and WhatsApp's own green reserved only for the send button, so
colour carries meaning instead of decorating.
