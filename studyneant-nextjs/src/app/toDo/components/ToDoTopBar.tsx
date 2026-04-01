"use client";

import { useState, useRef, useEffect } from "react";
import type { SortMode } from "../types";
import AppDrawer, { HamburgerBtn } from "@/components/AppDrawer";
import s from "../ToDo.module.css";

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
                    {/* Hamburger → shared app-wide nav drawer */}
                    <HamburgerBtn
                        open={drawerOpen}
                        onClick={() => setDrawerOpen((o) => !o)}
                    />
                    <span className={s.topBarTitle}>✅ To-Do</span>
                    <span
                        className={s.topBarMeta}
                        suppressHydrationWarning
                        style={{
                            visibility: visibleCount > 0 ? "visible" : "hidden",
                        }}
                    >
                        {totalTasks} task{totalTasks !== 1 ? "s" : ""} ·{" "}
                        {visibleCount} list{visibleCount !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className={s.topBarRight}>
                    {/* Lists / Weekly toggle */}
                    <div
                        style={{
                            display: "flex",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid var(--dash-border, rgba(223,208,184,0.10))",
                            borderRadius: 8,
                            overflow: "hidden",
                            flexShrink: 0,
                        }}
                    >
                        {(["lists", "weekly"] as ToDoView[]).map((v) => (
                            <button
                                key={v}
                                style={{
                                    padding: "5px 14px",
                                    background:
                                        view === v
                                            ? "var(--dash-bg-handle, rgba(44,35,22,0.97))"
                                            : "transparent",
                                    border: "none",
                                    color:
                                        view === v
                                            ? "var(--dash-accent-warm, #de8900)"
                                            : "var(--dash-text-muted, rgba(240,232,216,0.45))",
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.78rem",
                                    fontWeight: view === v ? 600 : 400,
                                    cursor: "pointer",
                                    transition: "background 0.15s, color 0.15s",
                                    whiteSpace: "nowrap",
                                }}
                                onClick={() => onViewChange(v)}
                            >
                                {v === "lists" ? "📋 Lists" : "📅 Weekly"}
                            </button>
                        ))}
                    </div>

                    {/* Sort — only in lists view */}
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

            {/* Shared navigation drawer */}
            {drawerOpen && <AppDrawer onClose={() => setDrawerOpen(false)} />}
        </>
    );
}
