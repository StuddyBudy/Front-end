"use client";

import { useState } from "react";
import { useCalendar } from "./hooks/useCalendar";
import { makeEvent, toYMD } from "./storage";
// import { useTheme } from "@/lib/themes";
import type { CalEvent } from "./types";

import CalTopBar from "./components/CallTopBar";

import CalSidebar from "./components/CalSidebar";
import MonthView from "./components/MonthView";
import WeekView from "./components/WeekView";
import EventDetailPopover from "./components/EventDetailPopover";
import EventModal from "./components/EventModal";
import BottomNav from "../../components/bottomNav/BottomNav";

import s from "./Calendar.module.css";

// ── MODAL STATE ────────────────────────────────────────────────────────────────
// Two separate states:
//   detailEvent  → user single-clicked an event → show read-only popover
//   editState    → user double-clicked a cell OR hit "Edit" in the popover
type EditState = { event: CalEvent; isNew: boolean } | null;

export default function CalendarPage() {
    //  useTheme();

    const cal = useCalendar();

    const [detailEvent, setDetailEvent] = useState<CalEvent | null>(null);
    const [editState, setEditState] = useState<EditState>(null);

    // Every part of this page (top-bar month label, mini calendar, grids) is
    // derived from the current date, which only exists after useCalendar's
    // mount effect runs — render nothing until then so the server prerender
    // and the first client render are identical (hydration safety).
    const today = cal.today;
    const weekStart = cal.weekStart;
    if (!today || !weekStart) return null;

    // ── Open handlers ──────────────────────────────────────────────────────────

    // Single-click on an existing chip → show detail popover
    const handleEventClick = (event: CalEvent) => {
        setDetailEvent(event);
        setEditState(null);
    };

    // Double-click on a blank cell → open blank create form
    const handleCellDblClick = (dateStr: string, hour?: number) => {
        const defaultCalId = cal.state.calendars[0]?.id ?? "";
        const startHour = hour ?? 9;
        const startTime = `${String(startHour).padStart(2, "0")}:00`;
        const endTime = `${String(Math.min(startHour + 1, 23)).padStart(2, "0")}:00`;
        setDetailEvent(null);
        setEditState({
            isNew: true,
            event: makeEvent(dateStr, defaultCalId, { startTime, endTime }),
        });
    };

    // "Edit" button inside detail popover → promote to full edit form
    const handleEditFromDetail = () => {
        if (!detailEvent) return;
        setEditState({ isNew: false, event: detailEvent });
        setDetailEvent(null);
    };

    // "Delete" button inside detail popover
    const handleDeleteFromDetail = () => {
        if (!detailEvent) return;
        cal.deleteEvent(detailEvent.id);
        setDetailEvent(null);
    };

    // Save from edit modal
    const handleSave = (event: CalEvent) => {
        if (editState?.isNew) cal.addEvent(event);
        else cal.updateEvent(event);
    };

    // "+ Create" top-bar button
    const handleTopBarCreate = () => {
        setDetailEvent(null);
        handleCellDblClick(toYMD(today));
    };

    // Mini calendar navigation
    const handleMiniSelect = (y: number, m: number) => {
        cal.setViewMode("month");
        const diff = (y - cal.year) * 12 + (m - cal.month);
        if (diff > 0) for (let i = 0; i < diff; i++) cal.goNext();
        else if (diff < 0) for (let i = 0; i < -diff; i++) cal.goPrev();
    };

    return (
        <div className={s.shell} suppressHydrationWarning>
            <CalTopBar
                viewMode={cal.viewMode}
                year={cal.year}
                month={cal.month}
                weekStart={weekStart}
                onToday={cal.goToday}
                onPrev={cal.goPrev}
                onNext={cal.goNext}
                onViewChange={cal.setViewMode}
                onAddEvent={handleTopBarCreate}
            />

            <div className={s.body}>
                <CalSidebar
                    calendars={cal.state.calendars}
                    today={today}
                    onToggleCalendar={cal.toggleCalendar}
                    onSelectMonth={handleMiniSelect}
                />

                <div className={s.mainView}>
                    {cal.viewMode === "month" ? (
                        <MonthView
                            year={cal.year}
                            month={cal.month}
                            today={today}
                            events={cal.state.events}
                            calendars={cal.state.calendars}
                            onDblClick={handleCellDblClick}
                            onEventClick={handleEventClick} // ← single click
                        />
                    ) : (
                        <WeekView
                            weekStart={weekStart}
                            today={today}
                            events={cal.state.events}
                            calendars={cal.state.calendars}
                            onDblClick={handleCellDblClick}
                            onEventClick={handleEventClick} // ← single click
                        />
                    )}
                </div>
            </div>

            {/* ── DETAIL POPOVER ── single-click view */}
            {detailEvent && !editState && (
                <EventDetailPopover
                    event={detailEvent}
                    calendars={cal.state.calendars}
                    onEdit={handleEditFromDetail}
                    onDelete={handleDeleteFromDetail}
                    onClose={() => setDetailEvent(null)}
                />
            )}

            {/* ── FULL EDIT MODAL ── double-click create OR "Edit" from popover */}
            {editState && (
                <EventModal
                    event={editState.event}
                    calendars={cal.state.calendars}
                    isNew={editState.isNew}
                    onSave={handleSave}
                    onDelete={cal.deleteEvent}
                    onClose={() => setEditState(null)}
                />
            )}
            <BottomNav />
        </div>
    );
}
