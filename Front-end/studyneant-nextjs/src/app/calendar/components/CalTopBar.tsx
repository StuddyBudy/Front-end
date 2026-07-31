"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppDrawer, { HamburgerBtn } from "@/components/sidebar/Sidebar";
import type { ViewMode } from "../types";
import { monthLabel } from "../storage";
import s from "../Calendar.module.css";

type Props = {
    viewMode: ViewMode;
    year: number;
    month: number;
    weekStart: Date;
    day: Date;
    onToday: () => void;
    onPrev: () => void;
    onNext: () => void;
    onViewChange: (v: ViewMode) => void;
    onAddEvent: () => void;
};

export default function CalTopBar({
    viewMode,
    year,
    month,
    weekStart,
    day,
    onToday,
    onPrev,
    onNext,
    onViewChange,
    onAddEvent,
}: Props) {
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const label =
        viewMode === "month"
            ? monthLabel(year, month)
            : viewMode === "week"
                ? (() => {
                    const end = new Date(weekStart);
                    end.setDate(end.getDate() + 6);
                    return `${weekStart.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    })} – ${end.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}`;
                })()
                : day.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });

    return (
        <>
            <header className={s.topBar}>
                <div className={s.topBarLeft}>
                    <HamburgerBtn
                        open={drawerOpen}
                        onClick={() => setDrawerOpen((o) => !o)}
                    />
                    <button
                        className={s.topBarBrandBtn}
                        onClick={() => router.push("/dashboard")}
                    >
                        <span className={s.topBarBrand}>◈ StudyNeant</span>
                    </button>
                    <button className={s.tbBtn} onClick={onToday}>
                        Today
                    </button>
                    <div className={s.tbNavGroup}>
                        <button className={s.tbNavArrow} onClick={onPrev}>
                            ‹
                        </button>
                        <button className={s.tbNavArrow} onClick={onNext}>
                            ›
                        </button>
                    </div>
                    <span className={s.tbMonthLabel}>{label}</span>
                </div>

                <div className={s.topBarCenter}>
                    <div className={s.viewToggle}>
                        <button
                            className={`${s.viewToggleBtn} ${viewMode === "month" ? s.viewToggleBtnActive : ""}`}
                            onClick={() => onViewChange("month")}
                        >
                            Monthly
                        </button>
                        <button
                            className={`${s.viewToggleBtn} ${viewMode === "week" ? s.viewToggleBtnActive : ""}`}
                            onClick={() => onViewChange("week")}
                        >
                            Weekly
                        </button>
                        <button
                            className={`${s.viewToggleBtn} ${viewMode == "day" ? s.viewToggleBtnActive : ""}`}
                            onClick={() => onViewChange("day")}
                        >
                            Daily
                        </button>
                    </div>
                </div>

                <div className={s.topBarRight}>
                    <button className={s.addEventBtn} onClick={onAddEvent}>
                        + Create
                    </button>
                    <button className={s.tbSearchBtn} title="Search">
                        🔍
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

            {/* Shared navigation drawer */}
            {drawerOpen && <AppDrawer onClose={() => setDrawerOpen(false)} />}
        </>
    );
}
