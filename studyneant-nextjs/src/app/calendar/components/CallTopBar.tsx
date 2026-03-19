"use client";

import type { ViewMode } from "../types";
import { monthLabel } from "../storage";
import s from "../Calendar.module.css";

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
        <header className={s.topBar}>
            {/* ── LEFT: brand + nav ─────────────────────────────── */}
            <div className={s.topBarLeft}>
                <span className={s.topBarBrand}>◈ StudyOS</span>

                <button className={s.tbTodayBtn} onClick={onToday}>
                    Today
                </button>

                <div className={s.tbNavGroup}>
                    <button
                        className={s.tbNavArrow}
                        onClick={onPrev}
                        aria-label="Previous"
                    >
                        ‹
                    </button>
                    <button
                        className={s.tbNavArrow}
                        onClick={onNext}
                        aria-label="Next"
                    >
                        ›
                    </button>
                </div>

                <span className={s.tbMonthLabel}>{label}</span>
            </div>

            {/* ── CENTER: Monthly / Weekly toggle ──────────────── */}
            <div className={s.topBarCenter}>
                <div className={s.tbToggle}>
                    <button
                        className={`${s.tbToggleBtn} ${viewMode === "month" ? s.tbToggleBtnActive : ""}`}
                        onClick={() => onViewChange("month")}
                    >
                        Monthly
                    </button>
                    <button
                        className={`${s.tbToggleBtn} ${viewMode === "week" ? s.tbToggleBtnActive : ""}`}
                        onClick={() => onViewChange("week")}
                    >
                        Weekly
                    </button>
                </div>
            </div>

            {/* ── RIGHT: Create + Search + Profile ─────────────── */}
            <div className={s.topBarRight}>
                <button className={s.tbCreateBtn} onClick={onAddEvent}>
                    <span className={s.tbCreatePlus}>+</span>
                    Create
                </button>

                <button
                    className={s.tbSearchBtn}
                    title="Search events"
                    aria-label="Search"
                >
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <line x1="16.5" y1="16.5" x2="22" y2="22" />
                    </svg>
                </button>

                <button className={s.tbProfileBtn} aria-label="Profile">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4
                                 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6
                                 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                        />
                    </svg>
                </button>
            </div>
        </header>
    );
}
