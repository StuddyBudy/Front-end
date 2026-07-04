"use client";

import { useState, useEffect, useMemo, useRef } from "react";

import type { ThemeDef, LayoutItem } from "./types";
import { BUILT_IN_THEMES, applyTheme } from "../settings/themes";
import { LS, DEFAULT_LAYOUT, lsGet, lsSet } from "./storage";

import TopBar from "../../components/top-bar/top-bar";
import BottomNav from "../../components/bottomNav/BottomNav";
import DashboardView from "./components/DashboardView";

import s from "./Dashboard.module.css";

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────────
// Owns dashboard state: theme, layout, edit mode.
// Passes data + callbacks down — components stay stateless where possible.
export default function DashboardPage() {
    const page = "dashboard" as const;

    // ── Edit mode ──
    // State starts from the same defaults the server prerender used, then a
    // mount effect loads the persisted values. Reading localStorage inside the
    // initializer made the first client render diverge from the static HTML
    // and threw hydration errors for anyone with saved customizations.
    const [editMode, setEditMode] = useState(false);
    const [savedLayout, setSavedLayout] = useState<LayoutItem[]>(DEFAULT_LAYOUT);
    const [workingLayout, setWorkingLayout] =
        useState<LayoutItem[]>(DEFAULT_LAYOUT);

    // ── Themes ──
    const [themeId, setThemeId] = useState("ember");
    const [customThemes, setCustomThemes] = useState<ThemeDef[]>([]);

    // ── Hydrate persisted state after mount ──
    // Declared before the theme-apply effect below so the stored themeId is
    // read before that effect's setItem runs in the same flush.
    useEffect(() => {
        const layout = lsGet(LS.layout, DEFAULT_LAYOUT);
        setSavedLayout(layout);
        setWorkingLayout(layout);
        setThemeId(localStorage.getItem(LS.themeId) || "ember");
        setCustomThemes(lsGet(LS.customThemes, []));
    }, []);

    // ── Grid measurement ──
    const mainRef = useRef<HTMLElement>(null);
    const [gridWidth, setGridWidth] = useState(900);

    // ── Merge built-in + custom themes into one map ──
    const allThemes: Record<string, ThemeDef> = useMemo(
        () => ({
            ...BUILT_IN_THEMES,
            ...Object.fromEntries(customThemes.map((t) => [t.id, t])),
        }),
        [customThemes],
    );

    // ── Apply theme CSS variables whenever themeId or customThemes changes ──
    useEffect(() => {
        const theme = allThemes[themeId] || BUILT_IN_THEMES.ember;
        applyTheme(theme);
        localStorage.setItem(LS.themeId, themeId);
    }, [allThemes, themeId]);

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

    // turns off edit mode if navigating
    const handleNavigate = () => {
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
                    <DashboardView
                        editMode={editMode}
                        layout={editMode ? workingLayout : savedLayout}
                        onLayoutChange={editMode ? setWorkingLayout : undefined}
                        gridWidth={gridWidth}
                    />
                </main>
            </div>

            <BottomNav onNavigate={handleNavigate} />
        </div>
    );
}
