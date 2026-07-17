"use client";

import { useMemo } from "react";

import type { ThemeDef } from "@/app/dashboard/types";
import { BUILT_IN_THEMES } from "./themes";
import {
    themeIdStore,
    customThemesStore,
    builtInOverridesStore,
    deletedBuiltInIdsStore,
} from "@/app/dashboard/storage";
import { useStorageStore } from "@/hooks/storageStore";

import TopBar from "@/components/top-bar/top-bar";
import SettingsView from "@/app/dashboard/components/SettingsView";
import BottomNav from "@/components/bottomNav/BottomNav";

import s from "@/app/dashboard/Dashboard.module.css";

function normalizeThemeName(name: string): string {
    return name.trim().toLowerCase();
}

function ensureUniqueThemeName(
    baseName: string,
    usedNames: string[],
    ignoreId?: string,
    customThemes?: ThemeDef[],
): string {
    const fallback = baseName.trim() || "Custom";
    const normalizedUsed = new Set(usedNames.map(normalizeThemeName));

    if (ignoreId && customThemes) {
        const current = customThemes.find((t) => t.id === ignoreId);
        if (current) normalizedUsed.delete(normalizeThemeName(current.name));
    }

    if (!normalizedUsed.has(normalizeThemeName(fallback))) return fallback;

    let suffix = 2;
    while (normalizedUsed.has(normalizeThemeName(`${fallback} (${suffix})`)))
        suffix++;
    return `${fallback} (${suffix})`;
}

export default function SettingsPage() {
    const page = "settings" as const;
    const THEME_LIMIT = 15;
    // Theme state reads through the stores shared with the dashboard page
    // (useSyncExternalStore, see ../dashboard/storage.ts): the prerender and
    // hydration render see the defaults, persisted values arrive right after
    // hydration, and every setter persists to localStorage automatically.
    const [themeId, setThemeId] = useStorageStore(themeIdStore);
    const [customThemes, setCustomThemes] = useStorageStore(customThemesStore);
    const [builtInOverrides, setBuiltInOverrides] = useStorageStore(
        builtInOverridesStore,
    );
    const [deletedBuiltInIds, setDeletedBuiltInIds] = useStorageStore(
        deletedBuiltInIdsStore,
    );

    const mergedBuiltIns = useMemo(() => {
        const merged: Record<string, ThemeDef> = {};
        Object.values(BUILT_IN_THEMES).forEach((theme) => {
            if (deletedBuiltInIds.includes(theme.id)) return;
            const override = builtInOverrides[theme.id];
            merged[theme.id] = override
                ? {
                      ...theme,
                      ...override,
                      vars: { ...theme.vars, ...override.vars },
                  }
                : theme;
        });
        return merged;
    }, [builtInOverrides, deletedBuiltInIds]);

    const allThemes: Record<string, ThemeDef> = useMemo(
        () => ({
            ...mergedBuiltIns,
            ...Object.fromEntries(customThemes.map((t) => [t.id, t])),
        }),
        [customThemes, mergedBuiltIns],
    );

    const canCreateTheme = Object.keys(allThemes).length < THEME_LIMIT;

    // (Theme application moved to the global <ThemeApplier /> in the root
    // layout — it subscribes to the same stores, so edits here apply live.)

    const handleThemeChange = (id: string) => setThemeId(id);

    const handleAddCustomTheme = (theme: ThemeDef) => {
        if (!canCreateTheme) return;
        const uniqueName = ensureUniqueThemeName(
            theme.name,
            Object.values(allThemes).map((t) => t.name),
        );
        const nextTheme = { ...theme, name: uniqueName };
        const updated = [
            ...customThemes.filter((t) => t.id !== nextTheme.id),
            nextTheme,
        ];
        setCustomThemes(updated);
        setThemeId(nextTheme.id);
    };

    const handleUpdateCustomTheme = (
        id: string,
        patch: Partial<Pick<ThemeDef, "name" | "label" | "vars">>,
    ) => {
        if (BUILT_IN_THEMES[id]) {
            const base = mergedBuiltIns[id] || BUILT_IN_THEMES[id];
            const usedNamesExcludingCurrent = Object.values(allThemes)
                .filter((theme) => theme.id !== id)
                .map((theme) => theme.name);
            const nextName = patch.name
                ? ensureUniqueThemeName(patch.name, usedNamesExcludingCurrent)
                : base.name;

            const nextTheme: ThemeDef = {
                ...base,
                ...patch,
                name: nextName,
                vars: patch.vars ? { ...base.vars, ...patch.vars } : base.vars,
            };

            const nextOverrides = { ...builtInOverrides, [id]: nextTheme };
            setBuiltInOverrides(nextOverrides);
            return;
        }

        const updated = customThemes.map((t) => {
            if (t.id !== id) return t;
            const usedNamesExcludingCurrent = Object.values(allThemes)
                .filter((theme) => theme.id !== id)
                .map((theme) => theme.name);
            const nextName = patch.name
                ? ensureUniqueThemeName(patch.name, usedNamesExcludingCurrent)
                : t.name;

            return {
                ...t,
                ...patch,
                name: nextName,
                vars: patch.vars ? { ...t.vars, ...patch.vars } : t.vars,
            };
        });

        setCustomThemes(updated);
    };

    const handleDeleteCustomTheme = (id: string) => {
        if (BUILT_IN_THEMES[id]) {
            const nextDeleted = Array.from(new Set([...deletedBuiltInIds, id]));
            setDeletedBuiltInIds(nextDeleted);

            const nextOverrides = { ...builtInOverrides };
            delete nextOverrides[id];
            setBuiltInOverrides(nextOverrides);

            if (themeId === id) {
                const fallback =
                    Object.keys(allThemes).find(
                        (themeKey) => themeKey !== id,
                    ) || "ember";
                setThemeId(fallback);
            }
            return;
        }

        const updated = customThemes.filter((t) => t.id !== id);
        setCustomThemes(updated);
        if (themeId === id) setThemeId("ember");
    };

    const handleResetSettings = () => {
        // Each setter persists via its store (keys are rewritten with the
        // defaults rather than removed — identical on next load).
        setCustomThemes([]);
        setBuiltInOverrides({});
        setDeletedBuiltInIds([]);
        setThemeId("ember");
    };

    return (
        <div className={s.appShell}>
            <TopBar
                page={page}
                editMode={false}
                onStartEdit={() => {}}
                onSaveEdit={() => {}}
                onCancelEdit={() => {}}
            />

            <div className={s.bodyRow}>
                <main className={s.mainContent}>
                    <SettingsView
                        allThemes={allThemes}
                        activeThemeId={themeId}
                        editableThemeIds={Object.keys(allThemes)}
                        canCreateTheme={canCreateTheme}
                        themeLimit={THEME_LIMIT}
                        onThemeChange={handleThemeChange}
                        onAddTheme={handleAddCustomTheme}
                        onDeleteTheme={handleDeleteCustomTheme}
                        onUpdateTheme={handleUpdateCustomTheme}
                        onResetSettings={handleResetSettings}
                    />
                </main>
            </div>

            <BottomNav />
        </div>
    );
}
