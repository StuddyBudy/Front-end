"use client";

import { useState, useEffect, useRef } from "react";

import type { Page, ThemeDef, LayoutItem } from "./types";
import { BUILT_IN_THEMES, applyTheme } from "./themes";
import { LS, DEFAULT_LAYOUT, lsGet, lsSet } from "./storage";

import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import DashboardView from "./components/DashboardView";
import SettingsView from "./components/SettingsView";

import s from "./Dashboard.module.css";

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────────
// Owns all state: page routing, theme, layout, sidebar, edit mode.
// Passes data + callbacks down — components stay stateless where possible.
export default function DashboardPage() {
    // ── Navigation ──
    const [page, setPage] = useState<Page>("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // ── Edit mode ──
    const [editMode, setEditMode] = useState(false);
    const [savedLayout, setSavedLayout] =
        useState<LayoutItem[]>(DEFAULT_LAYOUT);
    const [workingLayout, setWorkingLayout] =
        useState<LayoutItem[]>(DEFAULT_LAYOUT);

    // ── Themes ──
    const [themeId, setThemeId] = useState("ember");
    const [customThemes, setCustomThemes] = useState<ThemeDef[]>([]);

    // ── Grid measurement ──
    const mainRef = useRef<HTMLElement>(null);
    const [gridWidth, setGridWidth] = useState(900);

    // ── Hydrate from localStorage after mount (SSR-safe) ──
    useEffect(() => {
        setSavedLayout(lsGet(LS.layout, DEFAULT_LAYOUT));
        setWorkingLayout(lsGet(LS.layout, DEFAULT_LAYOUT));
        setThemeId(localStorage.getItem(LS.themeId) || "ember");
        setCustomThemes(lsGet(LS.customThemes, []));
    }, []);

    // ── Merge built-in + custom themes into one map ──
    const allThemes: Record<string, ThemeDef> = {
        ...BUILT_IN_THEMES,
        ...Object.fromEntries(customThemes.map((t) => [t.id, t])),
    };

    // ── Apply theme CSS variables whenever themeId or customThemes changes ──
    useEffect(() => {
        const theme = allThemes[themeId] || BUILT_IN_THEMES.ember;
        applyTheme(theme);
        localStorage.setItem(LS.themeId, themeId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [themeId, customThemes]);

    // ── Measure main element width for GridLayout ──
    useEffect(() => {
        if (!mainRef.current) return;
        const ro = new ResizeObserver((entries) => {
            const w = entries[0].contentRect.width;
            if (w > 0) setGridWidth(w - 2);
        });
        ro.observe(mainRef.current);
        return () => ro.disconnect();
    }, []);

    // ── Edit mode handlers ────────────────────────────────────────────────────
    const handleStartEdit = () => {
        setWorkingLayout(savedLayout);
        setEditMode(true);
    };
    const handleSaveEdit = () => {
        setSavedLayout(workingLayout);
        lsSet(LS.layout, workingLayout);
        setEditMode(false);
    };
    const handleCancelEdit = () => {
        setWorkingLayout(savedLayout);
        setEditMode(false);
    };

    // ── Theme handlers ────────────────────────────────────────────────────────
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

    // ── Navigation handler ────────────────────────────────────────────────────
    const handleNavigate = (nextPage: Page) => {
        setPage(nextPage);
        setEditMode(false);
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className={s.appShell}>
            <TopBar
                page={page}
                editMode={editMode}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
            />

            <div className={s.bodyRow}>
                <main className={s.mainContent} ref={mainRef}>
                    {page === "dashboard" && (
                        <DashboardView
                            editMode={editMode}
                            layout={editMode ? workingLayout : savedLayout}
                            onLayoutChange={
                                editMode ? setWorkingLayout : undefined
                            }
                            gridWidth={gridWidth}
                        />
                    )}
                    {page === "settings" && (
                        <SettingsView
                            allThemes={allThemes}
                            activeThemeId={themeId}
                            customThemeIds={customThemes.map((t) => t.id)}
                            onThemeChange={handleThemeChange}
                            onAddTheme={handleAddCustomTheme}
                            onDeleteTheme={handleDeleteCustomTheme}
                        />
                    )}
                </main>
            </div>

            <BottomNav page={page} onNavigate={handleNavigate} />
        </div>
    );
}
