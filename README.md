# Capsule Dating MVP

A neon-drenched, cyberpunk-arcade dating playground. Walk into a 3D lobby,
wander past themed vending machines, and crack open "person capsules" to reveal
random matches — personality hints first, photo after mutual interest.

> Pure MVP: mock data, mock auth (localStorage), no backend required.

## ✨ Features

- **Landing page** with playful neon/cyberpunk hero & feature explainer.
- **3D lobby** built with CSS 3D transforms (no WebGL). Auto-rotating world with
  vending-machine pods you can hover and click.
- **5 themed machines**: Otaku Vault, Distortion Den (rock), Pulse Pump
  (fitness), Atelier Pod (artsy), Hustle Hub (entrepreneur).
- **Machine detail page** showing capsules in stock with rarity tags and hidden
  hints.
- **Capsule reveal page** with a multi-stage Framer Motion animation:
  `prompt → spinning → personality hints → photo unlock`.
- **Profile page** for revealed matches (mock data) and a personal
  `/profile/me` page showing your credits, mock top-up buttons, and pull history.
- **Mock auth** (login/register) stored entirely in `localStorage`. Each new
  account starts with **3 free credits**; each capsule pull costs **1 credit**.
- Mobile-first responsive layout using Tailwind CSS.
- Icons via `lucide-react`, animations via `framer-motion`.

## 🧱 Tech stack

- **Next.js 15+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **lucide-react**

## 🚀 Getting started

```bash
# 1. install
npm install

# 2. run dev
npm run dev
```

Open <http://localhost:3000>.

### Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the dev server                 |
| `npm run build`    | Production build                     |
| `npm run start`    | Run the production build             |
| `npm run lint`     | Lint with Next.js ESLint config      |
| `npm run typecheck` | TypeScript type-check (`tsc --noEmit`) |

## 🎮 How to play

1. Click **Enter the lobby** from the landing page.
2. (Optional) Create an account from `/register` — you'll get 3 free credits.
3. Walk/rotate the lobby (use the ⟲ ⟳ buttons, or move your pointer). Hover a
   machine to highlight it, click to open it.
4. On the machine page, click **Pull random capsule** (costs 1 credit).
5. Watch the reveal: personality hints first, then unlock the photo.
6. Find your saved pulls on `/profile/me`.

## 🗂️ Project structure

```
src/
  app/
    layout.tsx              # root layout + global styles
    page.tsx                # landing page
    lobby/page.tsx          # CSS-3D lobby room
    machine/[id]/page.tsx   # capsule list for a theme
    machine/[id]/reveal/page.tsx  # animated reveal flow
    profile/[id]/page.tsx   # a matched person's profile
    profile/me/page.tsx     # your account + pull history
    login/page.tsx          # mock login
    register/page.tsx       # mock register (3 free credits)
    not-found.tsx
    globals.css
  components/               # Navbar, NeonButton, Credits, Reveal
  data/mock-data.ts         # people, machines, capsules
  lib/                      # types, auth/credits hooks, utils
```

## 💳 Credits & auth model

- All state lives in `localStorage` under the `capsule-dating:*` keys.
- `useAuth()` (in `src/lib/auth.ts`) exposes `user`, `register`, `login`,
  `logout`, `addCredits`, `spendCredit`, `recordMatch`, and `matches`.
- New users: **3 free credits**. Each pull: **−1 credit**. `/profile/me` has
  mock "+3 / +5 / +10" top-up buttons (demo only — no real payment).

## 📝 Notes

- Profiles and people are hardcoded in `src/data/mock-data.ts` — pull a capsule
  and you'll get a randomized one from that machine's pool.
- Photos use Unsplash CDN URLs; avatars are illustrative mock data.
- The "mutual interest" photo unlock is free in this MVP (no real matching
  server).

## 📦 Deployment

Deployable anywhere Next.js runs (Vercel recommended):

```bash
npm run build && npm run start
```

---

Made with neon, capsules, and a little too much coffee. Enjoy. 🌸🎸💪🎨🚀