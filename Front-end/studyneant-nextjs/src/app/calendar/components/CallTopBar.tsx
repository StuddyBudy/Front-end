"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppDrawer, { HamburgerBtn } from "@/components/sidebar/Sidebar";
import c from "@/components/top-bar/top-bar.module.css";
import type { ViewMode } from "../types";
import { monthLabel } from "../storage";
import p from "../Calendar.module.css";

type Props = {
    viewMode: ViewMode;
    year: number;
    month: number;
    weekStart: Date;
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
            : (() => {
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
              })();

    return (
        <>
            <header className={c.topBar + " " + p.topBar}>
                <div className={c.topBarLeft + " " + p.topBarLeft}>
                    <HamburgerBtn
                        open={drawerOpen}
                        onClick={() => setDrawerOpen((o) => !o)}
                    />
                    <button
                        className={p.topBarBrandBtn}
                        onClick={() => router.push("/dashboard")}
                    >
                        <span className={p.topBarBrand}>◈ StudyNeant</span>
                    </button>
                    <button
                        className={c.tbBtn + " " + p.tbTodayBtn}
                        onClick={onToday}
                    >
                        Today
                    </button>
                    <div className={p.tbNavGroup}>
                        <button className={p.tbNavArrow} onClick={onPrev}>
                            ‹
                        </button>
                        <button className={p.tbNavArrow} onClick={onNext}>
                            ›
                        </button>
                    </div>
                    <span className={p.tbMonthLabel}>{label}</span>
                </div>

                <div className={c.topBarCenter}>
                    <div className={p.tbToggle}>
                        <button
                            className={`${p.tbToggleBtn} ${viewMode === "month" ? p.tbToggleBtnActive : ""}`}
                            onClick={() => onViewChange("month")}
                        >
                            Monthly
                        </button>
                        <button
                            className={`${p.tbToggleBtn} ${viewMode === "week" ? p.tbToggleBtnActive : ""}`}
                            onClick={() => onViewChange("week")}
                        >
                            Weekly
                        </button>
                    </div>
                </div>

                <div className={c.topBarRight + " " + p.topBarRight}>
                    <button
                        className={
                            c.tbBtn + " " + c.tbBtnAccent + " " + p.tbCreateBtn
                        }
                        onClick={onAddEvent}
                    >
                        + Create
                    </button>
                    <button className={p.tbSearchBtn} title="Search">
                        🔍
                    </button>
                    <div className={c.profileAvatar + " " + p.tbProfileBtn}>
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
