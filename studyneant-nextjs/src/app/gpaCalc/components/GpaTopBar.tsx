"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { GpaState } from "../types";
import { PARTNER_SCHOOLS } from "../types";
import s from "../GpaCalc.module.css";

const NAV = [
    { href: "/dashboard", icon: "🏠", label: "Dashboard" },
    { href: "/notes", icon: "📝", label: "Notes" },
    { href: "/calendar", icon: "📅", label: "Calendar" },
    { href: "/toDo", icon: "✅", label: "To-Do" },
    { href: "/gpaCalc", icon: "📊", label: "GPA Calc" },
    { href: "/settings", icon: "⚙️", label: "Settings" },
] as const;

type Props = {
    state: GpaState;
    activePeriodId: string | null;
    onPeriodChange: (id: string) => void;
    onAddCourse: () => void;
    onImport: () => void;
    onRefresh: () => void;
    onOpenSetup: () => void; // ← re-opens the setup wizard
    lastUpdated: Date | null;
};

export default function GpaTopBar({
    state,
    activePeriodId,
    onPeriodChange,
    onAddCourse,
    onImport,
    onRefresh,
    onOpenSetup,
    lastUpdated,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const partnerSchool = state.config.partnerId
        ? PARTNER_SCHOOLS.find((p) => p.id === state.config.partnerId)
        : null;
    const schoolLabel =
        partnerSchool?.name ?? state.config.customSchoolName ?? "";

    const sortedPeriods = [...state.periods].sort((a, b) => a.order - b.order);

    const fmtTime = (d: Date) =>
        d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
        });

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

                    <span className={s.topBarTitle}>📊 GPA Calc</span>

                    {/* Partner / school badge */}
                    {schoolLabel && (
                        <span className={s.schoolBadge}>
                            {partnerSchool ? "✓ " : ""}
                            {schoolLabel}
                        </span>
                    )}

                    {/* Marking period tabs */}
                    <div className={s.mpTabs}>
                        {sortedPeriods.map((p) => (
                            <button
                                key={p.id}
                                className={`${s.mpTab} ${activePeriodId === p.id ? s.mpTabActive : ""}`}
                                onClick={() => onPeriodChange(p.id)}
                            >
                                {p.name}
                                {p.isCurrent && (
                                    <span
                                        style={{
                                            marginLeft: 4,
                                            fontSize: "0.52rem",
                                            opacity: 0.75,
                                        }}
                                    >
                                        ●
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={s.topBarRight}>
                    {/* Last updated */}
                    {lastUpdated && (
                        <span
                            style={{
                                fontSize: "0.70rem",
                                color: "var(--dash-text-muted)",
                                whiteSpace: "nowrap",
                            }}
                        >
                            ⓘ Updated {fmtTime(lastUpdated)}
                        </span>
                    )}

                    {/* ── Buttons ── */}
                    <button
                        className={s.tbBtn}
                        onClick={onRefresh}
                        title="Recalculate"
                    >
                        ↻ Refresh
                    </button>
                    <button className={s.tbBtn} onClick={onImport}>
                        ⬆ Import CSV
                    </button>
                    <button
                        className={`${s.tbBtn} ${s.tbBtnAccent}`}
                        onClick={onAddCourse}
                    >
                        + Add Course
                    </button>

                    {/* ── Settings — re-opens the setup wizard ── */}
                    <button
                        className={s.tbBtn}
                        onClick={onOpenSetup}
                        title="Setup: school, GPA scale, marking periods"
                        style={{ gap: 5 }}
                    >
                        ⚙ Setup
                    </button>

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

            {/* App nav drawer */}
            {drawerOpen && (
                <>
                    <div
                        className={s.drawerOverlay}
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className={s.drawer}>
                        <div className={s.drawerHeader}>
                            <span className={s.drawerBrand}>◈ StudyOS</span>
                            <button
                                className={s.drawerClose}
                                onClick={() => setDrawerOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={s.drawerSectionLabel}>Navigate</div>
                        <nav className={s.drawerNav}>
                            {NAV.map(({ href, icon, label }) => {
                                const active =
                                    pathname === href ||
                                    pathname.startsWith(href + "/");
                                return (
                                    <button
                                        key={href}
                                        className={`${s.drawerLink} ${active ? s.drawerLinkActive : ""}`}
                                        onClick={() => {
                                            router.push(href);
                                            setDrawerOpen(false);
                                        }}
                                    >
                                        <span className={s.drawerLinkIcon}>
                                            {icon}
                                        </span>
                                        <span className={s.drawerLinkText}>
                                            {label}
                                        </span>
                                        {active && (
                                            <span className={s.drawerLinkBadge}>
                                                here
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                        <div className={s.drawerSectionLabel}>
                            Quick Actions
                        </div>
                        <div style={{ padding: "4px 10px" }}>
                            <button
                                className={s.drawerLink}
                                onClick={() => {
                                    onOpenSetup();
                                    setDrawerOpen(false);
                                }}
                            >
                                <span className={s.drawerLinkIcon}>⚙</span>
                                <span className={s.drawerLinkText}>
                                    GPA Setup / Settings
                                </span>
                            </button>
                        </div>
                        <div className={s.drawerFooter}>
                            StudyOS © {new Date().getFullYear()}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
