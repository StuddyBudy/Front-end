"use client";

import { useState } from "react";
import type { CalCalendar } from "../types";
import MiniCalendar from "./MiniCalendar";
import s from "../Calendar.module.css";

type Props = {
    calendars: CalCalendar[];
    today: Date;
    onToggleCalendar: (id: string) => void;
    onSelectMonth: (year: number, month: number) => void;
};

export default function CalSidebar({
    calendars,
    today,
    onToggleCalendar,
    onSelectMonth,
}: Props) {
    const [calListOpen, setCalListOpen] = useState(true);

    return (
        <aside className={s.sidebar}>
            {/* Mini month calendar */}
            <MiniCalendar today={today} onSelect={onSelectMonth} />

            {/* Calendars visibility list */}
            <div className={s.calListSection}>
                <div className={s.calListHeader}>
                    <span className={s.calListTitle}>Calendars</span>
                    <button
                        className={s.calListToggle}
                        onClick={() => setCalListOpen((o) => !o)}
                    >
                        {calListOpen ? "∧" : "∨"}
                    </button>
                </div>

                {calListOpen && (
                    <>
                        {calendars.map((cal) => (
                            <div
                                key={cal.id}
                                className={s.calItem}
                                onClick={() => onToggleCalendar(cal.id)}
                            >
                                <div
                                    className={s.calCheckbox}
                                    style={{
                                        borderColor: cal.color,
                                        background: cal.visible
                                            ? cal.color
                                            : "transparent",
                                        color: "#111",
                                    }}
                                >
                                    {cal.visible && "✓"}
                                </div>
                                <span className={s.calName}>{cal.name}</span>
                            </div>
                        ))}
                        <button className={s.addCalBtn}>+ add</button>
                    </>
                )}
            </div>
        </aside>
    );
}
