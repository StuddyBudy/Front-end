# Studyneant

> Also known as **"Learneant"** and **"StuddyBuddy"** — the name isn't official yet.

Studyneant is a student study-tools web app: a **dashboard**, **calendar**, **GPA calculator**, **notes**, **to-do list**, and **theme settings**, all in one place.

> **STOP — before you start editing, look at me!**
> Before and after updating code, please make sure to check / update the corresponding Trello board.

## Project history (one line)

Vanilla HTML/CSS/JS prototype (`frontend/`) → abandoned Vite+React rewrite (`react/Studyneant/`, removed 2026-07-01 after an orphan audit) → **current Next.js app (`studyneant-nextjs/`) — the source of truth**.

## Tech stack

**Current** (in `studyneant-nextjs/`):

- [Next.js](https://nextjs.org) 16.1 (App Router, static export via `output: "export"`)
- React 19.2
- TypeScript 5
- Tailwind CSS v4 (via `@tailwindcss/postcss`) + per-feature CSS Modules
- ESLint (`eslint-config-next`)
- Data persistence: browser `localStorage` (no backend yet)

**Future / planned:** a backend and auth are anticipated (an `authModal` component already exists in the UI), but nothing is implemented yet.

## Install / Run / Build

All commands run from `studyneant-nextjs/`:

```bash
cd studyneant-nextjs
npm install       # install dependencies
npm run dev       # start dev server (http://localhost:3000)
npm run build     # production build (static export)
npm run start     # serve the production build
npm run lint      # run ESLint
```

There is **no test script** — no test suite exists yet.

## Repository structure

```
Front-end/                  ← this repo (a git submodule of the outer StudyNeant repo)
├── frontend/               ← generation 1: vanilla HTML/CSS/JS prototype (kept for reference;
│                              contains a password generator not ported to later generations)
├── studyneant-nextjs/      ← generation 3: the LIVE Next.js app — work here
│   └── src/app/<feature>/  ← per-feature folders (calendar, dashboard, gpaCalc, notes, toDo, settings)
├── README.md               ← you are here
├── CLAUDE.md               ← working context for Claude Code sessions
├── PROJECT_OVERVIEW.md     ← in-depth architecture & feature docs
└── CLAUDE-SES-NOTES/       ← per-session notes from codebase-touchup runs
```

## Deployment

The Next.js app is configured for **static export** (`next.config.ts`: `output: "export"`, `trailingSlash: true`, unoptimized images). A commented-out `basePath: "/projects/Studyneant"` suggests it's intended to be hosted under that sub-path. There is currently **no CI/CD or deploy configuration in the repo** — builds/deploys are manual.
