# 2026-07-16 — /codebase-touchup session (Fable 5)

**Scope:** `Front-end/studyneant-nextjs/src/**` only. Excluded: everything else
(prototype `Front-end/frontend/`, `public/`, configs, lockfiles, `test.css`).
Baseline commit `16f8225` captured pre-existing working-tree changes first.

## Overall finding

Codebase is in good shape — the storage/hooks/utils layers (gpaCalc/utils,
calendar/storage, useCalendar, toDo/storage, storageStore) were already
thoroughly commented by the 2026-07-01/04/06 sessions. No dead exports, no dead
components, no orphaned CSS modules found. Touchup surface was concentrated in
a few large components.

## Safe changes applied (renames + comments only, no behavior)

- `gpaCalc/components/WhatIfPannel.tsx` — documented the what-if
  weighted-average algorithm (the repo's biggest previously-uncommented block);
  `e`/`t` → `earnedSum`/`totalSum`; reduce accumulator `s` (which shadowed the
  CSS-module import `s`) → `sum`; `n` → `parsed` in `setOverride`.
- `dashboard/components/SettingsView.tsx` — `m`→`match`, `p`→`pos`, `w`→`mix`,
  `v`→`trimmed`; docstrings on `luminance()` (non-linearized approximation),
  `mixHex()`, `inferGradientPos()` (string-match coupling to `gradientImage()`
  — must stay in sync); comments on the 0.52 dark threshold and the hex-alpha
  suffixes in `buildVars()`.
- `calendar/components/WeekView.tsx` — `h`→`hour12`/`hours`, `m`→`minutes`,
  `t`→`time`; docstring on `timeToMinutes`. Left the harmless `/ 1` in `nowTop`
  (logic untouched by policy).
- `calendar/components/MonthView.tsx` — `d`→`dayNum`, `pm/py`→`prevMonth/
  prevYear`, `nm/ny`→`nextMonth/nextYear` (+ notes that dateStr months are
  1-based).
- `calendar/page.tsx` — import block normalized to the standard 4-group order
  used by all other pages.
- Small renames: `dashboard/storage.ts` `s`→`raw`; `dashboard/page.tsx`
  `w`→`width`; `settings/page.tsx` `n`→`suffix`; `hooks/useClock.ts`
  `h`→`hour`; `gpaCalc/components/ImportModal.tsx` `f`→`file`.
- `CLAUDE.md` — added Code Standards section; added `themeApplier/` to the
  shared-components list (was undocumented; added 2026-07-08, commit 559c290).

## Deletion candidates (NOT applied — awaiting user decision)

| file | what | why dead | confidence |
|---|---|---|---|
| `calendar/components/CallTopBar.tsx` | rename → `CalTopBar.tsx` | filename typo; import binding at `calendar/page.tsx` already `CalTopBar`; single import site | high |
| `gpaCalc/components/WhatIfPannel.tsx` | rename → `WhatIfPanel.tsx` | filename typo; binding at `CourseDetailModal.tsx` already `WhatIfPanel`; single import site | high |
| `calendar/page.tsx` (~line 29) | delete `//  useTheme();` remnant | leftover from removed `@/lib/themes` import; theming now global via ThemeApplier | high |
| `toDo/components/ListSidebar.tsx:213-218` | dead drag handle (`⠿`, "Drag to reorder") | no draggable/onDragStart/pointer handler anywhere; `lists[].order` only set on create/duplicate, never user-reordered | medium — may be a planned feature |

## Refinement flags (NOT applied)

| file | improvement | effort |
|---|---|---|
| `SettingsView.tsx` (1209 lines) | dedicated pass: extract ~15 color-math helpers to a util module; pairs with the settings⇄dashboard cross-import cleanup already in CLAUDE.md gotchas | large |
| `toDo/TaskGroup.tsx` (621) + `ListSidebar.tsx` (503) | focused readability pass on the two big stateful components | medium |
| repo-wide | normalize mixed `@/` alias vs deep-relative imports (suggested rule: `@/` for anything outside the feature folder) | small-med |
| 4 big CSS modules (GpaCalc 1844, Calendar 1649, ToDo 1196, Dashboard 1145 lines) | dead-selector audit — out of scope this run | large |

## Errors / friction

- None functional. One CLAUDE.md Edit needed a shorter match string
  (em-dash encoding); one commit-message revision (user rule: no Co-Author
  lines — now codified in CLAUDE.md line 6).

## Phase 2 (same session) — refinement flags executed on user approval

User approved all refinement flags EXCEPT the SettingsView helper-extraction
(still parked). Applied:

- **toDo/TaskGroup.tsx** — component doc-banner; `pct`→`completedPct`,
  `pCfg`→`priorityCfg`, `p`→`prev`; fixed three `(s)` subtask callbacks that
  shadowed the CSS-module import `s`.
- **toDo/ListSidebar.tsx** — component doc-banner; three `p`→`prev` picker
  toggles; removed two stale "FIX (line NN equivalent)" comments referencing a
  defunct review; drag-handle JSX now carries a "decorative only" comment
  (deletion still pending user decision).
- **Import normalization (repo-wide)** — rule adopted: `@/` alias for anything
  outside the importing file's feature folder; within-feature imports stay
  relative. Converted: all 8 page-level `../../components/*` imports
  (BottomNav/TopBar), `layout.tsx` ThemeApplier, landing `page.tsx`
  (NavBar → `@/app/dashboard/...`, AuthModal), `settings/page.tsx` +
  `settings/themes.ts` dashboard imports. Verified zero cross-boundary
  relative imports remain.
- **CSS dead-selector audit (report only, nothing deleted)** — script-based
  defined-vs-referenced diff across all 12 CSS modules. False positives
  excluded: `org`/`w3` (SVG data-URI `www.w3.org`), `react-draggable-dragging`
  / `react-resizable-handle` (`:global()` react-grid-layout hooks),
  `chipA–chipF` (dynamic `s[chipClass(letter)]` access). Genuine orphan
  candidates:
  - `calendar/Calendar.module.css` (6): tbCreateBtn, tbProfileBtn, tbTodayBtn,
    tbToggle, tbToggleBtn, tbToggleBtnActive — old top-bar styles.
  - `dashboard/Dashboard.module.css` (22): bottomNav, bnavIcon, bnavItem,
    bnavItemActive, bnavPlus, sidebar, sidebarBrand, sidebarClosed,
    sidebarLink, sidebarLinkActive, sidebarNav, slIcon, slLabel (superseded by
    shared `components/bottomNav` + `components/sidebar` modules);
    hamburgerBtn, hamburgerOpen, builderLabelHint, placeholderEmoji,
    placeholderPage, tcDel, tcEmojiEmpty, tcEmojiNone, themeGrid.
  - `gpaCalc/GpaCalc.module.css` (26): drawer, drawerBrand, drawerClose,
    drawerFooter, drawerHeader, drawerLink, drawerLinkActive, drawerLinkBadge,
    drawerLinkIcon, drawerLinkText, drawerNav, drawerOverlay,
    drawerSectionLabel (pre-shared-Sidebar drawer); hamburgerBtn,
    hamburgerOpen, formInput, formSelect, setupSelect, hypoCloseBtn,
    hypoSection, hypoTitle, whatIfOriginal, whatIfRow, whatIfRowLabel,
    whatIfSlash, whatIfTaskName (old what-if panel markup).
  - notes/toDo/Weekly/page/authModal/bottomNav/sidebar/top-bar/NavBar modules:
    fully referenced.
  Caveat: static scan — CourseDetailModal/CourseGrid use dynamic bracket
  access, so gpaCalc results were hand-checked for chips but other dynamic
  patterns could exist. Deletion needs user approval + visual spot-check.

## Verification

Phase 1+2: `npm run lint` → zero problems; `npm run build` → static export
succeeds, 11/11 pages generated.
