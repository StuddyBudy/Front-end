"use client";

import { useClock, getGreeting } from "../hooks/useClock";
import type { Page } from "../types";
import s from "../Dashboard.module.css";

function EditIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                display: "inline",
                verticalAlign: "middle",
                marginRight: 4,
            }}
        >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

type Props = {
    page: Page;
    editMode: boolean;
    onStartEdit: () => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
};

export default function TopBar({
    page,
    editMode,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
}: Props) {
    const now = useClock();

    const dateStr = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <header className={s.topBar}>
            <div className={s.topLeft}>
                <span className={s.topDate}>{dateStr}</span>
                <span className={s.topSep}>·</span>
                <span className={s.topTime}>{timeStr}</span>
                <span className={s.topSep}>·</span>
                <span className={s.topWeather}>🌤 72°F</span>
            </div>

            <div className={s.topCenter}>
                <span className={s.topGreeting}>
                    {getGreeting(now)}, <strong>Username</strong>
                </span>
            </div>

            <div className={s.topRight}>
                {page === "dashboard" && !editMode && (
                    <button className={`${s.topBtn}`} onClick={onStartEdit}>
                        <EditIcon /> Edit Dashboard
                    </button>
                )}
                {editMode && (
                    <>
                        <button
                            className={`${s.topBtn} ${s.topBtnAccent}`}
                            onClick={onSaveEdit}
                        >
                            ✓ Save Layout
                        </button>
                        <button
                            className={`${s.topBtn} ${s.topBtnGhost}`}
                            onClick={onCancelEdit}
                        >
                            ✕ Cancel
                        </button>
                    </>
                )}
                <div className={s.profileAvatar}>
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                </div>
            </div>
        </header>
    );
}
