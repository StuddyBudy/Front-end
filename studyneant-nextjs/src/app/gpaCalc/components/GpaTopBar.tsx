"use client";

import { useState } from "react";
import AppDrawer, { HamburgerBtn } from "@/components/AppDrawer";
import type { GpaState } from "../types";
import { PARTNER_SCHOOLS } from "../types";
import s from "../GpaCalc.module.css";

type Props = {
    state: GpaState;
    activePeriodId: string | null;
    onPeriodChange: (id: string) => void;
    onAddCourse: () => void;
    onImport: () => void;
    onRefresh: () => void;
    onOpenSetup: () => void;
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

    // Quick action: re-open setup wizard — passed as a slot to AppDrawer
    const quickActions = (
        <button
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 12px",
                borderRadius: 10,
                background: "none",
                border: "none",
                width: "100%",
                textAlign: "left",
                color: "var(--dash-text-muted, rgba(240,232,216,0.50))",
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "background 0.13s, color 0.13s",
            }}
            onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--dash-text-primary, #f0e8d8)";
            }}
            onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                    "none";
                (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--dash-text-muted, rgba(240,232,216,0.50))";
            }}
            onClick={() => {
                onOpenSetup();
                setDrawerOpen(false);
            }}
        >
            <span
                style={{ fontSize: "1.1rem", width: 26, textAlign: "center" }}
            >
                ⚙
            </span>
            <span>GPA Setup / Settings</span>
        </button>
    );

    return (
        <>
            <header className={s.topBar}>
                <div className={s.topBarLeft}>
                    {/* Hamburger → shared app-wide nav drawer */}
                    <HamburgerBtn
                        open={drawerOpen}
                        onClick={() => setDrawerOpen((o) => !o)}
                    />

                    <span className={s.topBarTitle}>📊 GPA Calc</span>

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
                    <button className={s.tbBtn} onClick={onRefresh}>
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
                    <button className={s.tbBtn} onClick={onOpenSetup}>
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

            {/* Shared nav drawer — with GPA Setup as a quick action */}
            {drawerOpen && (
                <AppDrawer
                    onClose={() => setDrawerOpen(false)}
                    quickActions={quickActions}
                />
            )}
        </>
    );
}
