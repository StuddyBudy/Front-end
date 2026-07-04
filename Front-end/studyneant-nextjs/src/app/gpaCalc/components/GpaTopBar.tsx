"use client";

import { useState } from "react";
import AppDrawer, { HamburgerBtn } from "@/components/sidebar/Sidebar";
import c from "@/components/top-bar/top-bar.module.css";
import type { GpaState } from "../types";
import { PARTNER_SCHOOLS } from "../types";
import p from "../GpaCalc.module.css";

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
            className={p.quickActionBtn}
            onClick={() => {
                onOpenSetup();
                setDrawerOpen(false);
            }}
        >
            <span className={p.quickActionIcon}>⚙</span>
            <span>GPA Setup / Settings</span>
        </button>
    );

    return (
        <>
            <header className={c.topBar}>
                <div className={c.topBarLeft + " " + p.topBarLeft}>
                    {/* Hamburger → shared app-wide nav drawer */}
                    <HamburgerBtn
                        open={drawerOpen}
                        onClick={() => setDrawerOpen((o) => !o)}
                    />

                    <span className={c.topBarTitle}>📊 GPA Calc</span>

                    {schoolLabel && (
                        <span className={p.schoolBadge}>
                            {partnerSchool ? "✓ " : ""}
                            {schoolLabel}
                        </span>
                    )}

                    {/* Marking period tabs */}
                    <div className={p.mpTabs}>
                        {sortedPeriods.map((period) => (
                            <button
                                key={period.id}
                                className={`${p.mpTab} ${activePeriodId === period.id ? p.mpTabActive : ""}`}
                                onClick={() => onPeriodChange(period.id)}
                            >
                                {period.name}
                                {period.isCurrent && (
                                    <span className={p.mpCurrentDot}>●</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={c.topBarRight}>
                    {lastUpdated && (
                        <span className={p.updatedMeta}>
                            ⓘ Updated {fmtTime(lastUpdated)}
                        </span>
                    )}
                    <button className={c.tbBtn} onClick={onRefresh}>
                        ↻ Refresh
                    </button>
                    <button className={c.tbBtn} onClick={onImport}>
                        ⬆ Import CSV
                    </button>
                    <button
                        className={c.tbBtn + " " + c.tbBtnAccent}
                        onClick={onAddCourse}
                    >
                        + Add Course
                    </button>
                    <button className={c.tbBtn} onClick={onOpenSetup}>
                        ⚙ Setup
                    </button>
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
