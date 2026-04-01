"use client";

import { Fragment, useState } from "react";
import type { SchEvent } from "../types";
import s from "../Dashboard.module.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const HOURS = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM"] as const;
const EVT_COLORS = [
    "#de8900",
    "#5b8dee",
    "#4caf78",
    "#a78bfa",
    "#e05555",
    "#e0a030",
];

const INITIAL_EVENTS: SchEvent[] = [
    { day: 0, hour: 0, label: "Calculus", color: "#de8900" },
    { day: 1, hour: 1, label: "Physics Lab", color: "#5b8dee" },
    { day: 2, hour: 2, label: "Study Group", color: "#4caf78" },
    { day: 3, hour: 0, label: "Calc. Again", color: "#de8900" },
    { day: 4, hour: 3, label: "English", color: "#a78bfa" },
];

export default function ScheduleWidget() {
    const [events, setEvents] = useState<SchEvent[]>(INITIAL_EVENTS);
    const [adding, setAdding] = useState<{ day: number; hour: number } | null>(
        null,
    );
    const [inputVal, setInputVal] = useState("");

    const evMap = Object.fromEntries(
        events.map((e) => [`${e.day}-${e.hour}`, e]),
    );

    const removeEvent = (day: number, hour: number) =>
        setEvents((p) => p.filter((e) => !(e.day === day && e.hour === hour)));

    const commitAdd = () => {
        if (!adding) return;
        const text = inputVal.trim();
        if (text) {
            const color =
                EVT_COLORS[Math.floor(Math.random() * EVT_COLORS.length)];
            setEvents((p) => [
                ...p.filter(
                    (e) => !(e.day === adding.day && e.hour === adding.hour),
                ),
                { ...adding, label: text, color },
            ]);
        }
        setAdding(null);
        setInputVal("");
    };

    return (
        <div className={s.schOuter}>
            <div
                className={s.schGrid}
                style={{
                    gridTemplateColumns: `56px repeat(${DAYS.length}, 1fr)`,
                }}
            >
                <div className={s.schCorner} />
                {DAYS.map((d) => (
                    <div key={d} className={s.schDay}>
                        {d}
                    </div>
                ))}
                {HOURS.map((h, hi) => (
                    <Fragment key={`row-${hi}`}>
                        <div className={s.schHour}>{h}</div>
                        {DAYS.map((_, di) => {
                            const ev = evMap[`${di}-${hi}`];
                            const isAdding =
                                adding?.day === di && adding?.hour === hi;
                            return (
                                <div
                                    key={`c${di}-${hi}`}
                                    className={`${s.schCell} ${ev ? s.schCellHasEv : ""}`}
                                    onClick={() => {
                                        if (!ev && !isAdding) {
                                            setAdding({ day: di, hour: hi });
                                            setInputVal("");
                                        }
                                    }}
                                >
                                    {ev && (
                                        <div
                                            className={s.schEv}
                                            style={{
                                                background: ev.color + "22",
                                                borderLeftColor: ev.color,
                                                color: ev.color,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeEvent(di, hi);
                                            }}
                                            title="Click to remove"
                                        >
                                            {ev.label}
                                        </div>
                                    )}
                                    {isAdding && (
                                        <input
                                            autoFocus
                                            className={s.schInput}
                                            placeholder="Event…"
                                            value={inputVal}
                                            onChange={(e) =>
                                                setInputVal(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                    commitAdd();
                                                if (e.key === "Escape")
                                                    setAdding(null);
                                            }}
                                            onBlur={commitAdd}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </Fragment>
                ))}
            </div>
            <p className={s.schHint}>
                Click empty cell to add event · click event to remove
            </p>
        </div>
    );
}
