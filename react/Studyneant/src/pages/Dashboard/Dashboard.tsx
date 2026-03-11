import { useState, useEffect, useRef } from "react";

import type { Page, ThemeDef, LayoutItem } from "./types";
import { BUILT_IN_THEMES, applyTheme } from "./themes";
import { LS, DEFAULT_LAYOUT, lsGet, lsSet } from "./storage";

import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import DashboardView from "./components/DashboardView";
import SettingsView from "./components/SettingsView";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Dashboard.css";

// ── DASHBOARD (root shell) ────────────────────────────────────────────────────
// Responsibilities:
//   • Owns all top-level state (page, theme, layout, sidebar)
//   • Persists theme + layout to localStorage
//   • Passes data + callbacks down to child components
//   • Renders the app chrome (TopBar, Sidebar, BottomNav) and the active page
export default function Dashboard() {
    // ── Navigation ──
    const [page, setPage] = useState<Page>("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // ── Edit mode ──
    const [editMode, setEditMode] = useState(false);
    const [savedLayout, setSavedLayout] = useState<LayoutItem[]>(() =>
        lsGet(LS.layout, DEFAULT_LAYOUT),
    );
    const [workingLayout, setWorkingLayout] = useState<LayoutItem[]>(() =>
        lsGet(LS.layout, DEFAULT_LAYOUT),
    );

    // ── Themes ──
    const [themeId, setThemeId] = useState<string>(
        () => localStorage.getItem(LS.themeId) || "ember",
    );
    const [customThemes, setCustomThemes] = useState<ThemeDef[]>(() =>
        lsGet(LS.customThemes, []),
    );

    // ── Grid width (measured from the main element) ──
    const mainRef = useRef<HTMLElement>(null);
    const [gridWidth, setGridWidth] = useState(900);

    // Merge built-in + user-created themes into one map
    const allThemes: Record<string, ThemeDef> = {
        ...BUILT_IN_THEMES,
        ...Object.fromEntries(customThemes.map((t) => [t.id, t])),
    };

    // Apply theme CSS variables whenever themeId or customThemes changes
    useEffect(() => {
        const theme = allThemes[themeId] || BUILT_IN_THEMES.ember;
        applyTheme(theme);
        localStorage.setItem(LS.themeId, themeId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [themeId, customThemes]);

    // Track main element width for GridLayout
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
        setEditMode(false); // always exit edit mode when changing page
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="app-shell">
            <TopBar
                page={page}
                editMode={editMode}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
            />

            <div className="body-row">
                <Sidebar
                    open={sidebarOpen}
                    page={page}
                    onToggle={() => setSidebarOpen((o) => !o)}
                    onNavigate={handleNavigate}
                />

                <main className="main-content" ref={mainRef}>
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

                    {(page === "notes" ||
                        page === "grades" ||
                        page === "calendar") && (
                        <div className="placeholder-page">
                            <span className="placeholder-emoji">🚧</span>
                            <p>This page is coming soon.</p>
                        </div>
                    )}
                </main>
            </div>

            <BottomNav page={page} onNavigate={handleNavigate} />
        </div>
    );
}
