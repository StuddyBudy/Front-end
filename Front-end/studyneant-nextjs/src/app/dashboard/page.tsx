"use client";

import { useState, useEffect, useRef } from "react";

import type { LayoutItem } from "./types";
import { DEFAULT_LAYOUT, layoutStore } from "./storage";
import { useStorageStore } from "@/hooks/storageStore";

import TopBar from "@/components/top-bar/top-bar";
import BottomNav from "@/components/bottomNav/BottomNav";
import DashboardView from "./components/DashboardView";

import s from "./Dashboard.module.css";

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────────
// Owns dashboard state: layout, edit mode.
// Passes data + callbacks down — components stay stateless where possible.
export default function DashboardPage() {
    const page = "dashboard" as const;

    // ── Edit mode ──
    const [editMode, setEditMode] = useState(false);

    // ── Layout + themes ──
    // Read through the shared stores (useSyncExternalStore, see ./storage.ts):
    // the prerender/hydration snapshot is the default, persisted values arrive
    // right after hydration, and writes persist automatically. workingLayout
    // is a plain edit buffer — handleStartEdit copies savedLayout into it.
    const [savedLayout, setSavedLayout] = useStorageStore(layoutStore);
    const [workingLayout, setWorkingLayout] =
        useState<LayoutItem[]>(DEFAULT_LAYOUT);

    // (Theme application moved to the global <ThemeApplier /> in the root
    // layout — it subscribes to the same stores, so it stays live here too.)

    // ── Grid measurement ──
    const mainRef = useRef<HTMLElement>(null);
    const [gridWidth, setGridWidth] = useState(900);

    // ── Measure main element width for GridLayout ──
    useEffect(() => {
        if (!mainRef.current) return;
        const ro = new ResizeObserver((entries) => {
            const width = entries[0].contentRect.width;
            if (width > 0) setGridWidth(width - 2);
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
        setSavedLayout(workingLayout); // persists via the store
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
