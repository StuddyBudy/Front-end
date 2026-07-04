# Studyneant — Project Overview

## What this project is (in depth)

Studyneant (working name; "Learneant" is a candidate) is a **client-side student productivity web app**. It bundles the everyday tools a student juggles — schedule, grades, notes, tasks, descion making, and more — into a single dashboard-centric interface.

Currerntly, there is **no backend**: every feature persists to the browser's `localStorage` through a per-feature `storage.ts` module, which makes the app fully static-hostable (and it's configured exactly that way — Next.js static export).

### What the repo contains today

Two generations of the app coexist (a third, an abandoned Vite+React rewrite, was removed 2026-07-01 — see [History](#generation-history)):

1. **`frontend/` — the vanilla prototype (legacy, kept).** A multi-page static site, one folder per tool: `cal/` (calendar), `gpa/` (a two-step GPA wizard), `notes/`, `todo/`, and `pass/` — a **password generator that exists only here**, never ported forward. Plus `index.html`, `style.css`, `theme.js` for the shell and theme toggle. Reference only; not developed.

2. **`studyneant-nextjs/` — the live app.** Next.js 16.1 (App Router), React 19.2, TypeScript 5, Tailwind CSS v4 + CSS Modules. All active development happens here.

Support files at the `Front-end/` root: Tailwind CLI tooling (`package.json`, `input.css`, `bun.lock` — a leftover from earlier Tailwind experiments), `.prettierrc`, `LICENSE`, and the docs you're reading. Note `Front-end/` itself is a **git submodule** of the outer `StudyNeant` wrapper repo.

## Feature list (live app)

| Feature            | Route                             | What it does                                                                                           |
| ------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Dashboard**      | `/` → `src/app/dashboard/`        | Home view: clock (`useClock`) + 4 widgets in `widgets/` (grades, reminders, schedule, to-do summaries) |
| **Calendar**       | `/calendar`                       | Month view with events; `useCalendar` hook drives state                                                |
| **GPA Calculator** | `/gpaCalc`                        | Course/grade entry and GPA computation (`utils.ts` holds the math)                                     |
| **Notes**          | `/notes` + nested `/notes/editor` | Note list plus a dedicated editor route                                                                |
| **To-Do**          | `/toDo`                           | Task list management                                                                                   |
| **Settings**       | `/settings`                       | Theme selection via `themes.ts`                                                                        |

Legacy-only feature: the vanilla prototype's `pass/` password generator (not in the live app).

## Architecture

### App Router layout

```
studyneant-nextjs/src/
├── app/
│   ├── layout.tsx            ← root shell: wraps every page
│   ├── page.tsx              ← landing/home
│   ├── globals.css           ← global styles + Tailwind
│   └── <feature>/            ← calendar, dashboard, gpaCalc, notes, toDo, settings
│       ├── page.tsx          ← the route
│       ├── components/       ← feature-local UI (dashboard uses widgets/ instead)
│       ├── hooks/            ← feature-local hooks (calendar, dashboard only)
│       ├── storage.ts        ← localStorage read/write for this feature
│       ├── types.ts          ← feature types
│       └── utils.ts          ← pure helpers (gpaCalc only)
├── components/               ← shared UI: authModal/, bottomNav/, sidebar/, top-bar/
└── hooks/useClock.ts         ← shared clock hook (single copy; returns Date | null until mounted)
```

The convention is aspirational — see the deviation table in [CLAUDE.md](./CLAUDE.md). `settings` is just `page.tsx` + `themes.ts`.

### How the pieces connect

- **`layout.tsx`** renders the persistent shell — the shared `sidebar`, `top-bar`, and `bottomNav` components from `src/components/` — around whatever feature page the route resolves to. Navigation between features goes through these shared components.
- **Feature isolation:** each feature owns its state, types, and persistence. `page.tsx` composes the feature's `components/` (or `widgets/`), calls its `hooks/`, and reads/writes through its `storage.ts`. Features don't import from each other; cross-feature UI lives only in `src/components/`.
- **Persistence:** every `storage.ts` is a thin typed wrapper over `localStorage`. No shared storage layer — each feature defines its own keys and (de)serialization.
- **Theming:** `settings/themes.ts` defines the themes; applied globally (CSS variables in `globals.css` / module styles).
- **Auth:** an `authModal` shared component exists as UI, but there's no auth backend — placeholder for future work.
- **Styling:** Tailwind v4 utilities and per-component `*.module.css` files are both in active use, sometimes in the same component.

### Build & deployment shape

`next.config.ts` sets `output: "export"`, `trailingSlash: true`, and unoptimized images: `npm run build` emits a fully static site. A commented-out `basePath: "/projects/Studyneant"` indicates intended hosting under that sub-path. No CI/CD exists in the repo; deploys are manual.

## Generation history

1. **Vanilla prototype** (`frontend/`) — proved out the tools as separate static pages.
2. **Vite + React + TS rewrite** (`react/Studyneant/`) — abandoned early and **removed 2026-07-01**. Justification from the audit: zero inbound references (no imports, no workspace/monorepo config, no path aliases, no CI/deploy references anywhere in the repo); no unique features (GpaCalc/Notes/ToDo were stubs, Calendar never built, all four widget files 0 bytes); and it didn't compile (`Dashboard.tsx` imported a `./components/` folder that didn't exist). Recoverable via git history.
3. **Next.js app** (`studyneant-nextjs/`) — current generation and the only one under development.

## Known issues / improvement backlog

- No tests or test tooling.
- `settings` feature doesn't follow the per-feature convention (its UI, types, and
  storage helpers still live under `dashboard/` — restructure-task item), and its
  persistence is broken (separate fix task).
- Naming undecided (Studyneant vs Learneant).
- Vanilla `pass/` generator: decide whether to port it into the Next.js app or retire it.
- Resolved 2026-07-04 (cleanup/baseline): duplicate `useClock` and shared `types.ts`
  collapsed; single npm lockfile; dead files/exports/CSS pruned; hydration mismatches
  fixed app-wide (see CLAUDE.md "Hydration rule").
