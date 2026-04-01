import type { LayoutItem } from "./types";

// ── LOCALSTORAGE KEYS ─────────────────────────────────────────────────────────
export const LS = {
    layout: "studyos_layout",
    themeId: "studyos_themeId",
    customThemes: "studyos_custom_themes",
    builtInThemeOverrides: "studyos_builtin_theme_overrides",
    deletedBuiltInThemeIds: "studyos_deleted_builtin_theme_ids",
} as const;

// ── DEFAULT LAYOUT ────────────────────────────────────────────────────────────
export const DEFAULT_LAYOUT: LayoutItem[] = [
    { i: "grades", x: 0, y: 0, w: 3, h: 7, minW: 2, minH: 4 },
    { i: "todo", x: 3, y: 0, w: 4, h: 7, minW: 2, minH: 4 },
    { i: "reminders", x: 7, y: 0, w: 3, h: 7, minW: 2, minH: 4 },
    { i: "schedule", x: 0, y: 7, w: 10, h: 11, minW: 4, minH: 6 },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
// Both functions are SSR-safe — they check for window before touching localStorage.

export function lsGet<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
        const s = localStorage.getItem(key);
        return s ? (JSON.parse(s) as T) : fallback;
    } catch {
        return fallback;
    }
}

export function lsSet(key: string, val: unknown): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch {}
}
