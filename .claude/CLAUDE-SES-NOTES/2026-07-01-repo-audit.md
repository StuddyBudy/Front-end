# Session notes — 2026-07-01 — Repo audit, Vite-rewrite removal, docs setup

Session type: full repo audit + cleanup (pre-dates the `/codebase-touchup` convention; future touchup sessions get their own dated file here).

## Actions taken

1. Audited all three app generations (findings below).
2. Verified `react/Studyneant/` was orphaned, then removed it via `git rm -r react/Studyneant` (35 files, **staged only — user commits**). Recoverable from git history.
3. Created `README.md` (rewrote, preserving the Learneant/Trello note), `CLAUDE.md`, `PROJECT_OVERVIEW.md`, and this notes folder.
4. Verified documented commands (`npm run lint`, `npm run build`) against the live app — results recorded below.

## NOTES — full findings list

### Generations confirmed

- `frontend/` — vanilla HTML/CSS/JS prototype. **Surprise:** `pass/` password generator exists only here, never ported.
- `react/Studyneant/` — Vite + React 19 + TS rewrite. Abandoned **and broken**: `Dashboard.tsx` imported `./components/TopBar`, `./components/Sidebar`, `./components/BottomNav`, `./components/DashboardView`, `./components/SettingsView` from a folder that didn't exist; all 4 widget files (`GradesWidget`, `RemindersWidget`, `ScheduleWidget`, `ToDoWidget`) were 0 bytes; GpaCalc/Notes/ToDo pages were 9–13-line stubs; Calendar linked in sidebar but never built; stray unimported vanilla-era `script.js`.
- `studyneant-nextjs/` — Next.js 16.1.7 / React 19.2.3 / TS 5 / Tailwind v4 + CSS Modules / App Router / static export. Confirmed live app.

### Deletion justification (orphan audit)

| Check                                                                              | Result                                                                                |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Imports/refs into `react/Studyneant` from anywhere outside it                      | None — all "Studyneant" matches were display strings, package names, or its own files |
| Workspaces / monorepo tooling (npm workspaces, pnpm, lerna, turbo, nx)             | None                                                                                  |
| tsconfig/jsconfig path aliases pointing at it                                      | None — Next.js only aliases `@/* → ./src/*`                                           |
| CI/deploy config (GitHub Actions, vercel.json, netlify.toml, Docker, any yml/yaml) | None exist anywhere in the repo                                                       |
| Unique code/features not in the Next.js app                                        | None — strict subset; only dead/empty files were exclusive                            |

### Flags 🚩

- **`Front-end/` is a git submodule** of the outer `StudyNeant` repo (branch `rework/react`) — commits here need a pointer commit in the outer repo. Outer repo showed pre-existing pointer drift.
- Pre-existing **uncommitted `README.md` edit** in the submodule (the Learneant/Trello note) — content preserved in the new README.
- **Untracked `test.css`** at outer repo root — a color-picking scratchpad; left alone per user decision.
- Outer repo root `package.json` and `Front-end/package.json` are dep-only stubs (no scripts).
- Mixed package managers: `bun.lock` at `Front-end/` root vs npm lockfiles in the apps.

### Errors found

- The deleted rewrite did not compile (unresolved imports in `Dashboard.tsx`; themes/storage imported from `./` but lived at `src/` root).
- Duplicate hook: `src/hooks/useClock.ts` vs `src/app/dashboard/hooks/useClock.ts` in the live app.

### Suggestions 💡

1. **Dedupe `useClock`** — pick one location (suggest `src/hooks/`) and update imports.
2. **Add a test setup** — no test script/framework exists; even a minimal Vitest + React Testing Library config would help.
3. **Settle the name** — Studyneant vs Learneant appears in UI strings, package names, and docs.
4. **Resolve the bun/npm mix** — remove `bun.lock` + root Tailwind CLI tooling if unused (Next.js app has its own Tailwind via PostCSS).
5. **Decide the fate of `frontend/pass/`** — the password generator was never ported; port it as a feature or consciously retire it.
6. **Normalize the `settings` feature** — bring it closer to the per-feature convention (or document `themes.ts` as its intentional shape).
7. **Consider adding CI** — no lint/build check runs anywhere automatically.

## Verification results

- `npm run lint` — ✅ exit 0. One warning (not an error): `'mounted' is assigned a value but never used` in `src/app/dashboard/components/DashboardView.tsx:52`.
- `npm run build` — ✅ exit 0. Compiled in ~4.6s, all 9 routes prerendered static (`/`, `/calendar`, `/dashboard`, `/gpaCalc`, `/notes`, `/notes/editor`, `/settings`, `/toDo`, `/_not-found`). Build banner confirms Next.js **16.1.6** installed (package.json declares `^16.1.7` for eslint-config-next; next itself resolved to 16.1.6). Build also warned about **multiple lockfiles** (`studyneant-nextjs/package-lock.json` vs `Front-end/bun.lock`) — corroborates suggestion #4.
- `git status` in submodule: 35 deletions + docs staged, no commits made.
