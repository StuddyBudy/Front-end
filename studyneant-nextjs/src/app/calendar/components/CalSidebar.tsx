"use client";

import { useState } from "react";
import c from "@/components/sidebar/Sidebar.module.css";
import type { CalCalendar } from "../types";
import MiniCalendar from "./MiniCalendar";
import p from "../Calendar.module.css";

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
        <aside className={c.sidePanel + " " + p.sidebar}>
            {/* Mini month calendar */}
            <MiniCalendar today={today} onSelect={onSelectMonth} />

            {/* Calendars visibility list */}
            <div className={p.calListSection}>
                <div className={p.calListHeader}>
                    <span className={c.sidePanelLabel + " " + p.calListTitle}>
                        Calendars
                    </span>
                    <button
                        className={p.calListToggle}
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
                                className={p.calItem}
                                onClick={() => onToggleCalendar(cal.id)}
                            >
                                <div
                                    className={p.calCheckbox}
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
                                <span className={p.calName}>{cal.name}</span>
                            </div>
                        ))}
                        <button className={p.addCalBtn}>+ add</button>
                    </>
                )}
            </div>
        </aside>
    );
}
