"use client";

import { useEffect, useMemo, useState } from "react";

import type { ThemeDef } from "../dashboard/types";
import { BUILT_IN_THEMES, applyTheme } from "./themes";
import { LS, lsGet, lsSet } from "../dashboard/storage";

import TopBar from "../dashboard/components/TopBar";
import SettingsView from "@/app/dashboard/components/SettingsView";
import BottomNav from "../../components/bottomNav/BottomNav";

import s from "../dashboard/Dashboard.module.css";

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

    let n = 2;
    while (normalizedUsed.has(normalizeThemeName(`${fallback} (${n})`))) n++;
    return `${fallback} (${n})`;
}

export default function SettingsPage() {
    const page = "settings" as const;
    const THEME_LIMIT = 15;
    const [themeId, setThemeId] = useState(() =>
        typeof window === "undefined"
            ? "ember"
            : localStorage.getItem(LS.themeId) || "ember",
    );
    const [customThemes, setCustomThemes] = useState<ThemeDef[]>(() =>
        typeof window === "undefined" ? [] : lsGet(LS.customThemes, []),
    );
    const [builtInOverrides, setBuiltInOverrides] = useState<
        Record<string, ThemeDef>
    >(() =>
        typeof window === "undefined"
            ? {}
            : lsGet(LS.builtInThemeOverrides, {}),
    );
    const [deletedBuiltInIds, setDeletedBuiltInIds] = useState<string[]>(() =>
        typeof window === "undefined"
            ? []
            : lsGet(LS.deletedBuiltInThemeIds, []),
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

    useEffect(() => {
        const theme = allThemes[themeId] || BUILT_IN_THEMES.ember;
        applyTheme(theme);
        localStorage.setItem(LS.themeId, themeId);
    }, [allThemes, themeId]);

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
        lsSet(LS.customThemes, updated);
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
            lsSet(LS.builtInThemeOverrides, nextOverrides);
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
        lsSet(LS.customThemes, updated);
    };

    const handleDeleteCustomTheme = (id: string) => {
        if (BUILT_IN_THEMES[id]) {
            const nextDeleted = Array.from(new Set([...deletedBuiltInIds, id]));
            setDeletedBuiltInIds(nextDeleted);
            lsSet(LS.deletedBuiltInThemeIds, nextDeleted);

            const nextOverrides = { ...builtInOverrides };
            delete nextOverrides[id];
            setBuiltInOverrides(nextOverrides);
            lsSet(LS.builtInThemeOverrides, nextOverrides);

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
        lsSet(LS.customThemes, updated);
        if (themeId === id) setThemeId("ember");
    };

    const handleResetSettings = () => {
        setCustomThemes([]);
        setBuiltInOverrides({});
        setDeletedBuiltInIds([]);
        setThemeId("ember");

        localStorage.removeItem(LS.customThemes);
        localStorage.removeItem(LS.builtInThemeOverrides);
        localStorage.removeItem(LS.deletedBuiltInThemeIds);
        localStorage.setItem(LS.themeId, "ember");
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
