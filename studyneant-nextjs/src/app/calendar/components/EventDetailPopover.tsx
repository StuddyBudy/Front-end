"use client";

import { useEffect } from "react";
import type { CalEvent, CalCalendar } from "../types";
import { fromYMD } from "../storage";
import s from "../Calendar.module.css";

type Props = {
    event: CalEvent;
    calendars: CalCalendar[];
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
function formatDateRange(ev: CalEvent): string {
    const start = fromYMD(ev.startDate);
    const opts: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
    };
    const startStr = start.toLocaleDateString("en-US", opts);

    if (ev.allDay) {
        if (ev.startDate === ev.endDate) return `${startStr} · All day`;
        const end = fromYMD(ev.endDate);
        return `${startStr} – ${end.toLocaleDateString("en-US", opts)} · All day`;
    }

    const fmt12 = (t: string) => {
        if (!t) return "";
        const [h, m] = t.split(":").map(Number);
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
    };

    return `${startStr} · ${fmt12(ev.startTime)} – ${fmt12(ev.endTime)}`;
}

function repeatSummary(ev: CalEvent): string | null {
    if (!ev.repeat.enabled) return null;
    const { every, unit, endsMode, endsOn, occurrences } = ev.repeat;
    const freq = every === 1 ? unit : `${every} ${unit}s`;
    let ends = "";
    if (endsMode === "on" && endsOn) {
        ends = ` until ${fromYMD(endsOn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else if (endsMode === "occurrences") {
        ends = ` · ${occurrences} time${occurrences !== 1 ? "s" : ""}`;
    }
    return `Repeats every ${freq}${ends}`;
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function EventDetailPopover({
    event,
    calendars,
    onEdit,
    onDelete,
    onClose,
}: Props) {
    const calendar = calendars.find((c) => c.id === event.calendarId);
    const color = event.color || calendar?.color || "#de8900";
    const repeatInfo = repeatSummary(event);

    // ESC closes
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        // Blurred overlay — same treatment as the full modal
        <div
            className={s.modalOverlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={s.detailPopover}>
                {/* Coloured top stripe */}
                <div className={s.detailStripe} style={{ background: color }} />

                {/* Header row: title + action buttons */}
                <div className={s.detailHeader}>
                    <div className={s.detailTitleRow}>
                        <span
                            className={s.detailDot}
                            style={{ background: color }}
                        />
                        <h2 className={s.detailTitle}>
                            {event.title || "(No title)"}
                        </h2>
                    </div>

                    <div className={s.detailActions}>
                        {/* Edit */}
                        <button
                            className={s.detailActionBtn}
                            onClick={onEdit}
                            title="Edit event"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>

                        {/* Delete */}
                        <button
                            className={`${s.detailActionBtn} ${s.detailActionBtnDanger}`}
                            onClick={onDelete}
                            title="Delete event"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4h6v2" />
                            </svg>
                        </button>

                        {/* Close */}
                        <button
                            className={s.detailActionBtn}
                            onClick={onClose}
                            title="Close"
                        >
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Detail rows */}
                <div className={s.detailBody}>
                    {/* Date / time */}
                    <div className={s.detailRow}>
                        <span className={s.detailRowIcon}>🕐</span>
                        <span className={s.detailRowText}>
                            {formatDateRange(event)}
                        </span>
                    </div>

                    {/* Calendar */}
                    {calendar && (
                        <div className={s.detailRow}>
                            <span className={s.detailRowIcon}>📅</span>
                            <span className={s.detailRowText}>
                                <span
                                    className={s.detailCalDot}
                                    style={{ background: color }}
                                />
                                {calendar.name}
                            </span>
                        </div>
                    )}

                    {/* Location */}
                    {event.location && (
                        <div className={s.detailRow}>
                            <span className={s.detailRowIcon}>📍</span>
                            <span className={s.detailRowText}>
                                {event.location}
                            </span>
                        </div>
                    )}

                    {/* Repeat */}
                    {repeatInfo && (
                        <div className={s.detailRow}>
                            <span className={s.detailRowIcon}>↻</span>
                            <span className={s.detailRowText}>
                                {repeatInfo}
                            </span>
                        </div>
                    )}

                    {/* URL */}
                    {event.repeat.url && (
                        <div className={s.detailRow}>
                            <span className={s.detailRowIcon}>🔗</span>
                            <a
                                href={event.repeat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={s.detailLink}
                            >
                                {event.repeat.url}
                            </a>
                        </div>
                    )}

                    {/* Description */}
                    {event.repeat.description && (
                        <div className={s.detailRow}>
                            <span className={s.detailRowIcon}>📝</span>
                            <div className={s.detailDescBlock}>
                                {event.repeat.description}
                            </div>
                        </div>
                    )}

                    {/* To-do badge */}
                    {event.isTodo && (
                        <div className={s.detailRow}>
                            <span className={s.detailRowIcon}>✅</span>
                            <span className={s.detailRowText}>
                                Added to To-Do list
                            </span>
                        </div>
                    )}

                    {/* No extra details at all */}
                    {!event.location &&
                        !repeatInfo &&
                        !event.repeat.description &&
                        !event.isTodo && (
                            <p className={s.detailEmpty}>
                                No additional details
                            </p>
                        )}
                </div>

                {/* Footer */}
                <div className={s.detailFooter}>
                    <button className={s.detailEditBtn} onClick={onEdit}>
                        Edit event
                    </button>
                </div>
            </div>
        </div>
    );
}
