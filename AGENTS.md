# BookNook — Next.js 16 + React 19

## Commands

| Action | Command |
|--------|---------|
| Start dev server (Turbopack) | `npm run dev` |
| Build for production | `npm run build` |
| Start production server | `npm run start` |
| Lint | `npm run lint` |

**Order matters:** Run `lint` before `build`. There is no `typecheck` script — `next build` runs `tsc` (`strict`, `noEmit`) and fails on type errors. There are **no tests and no CI**: `npm run lint` + `npm run build` is the full verification gate.

## Environment

Env files are gitignored (`.env*`) — a fresh clone has none. This working tree already has a populated `.env`; `.env.local` also works and takes precedence.

```
BACKEND_BASE_URL=http://localhost:8000
BACKEND_NEW_ARRIVEL_URL=http://localhost:8000/new-arrivals   # spelling "ARRIVEL" is intentional — match it exactly
NEXT_PUBLIC_IMGBB_API_KEY=your_key_here                       # ImgBB uploads on add-book
MONGO_DB_URL=...                                              # MongoDB — required by Better Auth (src/lib/auth.ts)
BETTER_AUTH_SECRET=...  BETTER_AUTH_URL=http://localhost:3000 # Better Auth
```

- A separate backend service (port 8000) must be running for most pages to render. The homepage's `NewArrivals` server component (`cache: "no-store"`) degrades to a "temporarily unavailable" notice when the backend is down — it still **throws** if `BACKEND_NEW_ARRIVEL_URL` is unset (a config error worth surfacing). `/all-books` degrades to an error toast; `/all-books/:id` renders a "Failed to load book details" page on network failure.
- Only `NEXT_PUBLIC_*` vars are inlined into client components; the others are `undefined` in the browser. Note that `all-books/page.tsx` and `add-book/page.tsx` are `"use client"` yet read `BACKEND_BASE_URL` — all-books guards it with a hardcoded `http://localhost:8000` fallback, add-book has none. Put backend calls in server components or route handlers (or promote the var to `NEXT_PUBLIC_`).
- `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` are absent, so `next build` prints `[Better Auth]: Social provider github is missing clientId or clientSecret` — harmless, but social sign-in can't work until they're added.

## Project structure

- **App Router** (`src/app/`) — Routes: `/`, `/all-books`, `/all-books/:id`, `/add-book`, `/login`, `/register`, `/my-books`, `/my-borrows`, plus `/api/auth/[...all]`. Root layout wraps everything in `ThemeProvider` + `Navbar` + `Footer` + `Toaster` (sonner).
- **Components** (`src/components/`) — shadcn/ui primitives (`src/components/ui/`, config in `components.json`, style `base-nova`, lucide icons — add more with `npx shadcn add <name>`) + custom components (navbar, footer, banner, new-arrivals, top-categories, borrowing-steps, reader-reviews, home-navigation).
- **Contexts** (`src/contexts/`) — `ThemeProvider`/`useTheme` toggles light/dark via `classList.toggle("dark")` on `<html>`. **No persistence** — resets on refresh.
- **Hooks** (`src/hooks/`) — `useIsMobile` uses `window.matchMedia` with 768px breakpoint.
- **Lib** (`src/lib/`) — `utils.ts` re-exports `cn` from the `cn` package; `auth.ts` (server Better Auth config, MongoDB adapter) and `auth-client.ts` (browser client).
- **Fonts** — `next/font` loads Playfair Display (serif headings), Inter (sans body), Geist Mono. CSS variables: `--font-playfair`, `--font-inter`, `--font-geist-mono`.
- **Path aliases** — `@/` maps to `./src/*` (tsconfig.json). Use `import ... from "@/..."` throughout.

## Key quirks

- **Borrow is not wired up.** `all-books/[id]/BorrowBookModal.jsx` has the API POST commented out (`// TODO: Connect your borrow API here`) — submitting only shows a success toast, no backend call. Same file also falls back to a hardcoded borrower name/email.
- **Auth = Better Auth** (email/password, MongoDB adapter, db `booknook`). `/login` and `/register` call `authClient` (`src/lib/auth-client.ts`) → `POST /api/auth/*` (`src/app/api/auth/[...all]/route.ts` → `src/lib/auth.ts`). `autoSignIn: false` — a successful registration redirects to `/login`. The configured social provider is `github`, **not** Google — the Google buttons just show an info toast. `BETTER_AUTH_URL` is read in a client file without `NEXT_PUBLIC_`, so it's `undefined` in the browser and falls back to same-origin (fine: the API route lives in this app).
- **Session not wired into the UI yet.** The navbar accepts a `user` prop but the layout renders `<Navbar />` with none (`useSession` is unused), and `add-book/page.tsx` still hardcodes user name/email (`"Rezowan Kabir"`, `"example@gmail.com"`). Replace both with real session data.
- **Stub routes** — `/my-books` and `/my-borrows` render placeholder text only; no data fetching.
- **Mixed JS/TS** — `all-books/[id]/page.jsx` and `BorrowBookModal.jsx` are the only `.jsx` files (explicitly listed in tsconfig `include`). Write new code as `.tsx`.
- **React Compiler** (`reactCompiler: true`) is enabled in `next.config.ts`. Components may behave differently than classic RSC setups — avoid assuming `useState`/`useEffect` ordering conventions from older Next.js versions.
- **Tailwind CSS v4** with a `turbopack` rule for `*.css` — CSS is processed by Turbopack, not webpack. Editing `globals.css` requires a full reload.
- **No test scripts** in `package.json`. If you add tests, pick a framework (Jest, Vitest, etc.) and add scripts manually.
- **`next/font`** fonts are optimized and inlined. Do not `import` them manually or `next build` may complain about duplicate fonts.
- **External images** — `next.config.ts` `images.remotePatterns` allows `images.unsplash.com`, `i.ibb.co`, `**.ibb.co`, `imgbb.com`, `**.postimages.org`, and `localhost`. Add new domains there if needed.
- **Backend API** — GET `${BACKEND_BASE_URL}/all-books` and `/all-books/:id`; POST `${BACKEND_BASE_URL}/add-book`.

## Adding a new page

1. Create `src/app/<route>/page.tsx` (App Router). Theme awareness comes from the root layout's `ThemeProvider` — no need to wrap again.
2. Use `import ... from "@/components/ui/..."` for shadcn/ui components.
