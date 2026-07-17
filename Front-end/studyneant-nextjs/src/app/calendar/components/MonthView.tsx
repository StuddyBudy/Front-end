"use client";

import type { CalEvent, CalCalendar } from "../types";
import { toYMD, getEventsForDate } from "../storage";
import s from "../Calendar.module.css";

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
    year: number;
    month: number;
    today: Date;
    events: CalEvent[];
    calendars: CalCalendar[];
    onDblClick: (dateStr: string) => void;
    onEventClick: (event: CalEvent) => void;
};

export default function MonthView({
    year,
    month,
    today,
    events,
    calendars,
    onDblClick,
    onEventClick,
}: Props) {
    // ── Build 42-cell grid (6 rows × 7 cols, Sunday-first) ───────────────────
    const firstWeekday = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    type Cell = { date: number; curMonth: boolean; dateStr: string };
    const cells: Cell[] = [];

    // Trailing days from previous month
    for (let i = firstWeekday - 1; i >= 0; i--) {
        const dayNum = daysInPrev - i;
        const prevMonth = month === 0 ? 12 : month; // 1-based for dateStr
        const prevYear = month === 0 ? year - 1 : year;
        cells.push({
            date: dayNum,
            curMonth: false,
            dateStr: `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`,
        });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({
            date: d,
            curMonth: true,
            dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        });
    }

    // Leading days from next month (fill to 42)
    while (cells.length < 42) {
        const dayNum = cells.length - daysInMonth - firstWeekday + 1;
        const nextMonth = month === 11 ? 1 : month + 2; // 1-based for dateStr
        const nextYear = month === 11 ? year + 1 : year;
        cells.push({
            date: dayNum,
            curMonth: false,
            dateStr: `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`,
        });
    }

    const todayStr = toYMD(today);

    // Calendar colour map
    const colorMap = Object.fromEntries(calendars.map((c) => [c.id, c.color]));

    return (
        <div className={s.monthView}>
            {/* Day name headers */}
            <div className={s.dayHeaders}>
                {DAY_HEADERS.map((d) => (
                    <div key={d} className={s.dayHeader}>
                        {d}
                    </div>
                ))}
            </div>

            {/* 6×7 grid — rows are equal height via grid-template-rows:repeat(6,1fr) */}
            <div className={s.monthGrid}>
                {cells.map((cell, idx) => {
                    const isToday = cell.dateStr === todayStr;
                    // getEventsForDate handles visibility filtering + repeat logic
                    const dayDate = new Date(
                        parseInt(cell.dateStr.slice(0, 4)),
                        parseInt(cell.dateStr.slice(5, 7)) - 1,
                        parseInt(cell.dateStr.slice(8, 10)),
                    );
                    const dayEvents = getEventsForDate(
                        events,
                        dayDate,
                        calendars,
                    );
                    const overflow = dayEvents.length - 3;

                    return (
                        <div
                            key={idx}
                            className={[
                                s.dayCell,
                                !cell.curMonth ? s.dayCellOtherMonth : "",
                                isToday ? s.dayCellToday : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            onDoubleClick={() => onDblClick(cell.dateStr)}
                        >
                            {/* Date number — amber circle on today */}
                            <div
                                className={[
                                    s.dayCellNum,
                                    isToday ? s.dayCellNumToday : "",
                                    cell.curMonth && !isToday
                                        ? s.dayCellNumCurMonth
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                {cell.date}
                            </div>

                            {/* Event chips — max 3, then "+N more" */}
                            {dayEvents.slice(0, 3).map((ev) => {
                                const color =
                                    ev.color ||
                                    colorMap[ev.calendarId] ||
                                    "#de8900";
                                return (
                                    <div
                                        key={ev.id}
                                        className={s.eventPill}
                                        style={{
                                            background: color + "28",
                                            color,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEventClick(ev);
                                        }}
                                        title={ev.title}
                                    >
                                        <div
                                            className={s.eventDot}
                                            style={{ background: color }}
                                        />
                                        {!ev.allDay && (
                                            <span className={s.eventPillTime}>
                                                {ev.startTime}
                                            </span>
                                        )}
                                        <span
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {ev.title || "(No title)"}
                                        </span>
                                    </div>
                                );
                            })}

                            {overflow > 0 && (
                                <div className={s.moreEvents}>
                                    +{overflow} more
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
