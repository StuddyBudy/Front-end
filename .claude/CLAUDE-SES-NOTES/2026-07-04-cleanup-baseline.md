# 2026-07-04 — cleanup/baseline session (audit + janitorial + hydration fixes)

Branch: `cleanup/baseline` (off `rework/react` after committing user WIP as-is).
16 commits, one per unit of work; `npm run build` verified green after each.

## Audit findings (CLAUDE.md was stale — now corrected)

- **`Front-end/` is NOT a git submodule** — no `.gitmodules`, no nested `.git`,
  files tracked directly in the outer repo. The "submodule trap"/pointer-commit
  gotcha was a myth.
- Live app is `Front-end/studyneant-nextjs/`; a root-level `studyneant-nextjs/`
  orphan (one file, stuck in an unresolved DU merge conflict from the revert of
  `46f4d9e`, plus a stale revert sequencer) was resolved via `git rm` +
  `git revert --quit`.
- Undocumented duplicate: `src/components/types.ts` ≡ `dashboard/types.ts`.
- No "military-time setting" exists; the clock hydration culprit was `useClock`.

## What changed

1. **Lockfiles → npm only**: removed `Front-end/bun.lock` + outer-root
   `package-lock.json` (user-authorized). Outer stub `package.json` deps left —
   open call.
2. **Duplicates collapsed**: `dashboard/hooks/useClock.ts` deleted (0 importers);
   `src/components/types.ts` deleted, top-bar repointed to `dashboard/types.ts`.
3. **Dead code removed (user approved batches A/B/D; E rejected)**: toDo
   `AppDrawer.tsx` + `ListPannel.tsx`, root `test.css`; exports `DAY_ABBRS`,
   `HOURS_24`, `clearNotes`; ~65 unused CSS classes across 5 modules (Calendar's
   six `composes` targets kept — composes counts as a reference). Dashboard/GpaCalc
   CSS untouched (dynamic `s[expr]` access defeats static analysis).
4. **Hydration fixed app-wide** (mechanism documented in CLAUDE.md "Hydration
   rule"): localStorage/`new Date()` reads moved from render/useState initializers
   into mount effects on all six pages + `useClock` + `useCalendar`;
   `loadNotes`/`loadTodo` seed writes moved out of render; `useCalendar` gained a
   skip-first-save guard so the empty pre-hydration state can't clobber storage;
   landing footer year got `suppressHydrationWarning`.

## Verification

- Headless-browser console check (Chrome via puppeteer-core) over all 8 routes ×
  {fresh visitor, returning user with seeded custom localStorage}: **0 hydration
  errors**. Detector validated against the pre-fix commit: 10 failing route-checks
  there.
- `npm run build` green; `git status` clean.

## Flags / follow-ups

- `npm run lint`: 17 problems, none blocking — 8 pre-existed the branch
  (unescaped entities in gpaCalc components, unused vars in WIP DashboardView and
  NoteEditor, one setState-in-effect in SettingsView); 9 are the
  `react-hooks/set-state-in-effect` rule firing on the mount-hydration pattern
  itself. Migrating to `useSyncExternalStore` would satisfy the rule — candidate
  follow-up, pairs well with the settings persistence fix.
- Restructure-task backlog (unchanged, do NOT paper over piecemeal): settings'
  UI/types/storage live under `dashboard/`; landing page imports NavBar from
  `dashboard/components/`; shared types' final home.
- Settings persistence bug: untouched per boundary; still broken.
- Expect a brief flash of default state on load — inherent to static export +
  client-side storage; the old "fix" that read storage during render was the
  source of the hydration errors.
