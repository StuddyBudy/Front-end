"use client";

import { useState } from "react";
import s from "../Calendar.module.css";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type Props = {
    today: Date;
    onSelect: (year: number, month: number) => void;
};

export default function MiniCalendar({ today, onSelect }: Props) {
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    const prev = () => {
        if (month === 0) {
            setYear((y) => y - 1);
            setMonth(11);
        } else setMonth((m) => m - 1);
    };
    const next = () => {
        if (month === 11) {
            setYear((y) => y + 1);
            setMonth(0);
        } else setMonth((m) => m + 1);
    };

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const cells: { date: number; cur: boolean }[] = [];
    for (let i = firstDay - 1; i >= 0; i--)
        cells.push({ date: daysInPrev - i, cur: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ date: d, cur: true });
    while (cells.length < 42)
        cells.push({
            date: cells.length - daysInMonth - firstDay + 1,
            cur: false,
        });

    const isToday = (d: number, cur: boolean) =>
        cur &&
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

    const monthName = new Date(year, month, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className={s.miniCal}>
            <div className={s.miniCalHeader}>
                <span className={s.miniCalTitle}>{monthName}</span>
                <div style={{ display: "flex", gap: 2 }}>
                    <button className={s.miniCalNav} onClick={prev}>
                        ‹
                    </button>
                    <button className={s.miniCalNav} onClick={next}>
                        ›
                    </button>
                </div>
            </div>

            <div className={s.miniCalGrid}>
                {DAY_LABELS.map((d, i) => (
                    <div key={i} className={s.miniCalDayHdr}>
                        {d}
                    </div>
                ))}
                {cells.map((cell, i) => (
                    <div
                        key={i}
                        className={[
                            s.miniCalDay,
                            cell.cur
                                ? s.miniCalDayCurMonth
                                : s.miniCalDayOtherMonth,
                            isToday(cell.date, cell.cur)
                                ? s.miniCalDayToday
                                : "",
                        ].join(" ")}
                        onClick={() => {
                            if (cell.cur) onSelect(year, month);
                        }}
                    >
                        {cell.date}
                    </div>
                ))}
            </div>
        </div>
    );
}
