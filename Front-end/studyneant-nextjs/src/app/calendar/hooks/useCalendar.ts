"use client";

import { useMemo, useState } from "react";
import type { CalEvent, ViewMode } from "../types";
import { calendarStore } from "../storage";
import { useStorageStore } from "@/hooks/storageStore";
import { useHydrated } from "@/hooks/useHydrated";

function startOfWeek(d: Date): Date {
    const n = new Date(d);
    n.setDate(n.getDate() - n.getDay());
    return n;
}

export function useCalendar() {
    // Calendar/event state reads through calendarStore (useSyncExternalStore):
    // the prerender and hydration render see the empty state, persisted events
    // arrive right after hydration, and setState persists via store.set — so
    // no save-on-change effect (and no skip-first-save guard) is needed.
    const [state, setState] = useStorageStore(calendarStore);
    const [viewMode, setViewMode] = useState<ViewMode>("month");

    // Client-only dates: null during the prerender and hydration render (the
    // page gates rendering on them), resolved right after via useHydrated.
    // Computing new Date() unguarded in render baked the BUILD machine's
    // month/day into the static HTML, which mismatched at view time.
    // Memoized so the references stay stable across renders.
    const hydrated = useHydrated();
    const today = useMemo(() => (hydrated ? new Date() : null), [hydrated]);

    // Navigation is derived-with-override: year/month/weekStart follow
    // `today` until the user navigates away from the current month/week.
    const [ymOverride, setYmOverride] = useState<{
        y: number;
        m: number;
    } | null>(null);
    const year = ymOverride?.y ?? today?.getFullYear() ?? 0;
    const month = ymOverride?.m ?? today?.getMonth() ?? 0;

    const [weekStartOverride, setWeekStartOverride] = useState<Date | null>(
        null,
    );
    const [dayOverride, setDayOverride] = useState<Date | null>(null);
    const day = dayOverride ?? today;

    const defaultWeekStart = useMemo(
        () => (today ? startOfWeek(today) : null),
        [today],
    );
    const weekStart = weekStartOverride ?? defaultWeekStart;

    const goToday = () => {
        setYmOverride(null);
        setWeekStartOverride(null);
        setDayOverride(null);
    };

    const goPrev = () => {
        if (viewMode === "month") {
            setYmOverride(
                month === 0
                    ? { y: year - 1, m: 11 }
                    : { y: year, m: month - 1 },
            );
        } else if (viewMode === "week"){
            if (!weekStart) return;
            const n = new Date(weekStart);
            n.setDate(n.getDate() - 7);
            setWeekStartOverride(n);
        } else {
            if (!day) return;
            const n = new Date(day);
            n.setDate(n.getDate()-1);
            setDayOverride(n);
        }
    };

    const goNext = () => {
        if (viewMode === "month") {
            setYmOverride(
                month === 11
                    ? { y: year + 1, m: 0 }
                    : { y: year, m: month + 1 },
            );
        } else if (viewMode === "week") {
            if (!weekStart) return;
            const n = new Date(weekStart);
            n.setDate(n.getDate() + 7);
            setWeekStartOverride(n);
        } else {
            if (!day) return;
            const n = new Date(day);
            n.setDate(n.getDate()+1);
            setDayOverride(n);
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
        day,
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
