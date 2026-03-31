"use client";

import { useEffect, useMemo, useState } from "react";

import type { ThemeDef } from "../dashboard/types";
import { BUILT_IN_THEMES, applyTheme } from "../dashboard/themes";
import { LS, lsGet, lsSet } from "../dashboard/storage";

import TopBar from "../dashboard/components/TopBar";
import SettingsView from "../dashboard/components/SettingsView";
import BottomNav from "../../components/bottomNav/BottomNav";

import s from "../dashboard/Dashboard.module.css";

export default function SettingsPage() {
    const page = "settings" as const;
    const [themeId, setThemeId] = useState(() =>
        typeof window === "undefined"
            ? "ember"
            : localStorage.getItem(LS.themeId) || "ember",
    );
    const [customThemes, setCustomThemes] = useState<ThemeDef[]>(() =>
        typeof window === "undefined" ? [] : lsGet(LS.customThemes, []),
    );

    const allThemes: Record<string, ThemeDef> = useMemo(
        () => ({
            ...BUILT_IN_THEMES,
            ...Object.fromEntries(customThemes.map((t) => [t.id, t])),
        }),
        [customThemes],
    );

    useEffect(() => {
        const theme = allThemes[themeId] || BUILT_IN_THEMES.ember;
        applyTheme(theme);
        localStorage.setItem(LS.themeId, themeId);
    }, [allThemes, themeId]);

    const handleThemeChange = (id: string) => setThemeId(id);

    const handleAddCustomTheme = (theme: ThemeDef) => {
        const updated = [
            ...customThemes.filter((t) => t.id !== theme.id),
            theme,
        ];
        setCustomThemes(updated);
        lsSet(LS.customThemes, updated);
        setThemeId(theme.id);
    };

    const handleDeleteCustomTheme = (id: string) => {
        const updated = customThemes.filter((t) => t.id !== id);
        setCustomThemes(updated);
        lsSet(LS.customThemes, updated);
        if (themeId === id) setThemeId("ember");
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
                        customThemeIds={customThemes.map((t) => t.id)}
                        onThemeChange={handleThemeChange}
                        onAddTheme={handleAddCustomTheme}
                        onDeleteTheme={handleDeleteCustomTheme}
                    />
                </main>
            </div>

            <BottomNav />
        </div>
    );
}
