"use client";

import { useEffect, useRef } from "react";
import type { CalEvent, CalCalendar } from "../types";
import { toYMD } from "../storage";
import s from "../Calendar.module.css";
import ds from "../DayView.module.css"


// Constants (same as weekview)
const HOUR_HEIGHT = 56; // px per hour slot — matches CSS
const HOURS_LABEL = Array.from({ length: 24 }, (_, i) => {
    if (i === 0) return ""; // midnight label hidden (matches TimeTree style)
    const hour12 = i % 12 || 12; // 0/12 map to 12 on a 12-hour clock
    const ampm = i < 12 ? " AM" : " PM";
    return `${hour12}${ampm}`;
});
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helper functions (same as weekview)
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

// Component
type Props = {
    date: Date;
    today: Date;
    events: CalEvent[];
    calendars: CalCalendar[];
    onDblClick: (dateStr: string, hour: number) => void;
    onEventClick: (event: CalEvent) => void;
};
export default function DayView({
                                     date,
                                     today,
                                     events,
                                     calendars,
                                     onDblClick,
                                     onEventClick,
                                 }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const dateStr = toYMD(date);
    const todayStr = toYMD(today);
    const isToday = dateStr === todayStr;
    const colorMap = Object.fromEntries(calendars.map((c) => [c.id, c.color]));

    // Auto-scroll to current hour on mount
    useEffect(() => {
        if (!scrollRef.current) return;
        const nowHour = new Date().getHours();
        const offset = Math.max(0, (nowHour - 1) * HOUR_HEIGHT);
        scrollRef.current.scrollTop = offset;
    }, []);

    // Current timeline position
    const nowTop = (() => {
        const hours = today.getHours();
        const minutes = today.getMinutes();
        return ((hours + minutes / 60) / 1) * HOUR_HEIGHT;
    })();

    const allDayEvs = events.filter(
        (e) =>
            e.allDay &&
            e.startDate <= dateStr &&
            e.endDate >= dateStr &&
            calendars.find((c) => c.id === e.calendarId)?.visible,

    );
    const dayEvs = events.filter(
        (e) =>
            !e.allDay &&
            e.startDate === dateStr &&
            calendars.find((c) => c.id === e.calendarId)?.visible,
    )

    return (
        <div className={ds.dayView}>
            {/* ── DAY HEADER ── */}
            <div className={ds.dayHeader}>
                <span className={s.wkDayName}>
                    {DAY_NAMES[date.getDay()]} {date.getDate()}
                </span>
            </div>

            {/* ── ALL-DAY ROW ── */}
            <div className={ds.dayAllDayRow}>
                <div className={s.wkAllDayLabel}>All-Day</div>
                <div className={ds.dayAllDayCell}>
                    {allDayEvs.map((ev) => {
                       const color =
                            ev.color || colorMap[ev.calendarId] || "#de8900";
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

            </div>

            {/* ── SCROLLABLE GRID ── */}
            <div className={s.wkScroll} ref={scrollRef}>
                <div className={ds.dayGrid}>
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
                </div>
            </div>

            {/* Single Day Column */}
            <div
                className={`${ds.dayCol} ${isToday ? ds.dayColToday : ""}`}
                style={{ height: HOUR_HEIGHT * 24 }}
            >
                {/* Hour Slot Backgrounds */}
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

                {/* Positioned Event Blocks */}
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
                            className={ds.dayEvent}
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
                            <span>
                                {height > 20 && (
                                    <span className={s.wkEventTime}>
                                        {ev.startTime} - {ev.endTime}
                                    </span>
                                )}
                            </span>

                        </div>
                    );
                 })}

                {/* "Now" indicator */}
                {isToday && (
                    <div
                        className={s.wkNowLine}
                        style={{ top: nowTop }}
                        />
                )}
            </div>
        </div>
    );
}
