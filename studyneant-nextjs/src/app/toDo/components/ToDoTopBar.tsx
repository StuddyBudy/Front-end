"use client";

import { useState, useRef, useEffect } from "react";
import type { SortMode } from "../types";
import AppDrawer from "./AppDrawer";
import s from "../ToDo.module.css";
import tw from "./Weekly.module.css";

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
            <header className={s.topBar}>
                <div className={s.topBarLeft}>
                    {/* Hamburger → app nav drawer */}
                    <button
                        className={`${s.hamburgerBtn} ${drawerOpen ? s.hamburgerOpen : ""}`}
                        onClick={() => setDrawerOpen((o) => !o)}
                        aria-label="Open navigation"
                    >
                        <span />
                        <span />
                        <span />
                    </button>

                    <span className={s.topBarTitle}>✅ To-Do</span>

                    {view === "lists" && visibleCount > 0 && (
                        <span className={s.topBarMeta}>
                            {totalTasks} task{totalTasks !== 1 ? "s" : ""} ·{" "}
                            {visibleCount} list{visibleCount !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                <div className={s.topBarRight}>
                    {/* ── Lists / Weekly view toggle ── */}
                    <div className={tw.viewToggle}>
                        <button
                            className={`${tw.viewToggleBtn} ${view === "lists" ? tw.viewToggleBtnActive : ""}`}
                            onClick={() => onViewChange("lists")}
                        >
                            📋 Lists
                        </button>
                        <button
                            className={`${tw.viewToggleBtn} ${view === "weekly" ? tw.viewToggleBtnActive : ""}`}
                            onClick={() => onViewChange("weekly")}
                        >
                            📅 Weekly
                        </button>
                    </div>

                    {/* Sort dropdown (only relevant in lists view) */}
                    {view === "lists" && (
                        <div className={s.sortMenuWrap} ref={sortRef}>
                            <button
                                className={s.tbBtn}
                                onClick={() => setSortOpen((o) => !o)}
                            >
                                {cur?.icon} Sort
                            </button>
                            {sortOpen && (
                                <div className={s.sortMenu}>
                                    {SORT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            className={`${s.sortMenuItem} ${sortMode === opt.value ? s.sortMenuItemActive : ""}`}
                                            onClick={() => {
                                                onSortChange(opt.value);
                                                setSortOpen(false);
                                            }}
                                        >
                                            <span className={s.sortMenuCheck}>
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

                    <div className={s.profileAvatar}>
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

            {drawerOpen && <AppDrawer onClose={() => setDrawerOpen(false)} />}
        </>
    );
}
