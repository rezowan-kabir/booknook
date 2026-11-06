# BookNook — Next.js 16 + React 19

## Commands

| Action | Command |
|--------|---------|
| Start dev server (Turbopack) | `npm run dev` |
| Build for production | `npm run build` |
| Start production server | `npm run start` |
| Lint | `npm run lint` |

**Order matters:** Run `lint` before `build`. There is no separate `typecheck` script — Type errors are caught by `tsc` via `isolatedModules`/`strict` in `tsconfig.json` and will block the build.

## Project structure

- **App Router** (`src/app/`) — Pages and layouts use Next.js 16 App Router.
- **Components** (`src/components/`) — shadcn/ui primitives + custom UI (navbar, etc.).
- **Contexts** (`src/contexts/`) — `ThemeProvider`/`useTheme` toggles light/dark via `classList.toggle("dark")` on `<html>`.
- **Hooks** (`src/hooks/`) — `useIsMobile` uses `window.matchMedia` with a 768px breakpoint.
- **Lib** (`src/lib/`) — Re-exports `cn` from the `cn` package; `utils.ts` is a thin wrapper.
- **Fonts** — `next/font` auto-optimizes Playfair Display, Inter, Geist Mono. No custom `next-font` config needed.
- **Tailwind CSS v4** — Config in `next.config.ts`; Tailwind rules (`.css` loading via Turbopack) are defined there. `components.json` has `tailwind.css: "src/app/globals.css"`.
- **Path aliases** — `@/` maps to `./src/*` (tsconfig.json). Use `import ... from "@/..."` throughout.

## Key quirks

- **React Compiler** (`reactCompiler: true`) is enabled in `next.config.ts`. Components may behave differently than in classic RSC setups — avoid assuming `useState`/`useEffect` ordering conventions from older Next.js versions.
- **Tailwind CSS v4** with `turbopack` rule for `*.css` — CSS is processed by Turbopack, not the standard webpack loader. Editing `globals.css` requires a full reload.
- **No test scripts** are defined in `package.json`. If you add tests, decide on a framework (Jest, Vitest, etc.) and add scripts manually.
- **Theme toggle** persists only in memory + `classList`. There is no server-side persistence or `localStorage` bridge — adding persistence is a common change.
- **`next/font`** fonts are optimized and inlined. Do not `import` them manually or `next build` may complain about duplicate fonts.

## Adding a new page

1. Create `src/app/<page>/page.tsx` (or `src/app/<page>/layout.tsx`).
2. Use `import ... from "@/components/..."` for shadcn/ui components.
3. Wrap the page tree in `<ThemeProvider>` if it needs theme awareness (it's already a parent of `RootLayout`).
4. Run `npm run dev` to see the page at `http://localhost:3000/<page>`.

## Browser support

- Next.js 16 / React 19 — verify compatibility if you add older dependency versions.
- Tailwind CSS v4 may have different className semantics compared to v3 — double-check class merging when using the `cn` utility.