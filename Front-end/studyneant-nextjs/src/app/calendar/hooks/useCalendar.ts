"use client";

import { useState, useEffect, useRef } from "react";
import type { CalendarState, CalEvent, ViewMode } from "../types";
import { loadCalendar, saveCalendar } from "../storage";

export function useCalendar() {
    // All date state resolves in the mount effect below so the server
    // prerender and the client's first render agree. Computing new Date() in
    // render baked the BUILD machine's month into the static HTML, which
    // mismatched whenever the page was viewed in a different month (and the
    // today-highlight mismatched daily). today/weekStart stay null until
    // mounted; the page gates rendering on them.
    const [today, setToday] = useState<Date | null>(null);
    const [state, setState] = useState<CalendarState>({
        calendars: [],
        events: [],
    });
    const [viewMode, setViewMode] = useState<ViewMode>("month");
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState(0);
    const [weekStart, setWeekStart] = useState<Date | null>(null);

    useEffect(() => {
        const now = new Date();
        setToday(now);
        setYear(now.getFullYear());
        setMonth(now.getMonth());
        const d = new Date(now);
        d.setDate(d.getDate() - d.getDay());
        setWeekStart(d);
        setState(loadCalendar());
    }, []);

    // Skip the very first save: it would write the empty pre-hydration state
    // over the user's stored calendar before the mount effect's load lands.
    // Every later state change persists exactly as before.
    const firstSave = useRef(true);
    useEffect(() => {
        if (firstSave.current) {
            firstSave.current = false;
            return;
        }
        saveCalendar(state);
    }, [state]);

    const goToday = () => {
        if (!today) return;
        setYear(today.getFullYear());
        setMonth(today.getMonth());
        const d = new Date(today);
        d.setDate(d.getDate() - d.getDay());
        setWeekStart(d);
    };

    const goPrev = () => {
        if (viewMode === "month") {
            if (month === 0) {
                setYear((y) => y - 1);
                setMonth(11);
            } else setMonth((m) => m - 1);
        } else {
            setWeekStart((d) => {
                if (!d) return d;
                const n = new Date(d);
                n.setDate(n.getDate() - 7);
                return n;
            });
        }
    };

    const goNext = () => {
        if (viewMode === "month") {
            if (month === 11) {
                setYear((y) => y + 1);
                setMonth(0);
            } else setMonth((m) => m + 1);
        } else {
            setWeekStart((d) => {
                if (!d) return d;
                const n = new Date(d);
                n.setDate(n.getDate() + 7);
                return n;
            });
        }
    };

    const addEvent = (event: CalEvent) => {
        setState((prev) => ({ ...prev, events: [...prev.events, event] }));
    };

    const updateEvent = (event: CalEvent) => {
        setState((prev) => ({
            ...prev,
            events: prev.events.map((e) => (e.id === event.id ? event : e)),
        }));
    };

    const deleteEvent = (id: string) => {
        setState((prev) => ({
            ...prev,
            events: prev.events.filter((e) => e.id !== id),
        }));
    };

    const toggleCalendar = (id: string) => {
        setState((prev) => ({
            ...prev,
            calendars: prev.calendars.map((c) =>
                c.id === id ? { ...c, visible: !c.visible } : c,
            ),
        }));
    };

    return {
        state,
        setState,
        viewMode,
        setViewMode,
        year,
        month,
        weekStart,
        goToday,
        goPrev,
        goNext,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleCalendar,
        today,
    };
}
