"use client";

import { useEffect, useMemo } from "react";

import type { ThemeDef } from "@/app/dashboard/types";
import { BUILT_IN_THEMES, applyTheme } from "@/app/settings/themes";
import {
    themeIdStore,
    customThemesStore,
    builtInOverridesStore,
    deletedBuiltInIdsStore,
} from "@/app/dashboard/storage";
import { useStorageStore } from "@/hooks/storageStore";

// Cache of the last-applied theme vars, replayed by the inline <head> script
// in layout.tsx before first paint so a hard refresh never flashes the
// default theme. Raw JSON of the resolved `vars` map.
export const THEME_VARS_CACHE_KEY = "studyos_theme_vars";

// ── GLOBAL THEME APPLIER ──────────────────────────────────────────────────────
// Mounted once in the root layout so the --dash-* vars land on :root for EVERY
// route — previously only the dashboard/settings pages applied the theme, so a
// hard refresh on /calendar, /toDo, or /notes rendered with no theme at all.
// Renders nothing; it only syncs the theme stores to the DOM.
export default function ThemeApplier() {
    const [themeId] = useStorageStore(themeIdStore);
    const [customThemes] = useStorageStore(customThemesStore);
    const [builtInOverrides] = useStorageStore(builtInOverridesStore);
    const [deletedBuiltInIds] = useStorageStore(deletedBuiltInIdsStore);

    // Same resolution the settings page uses for its theme list: built-ins
    // minus deleted ones, overrides merged over their vars, customs on top.
    const theme: ThemeDef = useMemo(() => {
        const all: Record<string, ThemeDef> = {};
        Object.values(BUILT_IN_THEMES).forEach((t) => {
            if (deletedBuiltInIds.includes(t.id)) return;
            const override = builtInOverrides[t.id];
            all[t.id] = override
                ? { ...t, ...override, vars: { ...t.vars, ...override.vars } }
                : t;
        });
        customThemes.forEach((t) => {
            all[t.id] = t;
        });
        return all[themeId] || BUILT_IN_THEMES.ember;
    }, [themeId, customThemes, builtInOverrides, deletedBuiltInIds]);

    // Pure external-system sync — the stores persist the theme state, not this.
    useEffect(() => {
        applyTheme(theme);
        try {
            localStorage.setItem(THEME_VARS_CACHE_KEY, JSON.stringify(theme.vars));
        } catch {}
    }, [theme]);

    return null;
}
