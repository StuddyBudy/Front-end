"use client";

import { useState, useRef, useEffect } from "react";
import type { SortMode } from "../types";
import AppDrawer, { HamburgerBtn } from "@/components/sidebar/Sidebar";
import c from "@/components/top-bar/top-bar.module.css";
import p from "../ToDo.module.css";

const SORT_OPTIONS: { value: SortMode; label: string; icon: string }[] = [
    { value: "manual", label: "Manual order", icon: "⠿" },
    { value: "alpha", label: "Alphabetical", icon: "A↓" },
    { value: "date", label: "Date created", icon: "📅" },
    { value: "done-last", label: "Done last", icon: "✓↓" },
    { value: "priority", label: "By priority", icon: "↑↓" },
];

export type ToDoView = "lists" | "weekly";

type Props = {
    sortMode: SortMode;
    onSortChange: (m: SortMode) => void;
    view: ToDoView;
    onViewChange: (v: ToDoView) => void;
    visibleCount: number;
    totalTasks: number;
};

export default function ToDoTopBar({
    sortMode,
    onSortChange,
    view,
    onViewChange,
    visibleCount,
    totalTasks,
}: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sortOpen) return;
        const handler = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node))
                setSortOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [sortOpen]);

    const cur = SORT_OPTIONS.find((o) => o.value === sortMode);

    return (
        <>
            <header className={c.topBar}>
                <div className={c.topBarLeft}>
                    {/* Hamburger → shared app-wide nav drawer */}
                    <HamburgerBtn
                        open={drawerOpen}
                        onClick={() => setDrawerOpen((o) => !o)}
                    />
                    <span className={c.topBarTitle}>✅ To-Do</span>
                    <span
                        className={
                            c.topBarMeta +
                            (visibleCount > 0 ? "" : " " + p.topBarMetaHidden)
                        }
                        suppressHydrationWarning
                    >
                        {totalTasks} task{totalTasks !== 1 ? "s" : ""} ·{" "}
                        {visibleCount} list{visibleCount !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className={c.topBarRight}>
                    {/* Lists / Weekly toggle */}
                    <div className={p.viewToggle}>
                        {(["lists", "weekly"] as ToDoView[]).map((v) => (
                            <button
                                key={v}
                                className={
                                    p.viewToggleBtn +
                                    (view === v
                                        ? " " + p.viewToggleBtnActive
                                        : "")
                                }
                                onClick={() => onViewChange(v)}
                            >
                                {v === "lists" ? "📋 Lists" : "📅 Weekly"}
                            </button>
                        ))}
                    </div>

                    {/* Sort — only in lists view */}
                    {view === "lists" && (
                        <div className={p.sortMenuWrap} ref={sortRef}>
                            <button
                                className={c.tbBtn}
                                onClick={() => setSortOpen((o) => !o)}
                            >
                                {cur?.icon} Sort
                            </button>
                            {sortOpen && (
                                <div className={p.sortMenu}>
                                    {SORT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            className={`${p.sortMenuItem} ${sortMode === opt.value ? p.sortMenuItemActive : ""}`}
                                            onClick={() => {
                                                onSortChange(opt.value);
                                                setSortOpen(false);
                                            }}
                                        >
                                            <span className={p.sortMenuCheck}>
                                                {sortMode === opt.value
                                                    ? "✓"
                                                    : ""}
                                            </span>
                                            {opt.icon} {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={c.profileAvatar}>
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    </div>
                </div>
            </header>

            {/* Shared navigation drawer */}
            {drawerOpen && <AppDrawer onClose={() => setDrawerOpen(false)} />}
        </>
    );
}
