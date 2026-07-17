import type { LayoutItem, ThemeDef } from "./types";
import { createStorageStore } from "@/hooks/storageStore";

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
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
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

// ── STORES ────────────────────────────────────────────────────────────────────
// Read via useStorageStore (useSyncExternalStore). The theme stores are shared
// by the dashboard AND settings pages (same LS keys), so both routes see the
// same live theme state. Server snapshots are the deterministic defaults baked
// into the prerendered HTML; persisted values arrive right after hydration.

export const layoutStore = createStorageStore<LayoutItem[]>({
    load: () => lsGet(LS.layout, DEFAULT_LAYOUT),
    persist: (v) => lsSet(LS.layout, v),
    server: DEFAULT_LAYOUT,
});

// themeId is stored as a raw string, not JSON — hence no lsGet/lsSet.
export const themeIdStore = createStorageStore<string>({
    load: () => localStorage.getItem(LS.themeId) || "ember",
    persist: (v) => {
        try {
            localStorage.setItem(LS.themeId, v);
        } catch {}
    },
    server: "ember",
});

export const customThemesStore = createStorageStore<ThemeDef[]>({
    load: () => lsGet(LS.customThemes, []),
    persist: (v) => lsSet(LS.customThemes, v),
    server: [],
});

export const builtInOverridesStore = createStorageStore<
    Record<string, ThemeDef>
>({
    load: () => lsGet(LS.builtInThemeOverrides, {}),
    persist: (v) => lsSet(LS.builtInThemeOverrides, v),
    server: {},
});

export const deletedBuiltInIdsStore = createStorageStore<string[]>({
    load: () => lsGet(LS.deletedBuiltInThemeIds, []),
    persist: (v) => lsSet(LS.deletedBuiltInThemeIds, v),
    server: [],
});
