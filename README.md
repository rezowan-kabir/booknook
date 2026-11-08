# BookNook

BookNook is an online library management system — browse the catalog, borrow and return books with live availability tracking, and manage the titles you have contributed, behind a session-based account with a light/dark UI.

**Live site:** [BookNook](https://booknook-rk.vercel.app).


## Features

- Browse a searchable, sortable catalog with live availability counts and full detail pages.
- Borrow and return books with server-enforced rules: one active loan per member and no overselling of the last copy.
- Contribute to the catalog with the Add Book form, then edit or remove your own listings from My Books.
- Secure email/password sign-in (Better Auth) with session-protected pages and an editable member profile.
- Responsive layout with a light/dark theme across the home, catalog, and member pages.

## Tech stack

| Layer | Choices |
| --- | --- |
| Frontend | Next.js 16 (App Router, Turbopack, React Compiler), React 19, TypeScript (strict) |
| Styling & UI | Tailwind CSS v4, shadcn/ui (base-nova style), lucide icons, sonner toasts |
| Authentication | Better Auth with MongoDB adapter + JWT plugin; protected routes via `src/proxy.ts` |
| Backend | Express + MongoDB in the sibling repository [`../booknook-server`](../booknook-server), served on port `8000` |

## Local development

1. Copy the env template and fill in your secrets (a populated `.env` may already exist; `.env.local` takes precedence — restart the dev server after editing env files):

   ```bash
   cp .env.example .env.local
   ```

   You need `MONGO_DB_URL`, `BETTER_AUTH_SECRET`, and `NEXT_PUBLIC_IMGBB_API_KEY`. Keep the `localhost:8000` backend URLs for local work.

2. Start the backend in a second terminal (plain `node`, **no file watcher — restart it manually after edits**):

   ```bash
   cd ../booknook-server
   npm install
   npm start
   ```

3. Install and run the frontend:

   ```bash
   npm ci
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

The frontend also renders without the backend running, but with degraded content (empty catalog notice, error toasts, zero profile counts).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build — also runs the strict TypeScript check |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config in `eslint.config.mjs`) |

Verification gate before you finish a change: `npm run lint`, then `npm run build`. There is no separate `typecheck` script (`next build` runs `tsc` for you) and no test suite yet — if you add tests, add the script alongside them.

## Environment variables

Copy `.env.example` to `.env.local` and adjust. Only `NEXT_PUBLIC_*` variables are exposed to the browser.

| Variable | Required | Value |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | Yes | A unique, random secret of at least 32 characters. |
| `BETTER_AUTH_URL` | Yes | The app's origin with no trailing slash — locally `http://localhost:3000`, in production the deployed origin. |
| `MONGO_DB_URL` | Yes | A MongoDB connection string the app can reach (local or hosted). |
| `BACKEND_BASE_URL` | Yes | Backend API origin with no trailing slash — locally `http://localhost:8000`. Used by server components. |
| `NEXT_PUBLIC_BACKEND_BASE_URL` | Yes | The same backend origin for browser-side requests (catalog, add-book, borrow/return, My Books actions). |
| `BACKEND_NEW_ARRIVEL_URL` | Yes | Full New Arrivals endpoint URL — locally `http://localhost:8000/books/new-arrivals`. The `ARRIVEL` spelling is intentional; match it exactly. |
| `NEXT_PUBLIC_IMGBB_API_KEY` | For image uploads | ImgBB API key. `NEXT_PUBLIC_` means it is visible to browsers; do not put a private key here. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Optional | Set both only when enabling GitHub sign-in. Configure the GitHub OAuth callback for the deployed app. |

## Backend API

The frontend talks to the Express backend in [`../booknook-server`](../booknook-server). All routes except the two public reads require `Authorization: Bearer <Better Auth JWT>`; the backend verifies tokens against the frontend's `/api/auth/jwks`, so it needs its own `FRONTEND_BASE_URL` set to the frontend origin.

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/books` | — | All books, newest first |
| GET | `/books/new-arrivals` | — | Six newest books (homepage) |
| GET | `/books/:id` | Bearer | Single book details |
| GET | `/books/user/:email` | Bearer | Books added by one user |
| POST | `/books` | Bearer | Add a book (`addedBy` comes from the token) |
| PATCH | `/books/:id` | Bearer | Update a book you own |
| DELETE | `/books/:id` | Bearer | Remove a book you own |
| POST | `/borrows` | Bearer | Borrow a book — `409` if already on loan, `400` if no copies left |
| GET | `/borrows/:email` | Bearer | One user's borrow records |
| DELETE | `/borrows/:id` | Bearer | Return a book (deletes the loan record, restores a copy) |

The borrow route decrements stock atomically (`availableCopies: { $gt: 0 }`), so concurrent requests cannot oversell the last copy.

## Project structure

```
src/
├── app/                  # App Router pages: /, /all-books, /all-books/[id], /add-book,
│                         #   /login, /register, /my-books, /my-borrows, /profile,
│                         #   /api/auth/[...all] (Better Auth handler)
├── components/           # Page sections (banner, new-arrivals, navbar, footer, …)
│   └── ui/               # shadcn/ui primitives (add more: npx shadcn add <name>)
├── contexts/             # ThemeContext — light/dark toggle
├── hooks/                # useIsMobile
├── lib/                  # auth.ts (server), auth-client.ts, JWT token helpers, utils.ts
└── proxy.ts              # Route protection + /login?callbackUrl= return handling
```

## Deploy on Vercel

Import this repository into Vercel as a Next.js project. The default install and build commands (`npm install` and `npm run build`) work without a `vercel.json`. Add every variable from the **Environment variables** table above under **Project Settings → Environment Variables** for each environment you use (Production, Preview, and Development as needed).

Do not use `localhost` for backend URLs in Vercel. Deploy the backend separately
and allow requests from the Vercel app's origin (including Preview origins if
needed). The backend must also set `FRONTEND_BASE_URL` to the public frontend
origin used for Better Auth's `/api/auth/jwks` endpoint, so its JWT verifier can
retrieve the signing keys. Set `BETTER_AUTH_URL` to the exact public app origin
for each Vercel environment. After changing environment variables, redeploy so
the new values are applied. Never commit `.env`, `.env.local`, or production
credentials.

Before deploying, run:

```bash
npm run lint
npm run build
```
