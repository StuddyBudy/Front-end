"use client";

import { useEffect, useRef } from "react";
import type { CalEvent, CalCalendar } from "../types";
import { toYMD } from "../storage";
import s from "../Calendar.module.css";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const HOUR_HEIGHT = 56; // px per hour slot — matches CSS
const HOURS_LABEL = Array.from({ length: 24 }, (_, i) => {
    if (i === 0) return ""; // midnight label hidden (matches TimeTree style)
    const hour12 = i % 12 || 12; // 0/12 map to 12 on a 12-hour clock
    const ampm = i < 12 ? " AM" : " PM";
    return `${hour12}${ampm}`;
});
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── HELPERS ───────────────────────────────────────────────────────────────────
/** "HH:MM" → minutes past midnight. */
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + (minutes || 0);
}

function eventTop(startTime: string): number {
    return (timeToMinutes(startTime) / 60) * HOUR_HEIGHT;
}

function eventHeight(startTime: string, endTime: string): number {
    const diff = timeToMinutes(endTime) - timeToMinutes(startTime);
    return Math.max((diff / 60) * HOUR_HEIGHT, 22); // min 22px
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────
type Props = {
    weekStart: Date;
    today: Date;
    events: CalEvent[];
    calendars: CalCalendar[];
    onDblClick: (dateStr: string, hour: number) => void;
    onEventClick: (event: CalEvent) => void;
};

export default function WeekView({
    weekStart,
    today,
    events,
    calendars,
    onDblClick,
    onEventClick,
}: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const days: Date[] = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
    });

    const todayStr = toYMD(today);
    const colorMap = Object.fromEntries(calendars.map((c) => [c.id, c.color]));

    // Auto-scroll to current hour on mount
    useEffect(() => {
        if (!scrollRef.current) return;
        const nowHour = new Date().getHours();
        const offset = Math.max(0, (nowHour - 1) * HOUR_HEIGHT);
        scrollRef.current.scrollTop = offset;
    }, []);

    // Current time line position
    const nowTop = (() => {
        const hours = today.getHours();
        const minutes = today.getMinutes();
        return ((hours + minutes / 60) / 1) * HOUR_HEIGHT;
    })();

    return (
        <div className={s.weekView}>
            {/* ── DAY HEADERS ── */}
            <div className={s.wkHeaders}>
                {/* Corner above time column */}
                <div className={s.wkTimeCorner} />

                {days.map((d, i) => {
                    const isToday = toYMD(d) === todayStr;
                    return (
                        <div
                            key={i}
                            className={`${s.wkDayHeader} ${isToday ? s.wkDayHeaderToday : ""}`}
                        >
                            <span className={s.wkDayName}>
                                {DAY_NAMES[d.getDay()]} {d.getDate()}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* ── ALL-DAY ROW ── */}
            <div className={s.wkAllDayRow}>
                <div className={s.wkAllDayLabel}>All-day</div>
                {days.map((d, di) => {
                    const dateStr = toYMD(d);
                    const allDayEvs = events.filter(
                        (e) =>
                            e.allDay &&
                            e.startDate <= dateStr &&
                            e.endDate >= dateStr &&
                            calendars.find((c) => c.id === e.calendarId)
                                ?.visible,
                    );
                    return (
                        <div key={di} className={s.wkAllDayCell}>
                            {allDayEvs.map((ev) => {
                                const color =
                                    ev.color ||
                                    colorMap[ev.calendarId] ||
                                    "#de8900";
                                return (
                                    <div
                                        key={ev.id}
                                        className={s.wkAllDayChip}
                                        style={{
                                            background: color + "33",
                                            color,
                                            borderLeft: `3px solid ${color}`,
                                        }}
                                        onClick={() => onEventClick(ev)}
                                    >
                                        {ev.title || "(No title)"}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* ── SCROLLABLE GRID ── */}
            <div className={s.wkScroll} ref={scrollRef}>
                <div className={s.wkGrid}>
                    {/* Time labels column */}
                    <div className={s.wkTimeCol}>
                        {HOURS_LABEL.map((label, i) => (
                            <div key={i} className={s.wkTimeSlot}>
                                {label && (
                                    <span className={s.wkTimeLabel}>
                                        {label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    {days.map((day, di) => {
                        const dateStr = toYMD(day);
                        const isToday = dateStr === todayStr;
                        const dayEvs = events.filter(
                            (e) =>
                                !e.allDay &&
                                e.startDate === dateStr &&
                                calendars.find((c) => c.id === e.calendarId)
                                    ?.visible,
                        );

                        return (
                            <div
                                key={di}
                                className={`${s.wkDayCol} ${isToday ? s.wkDayColToday : ""}`}
                                style={{ height: HOUR_HEIGHT * 24 }}
                            >
                                {/* Hour slot backgrounds (for double-click) */}
                                {HOURS_LABEL.map((_, hi) => (
                                    <div
                                        key={hi}
                                        className={s.wkHourLine}
                                        style={{
                                            top: hi * HOUR_HEIGHT,
                                            height: HOUR_HEIGHT,
                                        }}
                                        onDoubleClick={() =>
                                            onDblClick(dateStr, hi)
                                        }
                                    />
                                ))}

                                {/* Positioned event blocks */}
                                {dayEvs.map((ev) => {
                                    const color =
                                        ev.color ||
                                        colorMap[ev.calendarId] ||
                                        "#de8900";
                                    const top = eventTop(ev.startTime);
                                    const height = eventHeight(
                                        ev.startTime,
                                        ev.endTime,
                                    );
                                    return (
                                        <div
                                            key={ev.id}
                                            className={s.wkEvent}
                                            style={{
                                                top,
                                                height,
                                                background: color + "28",
                                                borderLeft: `3px solid ${color}`,
                                                color,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEventClick(ev);
                                            }}
                                            title={ev.title}
                                        >
                                            <span className={s.wkEventTitle}>
                                                {ev.title || "(No title)"}
                                            </span>
                                            {height > 30 && (
                                                <span className={s.wkEventTime}>
                                                    {ev.startTime} –{" "}
                                                    {ev.endTime}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* "Now" indicator line — only on today's column */}
                                {isToday && (
                                    <div
                                        className={s.wkNowLine}
                                        style={{ top: nowTop }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
