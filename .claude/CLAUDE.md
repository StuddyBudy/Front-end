# CLAUDE.md — Studyneant working context

## When there is a commit, allow me to edit it as needed and do not attempt to auto correct, you may provide suggestions but that is all

Quick orientation for a fresh Claude Code session. Deep architecture and
feature detail is intentionally **not** duplicated here — see the references
below so this file stays lean (it loads into context every session).

## Related files — what loads, and when

- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** — full architecture + feature
  breakdown. Read **on demand** (plain link, not auto-loaded). Pull it when you
  need depth beyond this file; keeping it out of auto-load keeps per-session
  context cheap.
- **`Claude_local/personal_instructions.md`** — **Personal, not shared.** (gitignored, auto-loaded for Robert only) —
  deliberately **not** imported from this shared file
- **`CLAUDE-SES-NOTES/`** — one dated note per `/codebase-touchup` run. See the
  section at the bottom.

## Where the live app lives

- **`Front-end/studyneant-nextjs/` is the live app and source of truth.** All feature work happens there. (A stray root-level `studyneant-nextjs/` orphan from an old merge was removed 2026-07-04.)
- `Front-end/frontend/` is the original vanilla HTML/CSS/JS prototype — kept for reference (it has a `pass/` password generator never ported forward). **Do not modify unless explicitly asked.**
- `react/Studyneant/` (Vite+React rewrite) was deleted 2026-07-01 after an orphan audit — recoverable from git history if ever needed.

## Commands

Run from `Front-end/studyneant-nextjs/`:

| Command         | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | dev server on :3000              |
| `npm run build` | production build (static export) |
| `npm run start` | serve production build           |
| `npm run lint`  | ESLint                           |

**There are no tests** — no test script or framework exists.

## Per-feature folder convention

Each feature lives under `src/app/<feature>/` (App Router). The full convention is `page.tsx` + `components/` + `hooks/` + `storage.ts` + `types.ts` + `utils.ts`, but **it holds only loosely in practice**:

| Feature     | Actual contents / deviations                                                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `calendar`  | page, components/, hooks/ (`useCalendar.ts`), storage, types — no utils                                                                   |
| `dashboard` | page, components/ (`DashboardView`, `NavBar`, `SettingsView` ⚠ used by settings/landing), storage, types — widgets live in **`widgets/`** |
| `gpaCalc`   | page, components/, storage, types, **utils.ts** (only feature with one) — no hooks                                                        |
| `notes`     | page, components/, storage, types + **nested route `notes/editor/page.tsx`**                                                              |
| `toDo`      | page, components/, storage, types                                                                                                         |
| `settings`  | **only `page.tsx` + `themes.ts`** — biggest deviation                                                                                     |

Shared (cross-feature) code:

- `src/components/` — `authModal/`, `bottomNav/`, `sidebar/`, `top-bar/` (each `.tsx` + `.module.css`)
- `src/hooks/` — `useClock.ts` (the only clock hook; returns `Date | null` — null until hydrated, by design), plus the store primitives `storageStore.ts` (`createStorageStore`/`useStorageStore`) and `useHydrated.ts` added 2026-07-06 (see Hydration rule below).
- Shared types currently live in `src/app/dashboard/types.ts` (the duplicate `src/components/types.ts` was removed 2026-07-04; relocating is a restructure-task decision).

Persistence is browser `localStorage`, handled per-feature in each `storage.ts`. Styling is Tailwind v4 **plus** per-feature CSS Modules (`*.module.css`) — both are in active use; match whichever the file you're editing uses.

## Hydration rule (cause of the 2026-07-04 cleanup; pattern revised 2026-07-06)

The app is a static export, so every page is prerendered at build time and then
hydrated. **Never read `localStorage` or `new Date()` in render or `useState`
initializers** — the server bakes the fallback/build-time value into the HTML and
the client's first render must produce the _same_ output.

Pattern used everywhere (since 2026-07-06, replacing the earlier mount-effect
approach that tripped `react-hooks/set-state-in-effect`): client-only data is an
**external store** read via `useSyncExternalStore`.

- Persisted feature state: each feature's `storage.ts` exports a store built with
  `createStorageStore` (`src/hooks/storageStore.ts`) — `getServerSnapshot` returns
  the deterministic default (matches the baked HTML), the persisted value arrives
  right after hydration, and **`set()` persists automatically** (no manual
  `saveX()` calls next to `setState`, no save-on-change effects, no
  skip-first-save guards). `load()` must stay read-only — it runs during render;
  seed data persists on the first real mutation instead.
- Client-only dates: `useClock()` (ticking `Date | null`) or `useHydrated()`
  (`false` during prerender/hydration, `true` right after) + `useMemo`-derived
  values.
- Expect a brief flash of default state — inherent to static export + client
  storage. The theme/layout stores live in `dashboard/storage.ts` and are shared
  by the dashboard and settings pages.

## Gotchas (2026-07-01 audit, revised 2026-07-04)

- **`Front-end/` is NOT a git submodule** (verified 2026-07-04: no `.gitmodules`, files tracked directly in the outer repo). Ordinary commits; no pointer commits.
- Package manager is **npm**; the app's `package-lock.json` is the only lockfile (the stray `bun.lock` and outer-root `package-lock.json` were removed 2026-07-04).
- The root `Front-end/package.json` and the outer repo's `package.json` are dep-only stubs with no scripts — the real `package.json` is in `Front-end/studyneant-nextjs/`. (Whether the outer stub's deps should exist at all is an open call.)
- Cross-feature imports exist despite the convention: `settings/page.tsx` pulls `SettingsView`, `ThemeDef`, `Dashboard.module.css`, and the theme stores from `dashboard/`; the landing page pulls `NavBar` from `dashboard/components/`. Flagged for the restructure task — do not paper over piecemeal.
- `npm run lint` is clean as of 2026-07-06 (was 17 problems) — keep it that way.
- Static export config (`output: "export"` in `next.config.ts`): no server-side features (API routes, SSR) will work — keep everything client-side/localStorage.
- Commented-out `basePath: "/projects/Studyneant"` in `next.config.ts` hints at the intended hosting path.
- Project naming is unsettled: "Studyneant" vs "Learneant".
- Per the README: check/update the Trello board before and after code changes.

## .claude/CLAUDE-SES-NOTES/ — required for `/codebase-touchup`

`CLAUDE-SES-NOTES/` holds one note file per `/codebase-touchup` session (and other audit/cleanup sessions), recording findings, suggestions, flags, and errors from that run.

**When running the `/codebase-touchup` skill, ALWAYS write a dated note here before the session ends** (e.g. `2026-07-01-repo-audit.md`). A touchup that finishes without a note is incomplete — no exceptions.
