# BookNook — Next.js 16 + React 19 (App Router)

## Commands

| Action | Command |
|--------|---------|
| Dev server (Turbopack) | `npm run dev` |
| Production build | `npm run build` |
| Production server | `npm run start` |
| Lint | `npm run lint` (runs `eslint` flat config in `eslint.config.mjs`) |

**Verification gate = `npm run lint` then `npm run build`.** There is no `typecheck` script — `next build` runs `tsc` (`strict`, `noEmit`) and fails on type errors. **No tests, no CI** exist; if you add tests, pick a framework and add the script yourself. Lint exits 0 with a handful of warnings (unused vars, one `<img>`), so warnings are tolerated — errors are not. One error rule that bites: `react-hooks/set-state-in-effect` — calling `setState` directly inside `useEffect` **fails lint**; adjust state during render or restructure instead.

Build facts (verified locally):

- `next build` loads `.env` and passes **with the backend on :8000 stopped** — no services needed to build.
- During "Generating static pages" it prints `Failed to load new arrivals: ... DYNAMIC_SERVER_USAGE` from `src/components/new-arrivals.tsx`. That's expected noise: `/` just stays dynamic (ƒ). The build still succeeds.
- No `[Better Auth]: Social provider github is missing clientId...` warning appears — `src/lib/auth.ts` only adds the github provider when both creds are set (they are absent here).

## Environment

- `.env.example` is the tracked template (`.env*` is otherwise gitignored). This tree already has a populated `.env`, which Next loads in dev and build; `.env.local` also works and takes precedence.
- Backend is a separate service at `http://localhost:8000`, source in the sibling repo **`../booknook-server`** (`index.js`, Express + MongoDB, `npm start` = plain `node index.js` — **no watcher, so restart it manually after editing**). Pages still render without it, but with degraded content: homepage `NewArrivals` (server component, `cache: "no-store"`) shows a "temporarily unavailable" notice, `/all-books` shows an error toast, `/all-books/:id`, `/my-borrows` and `/my-books` render a failure state, and `/profile` falls back to zero counts.
- Var split — only `NEXT_PUBLIC_*` exist in the browser:
  - `BACKEND_BASE_URL` — server-side only (`all-books/[id]/page.jsx`, `my-books/page.tsx`, `profile/page.tsx`).
  - `NEXT_PUBLIC_BACKEND_BASE_URL` — browser-side (`/all-books`, `/add-book`, borrow modal, `my-books/my-books-list.tsx`). Client code falls back to `http://localhost:8000` **only when `NODE_ENV === "development"`**; a production build without it throws "not configured". Trailing slashes are stripped before use.
  - `BACKEND_NEW_ARRIVEL_URL` — homepage only. The `ARRIVEL` misspelling is intentional; match it exactly. If unset, `new-arrivals.tsx` **throws** (config error — no fallback).
  - `MONGO_DB_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` — read at module scope by `src/lib/auth.ts`, which throws immediately when `MONGO_DB_URL` is missing.
  - `NEXT_PUBLIC_IMGBB_API_KEY` — ImgBB cover upload on `/add-book` and in the `/my-books` edit dialog (key is exposed to browsers by design; missing key = toast error, not a crash).
  - `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` — optional; absent means no GitHub provider at all. The Google buttons in `/login` and `/register` are stubs that only show an info toast.

## Project structure

- **App Router** (`src/app/`) — `/`, `/all-books`, `/all-books/:id`, `/add-book`, `/login`, `/register`, `/my-books`, `/my-borrows`, `/profile`, `/api/auth/[...all]`. Root layout = `ThemeProvider` + `Navbar` + `main` + `Toaster` (sonner) + `Footer`; theme awareness comes from it, so **don't wrap new pages in `ThemeProvider` again**.
- **Fetch split** — server components fetch in `new-arrivals.tsx` (homepage), `all-books/[id]/page.jsx`, `my-borrows/page.tsx`, `my-books/page.tsx` and `profile/page.tsx`; client pages/components fetch in `all-books/page.tsx`, `add-book/page.tsx`, `BorrowBookModal.jsx`, `my-borrows/my-borrows-list.tsx` and `my-books/my-books-list.tsx`. Backend calls: GET `/all-books`, GET `/all-books/:id`, POST `/add-book`, GET/POST `/my-borrows`, DELETE `/my-borrows/:id`, GET `/my-books/:email`, PUT `/my-books/:id`, DELETE `/my-books/:id`, plus `BACKEND_NEW_ARRIVEL_URL`. `GET /my-borrows` returns a **plain array of every user's records** (no auth scoping). Books carry an `availableCopies` counter (backfilled on all 39 docs; `POST /add-book` seeds it from `totalCopies`; `PUT /my-books/:id` recomputes it as `max(0, newTotal − activeLoans)`) that the borrow/return routes `$inc`.
- **Components** (`src/components/`) — shadcn/ui primitives in `ui/` (config `components.json`, style `base-nova`, lucide icons — add more with `npx shadcn add <name>`) + custom ones (navbar, footer, banner, new-arrivals, top-categories, borrowing-steps, reader-reviews, home-navigation).
- **Lib/hooks/contexts** — `@/lib/auth.ts` (server Better Auth, MongoDB adapter, db `booknook`, `autoSignIn: false`), `@/lib/auth-client.ts` (browser client, no `baseURL` → same-origin `/api/auth/*`), `@/lib/utils.ts` re-exports `cn` from the `cn` package, `@/hooks/use-mobile.ts` (`useIsMobile`, 768px), `@/contexts/ThemeContext.tsx` (toggles `.dark` on `<html>` — **no persistence, resets on refresh**).
- **Fonts/aliases** — `next/font` supplies `--font-playfair`, `--font-inter`, `--font-geist-mono` (never `import` them manually). `@/` → `./src/*`; use it everywhere.

## Key quirks

- **Borrow flow is enforced in the backend, not the UI.** `all-books/[id]/BorrowBookModal.jsx` POSTs to `${NEXT_PUBLIC_BACKEND_BASE_URL}/my-borrows`; the server rejects a second active loan of the same book per `borrowerEmail` (**409**) and an out-of-stock book (**409**), then `$inc`s `availableCopies` by −1 (with a guarded `$gt: 0` update so concurrent borrows can't oversell; a failed insert rolls the copy back). The modal surfaces the server's `message` in its error toast and calls `router.refresh()` on success. The `// TODO: Connect your borrow API here` comment in that file is stale, and the detail page passes no `user` prop, so borrower name/email still fall back to hardcoded values. `page.jsx` reads the real `availableCopies` (falls back to `totalCopies` for legacy docs); at 0 the cover badge and button both say "Not Available".
- **Navbar owns the session.** `navbar.tsx` calls `authClient.useSession()` directly and gates nav links on login — don't look for a `user` prop. Its dropdown "My Profile" links to `/profile` (a real route: session-gated server page rendering `profile-client-view.tsx`). Note: `profile/page.tsx` calls `GET /my-borrow/:email` (singular) — **no such route exists**, so `activeBorrowsCount` silently degrades to 0; fix the path or add the route if you touch it. `useSession` is also exported from `@/lib/auth-client.ts`.
- **`/my-books` is done** (it used to be a stub): `page.tsx` is a server component — `auth.api.getSession({ headers: await headers() })`, a sign-in prompt when logged out, `GET /my-books/:email` (`cache: "no-store"`, degrades to a failure state), then `my-books-list.tsx` (client): a table of books whose `addedBy.email` matches the session, with a shadcn **Dialog** edit form (PUT; backend recomputes `availableCopies`) and an **AlertDialog** delete confirm (DELETE; **409** while any copy is on loan — the toast shows the server's message and the dialog stays open). Base UI gotchas there: `AlertDialogContent` renders **no close X** (Dialog does) — the page adds its own, and `AlertDialogAction` does **not** auto-close — `handleDelete` closes the dialog itself on success. Local list state is seeded from props with **no effect** (`react-hooks/set-state-in-effect` fails lint).
- **`/my-borrows` is done**: `page.tsx` server-fetches `GET /my-borrows` (`cache: "no-store"`, degrades to a failure state) and renders `my-borrows-list.tsx` (client), whose "Return Book" button `DELETE`s `/my-borrows/:id` (record is **deleted**, not marked returned — so returned books vanish from both tables; the archive only shows records already `status: "returned"`), drops the row from local `removedIds` state, then `router.refresh()`s.
- **`/add-book` attributes `addedBy` to the real session** (`useSession`), and `/my-books` filters on `addedBy.email` — this pairing is load-bearing; don't reintroduce hardcoded attribution.
- **Auth flow** — `/register` calls `authClient.signUp.email` then `router.push("/login")`; `/login` pushes `/` on success; logout is `authClient.signOut` in the navbar. `autoSignIn: false`, so sign-up does **not** issue a session cookie — sign in separately.
- **Mixed JS/TS** — only `all-books/[id]/page.jsx` and `BorrowBookModal.jsx` are `.jsx`, and only `page.jsx` is listed in tsconfig `include`. Write new code as `.tsx`.
- **React Compiler** (`experimental.reactCompiler: true` in `next.config.ts`) is on — don't assume classic RSC/`useState` ordering conventions. Also `cacheComponents: false`.
- **Tailwind v4 via Turbopack** — `*.css` runs through `@tailwindcss/turbopack`; editing `globals.css` needs a full reload. Important modifier is the v4 suffix form (`class!`), and `cn()` merges via tailwind-merge (same-variant conflicts: last wins; different-variant conflicts: **both** are kept, so CSS order decides).
- **External images** — `next.config.ts` `images.remotePatterns` allows `images.unsplash.com`, `i.ibb.co`, `**.ibb.co`, `imgbb.com`, `**.postimages.org`, `localhost`. Add new hosts there. The `/my-books` edit dialog previews covers with a raw `<img>` (eslint-disabled) because user-typed URLs may fall outside `remotePatterns`.
- **New page** → `src/app/<route>/page.tsx`; pull UI from `@/components/ui/...`.
