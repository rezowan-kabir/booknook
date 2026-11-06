# BookNook — Next.js 16 + React 19

## Commands

| Action | Command |
|--------|---------|
| Start dev server (Turbopack) | `npm run dev` |
| Build for production | `npm run build` |
| Start production server | `npm run start` |
| Lint | `npm run lint` |

**Order matters:** Run `lint` before `build`. No separate `typecheck` script — Type errors are caught by `tsc` via `strict`/`isolatedModules` in `tsconfig.json` and will block the build.

## Environment variables

Create `.env.local` with:

```
BACKEND_BASE_URL=http://localhost:8000   # Backend API base URL
NEXT_PUBLIC_IMGBB_API_KEY=your_key_here  # For image uploads (ImgBB)
```

- `BACKEND_BASE_URL` is used in `all-books/page.tsx`, `all-books/[id]/page.tsx`, and `add-book/page.tsx`. The `all-books` page has a fallback to `http://localhost:8000`; other pages do not — they'll throw if unset.
- `NEXT_PUBLIC_IMGBB_API_KEY` is required for the image upload feature in `add-book/page.tsx`. Without it, uploads fail with a toast error.

## Project structure

- **App Router** (`src/app/`) — Pages and layouts. Root layout wraps everything in `ThemeProvider` + `Navbar` + `Footer` + `Toaster` (sonner).
- **Components** (`src/components/`) — shadcn/ui primitives (`src/components/ui/`) + custom components (navbar, footer, banner, top-categories, borrowing-steps, reader-reviews).
- **Contexts** (`src/contexts/`) — `ThemeProvider`/`useTheme` toggles light/dark via `classList.toggle("dark")` on `<html>`. **No persistence** — resets on refresh.
- **Hooks** (`src/hooks/`) — `useIsMobile` uses `window.matchMedia` with 768px breakpoint.
- **Lib** (`src/lib/`) — Re-exports `cn` from the `cn` package; `utils.ts` is a thin wrapper.
- **Fonts** — `next/font` auto-optimizes Playfair Display (serif headings), Inter (sans body), Geist Mono. CSS variables: `--font-playfair`, `--font-inter`, `--font-geist-mono`.
- **Path aliases** — `@/` maps to `./src/*` (tsconfig.json). Use `import ... from "@/..."` throughout.

## Key quirks

- **React Compiler** (`reactCompiler: true`) is enabled in `next.config.ts`. Components may behave differently than classic RSC setups — avoid assuming `useState`/`useEffect` ordering conventions from older Next.js versions.
- **Tailwind CSS v4** with `turbopack` rule for `*.css` — CSS is processed by Turbopack, not webpack. Editing `globals.css` requires a full reload.
- **No test scripts** are defined in `package.json`. If you add tests, decide on a framework (Jest, Vitest, etc.) and add scripts manually.
- **`next/font`** fonts are optimized and inlined. Do not `import` them manually or `next build` may complain about duplicate fonts.
- **External images** — `next.config.ts` allows `i.ibb.co`, `imgbb.com`, `**.postimages.org`, and `localhost`. Add new domains to `images.remotePatterns` if needed.
- **Auth is placeholder** — `add-book/page.tsx` hardcodes user name/email (`"Rezowan Kabir"`, `"example@gmail.com"`). The navbar accepts `user` prop but login/register routes don't exist yet. Replace with real session data when adding auth.
- **Backend API** — Book data fetches from `${BACKEND_BASE_URL}/all-books` and `${BACKEND_BASE_URL}/all-books/:id`. Add-book POSTs to `${BACKEND_BASE_URL}/add-book`.

## Adding a new page

1. Create `src/app/<page>/page.tsx` (or `src/app/<page>/layout.tsx`).
2. Use `import ... from "@/components/..."` for shadcn/ui components.
3. Theme awareness comes from the root layout's `ThemeProvider` — no need to wrap again.
4. Run `npm run dev` to see the page at `http://localhost:3000/<page>`.

## Browser support

- Next.js 16 / React 19 — verify compatibility if you add older dependency versions.
- Tailwind CSS v4 may have different className semantics compared to v3 — double-check class merging when using the `cn` utility.