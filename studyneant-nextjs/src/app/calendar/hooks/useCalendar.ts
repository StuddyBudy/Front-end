"use client";

import { useState, useEffect, useCallback } from "react";
import type { CalendarState, CalEvent, ViewMode } from "../types";
import { loadCalendar, saveCalendar } from "../storage";

export function useCalendar() {
    const today = new Date();

    const [state, setState] = useState<CalendarState>(() => {
        if (typeof window === "undefined") return { calendars: [], events: [] };
        return loadCalendar();
    });
    const [viewMode, setViewMode] = useState<ViewMode>("month");
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [weekStart, setWeekStart] = useState<Date>(() => {
        const d = new Date(today);
        d.setDate(d.getDate() - d.getDay());
        return d;
    });

    useEffect(() => {
        setState(loadCalendar());
    }, []);
    useEffect(() => {
        saveCalendar(state);
    }, [state]);

    const goToday = () => {
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
                const n = new Date(d);
                n.setDate(n.getDate() + 7);
                return n;
            });
        }
    };

    const addEvent = useCallback((event: CalEvent) => {
        setState((prev) => ({ ...prev, events: [...prev.events, event] }));
    }, []);

    const updateEvent = useCallback((event: CalEvent) => {
        setState((prev) => ({
            ...prev,
            events: prev.events.map((e) => (e.id === event.id ? event : e)),
        }));
    }, []);

    const deleteEvent = useCallback((id: string) => {
        setState((prev) => ({
            ...prev,
            events: prev.events.filter((e) => e.id !== id),
        }));
    }, []);

    const toggleCalendar = useCallback((id: string) => {
        setState((prev) => ({
            ...prev,
            calendars: prev.calendars.map((c) =>
                c.id === id ? { ...c, visible: !c.visible } : c,
            ),
        }));
    }, []);

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
