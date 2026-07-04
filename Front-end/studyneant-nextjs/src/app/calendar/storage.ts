import type {
    CalendarState,
    CalEvent,
    CalCalendar,
    RepeatConfig,
} from "./types";

// ── LOCALSTORAGE KEY ──────────────────────────────────────────────────────────
export const CAL_LS_KEY = "studyos_calendar";

// ── DATE HELPERS ──────────────────────────────────────────────────────────────

/**
 * toYMD — converts a Date → "YYYY-MM-DD" string.
 * Used everywhere events are compared to grid cells.
 */
export function toYMD(d: Date): string {
    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
    ].join("-");
}

/**
 * fromYMD — parses "YYYY-MM-DD" back to a Date (local midnight, no UTC shift).
 */
export function fromYMD(s: string): Date {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
}

/**
 * monthLabel — human-readable month + year for the top bar.
 * e.g. monthLabel(2025, 10) → "November 2025"
 */
export function monthLabel(year: number, month: number): string {
    return new Date(year, month, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

/** Colour options shown in the event modal colour-tag row */
export const EVENT_COLORS = [
    "#de8900",
    "#5b8dee",
    "#4caf78",
    "#a78bfa",
    "#e05555",
    "#e0a030",
    "#f472b6",
    "#22d3ee",
];

// ── DEFAULT VALUES ────────────────────────────────────────────────────────────

export const DEFAULT_REPEAT: RepeatConfig = {
    enabled: false,
    every: 1,
    unit: "week",
    endsMode: "never",
    endsOn: undefined,
    occurrences: 1,
    url: "",
    description: "",
};

// ── ID GENERATOR ──────────────────────────────────────────────────────────────
export function newId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ── FACTORY HELPERS ───────────────────────────────────────────────────────────

/**
 * makeEvent — creates a CalEvent with sensible defaults.
 * Usage: makeEvent("2025-11-05", "cal1", { title: "Gym" })
 */
export function makeEvent(
    startDate: string,
    calendarId: string,
    partial?: Partial<CalEvent>,
): CalEvent {
    return {
        id: newId(),
        title: "",
        calendarId,
        color: "", // "" = inherit from parent calendar
        startDate,
        endDate: startDate, // single-day by default
        startTime: "09:00",
        endTime: "10:00",
        allDay: false,
        location: "",
        isTodo: false,
        todoListId: null,
        repeat: { ...DEFAULT_REPEAT },
        createdAt: Date.now(),
        ...partial,
    };
}

/**
 * makeCalendar — creates a CalCalendar.
 */
export function makeCalendar(name: string, color: string): CalCalendar {
    return { id: newId(), name, color, visible: true };
}

// ── REPEAT OCCURRENCE CHECK ───────────────────────────────────────────────────

/**
 * eventOccursOn — returns true if a (potentially repeating) event
 * should appear on the given date.
 */
export function eventOccursOn(ev: CalEvent, date: Date): boolean {
    const ds = toYMD(date);

    if (!ev.repeat.enabled) {
        // Non-repeating: just check the date range
        return ev.startDate <= ds && ev.endDate >= ds;
    }

    const start = fromYMD(ev.startDate);
    if (date < start) return false;

    // Check repeat.endsMode boundary
    if (
        ev.repeat.endsMode === "on" &&
        ev.repeat.endsOn &&
        ds > ev.repeat.endsOn
    )
        return false;

    const diffMs = date.getTime() - start.getTime();
    const diffDays = Math.round(diffMs / 86_400_000);
    const { every, unit } = ev.repeat;

    let idx = -1;

    switch (unit) {
        case "day":
            if (diffDays % every === 0) idx = diffDays / every;
            break;
        case "week":
            if (diffDays % (every * 7) === 0) idx = diffDays / (every * 7);
            break;
        case "month": {
            if (date.getDate() !== start.getDate()) return false;
            const monthDiff =
                (date.getFullYear() - start.getFullYear()) * 12 +
                (date.getMonth() - start.getMonth());
            if (monthDiff % every === 0) idx = monthDiff / every;
            break;
        }
        case "year": {
            if (
                date.getDate() !== start.getDate() ||
                date.getMonth() !== start.getMonth()
            )
                return false;
            const yearDiff = date.getFullYear() - start.getFullYear();
            if (yearDiff % every === 0) idx = yearDiff / every;
            break;
        }
    }

    if (idx < 0) return false;

    if (ev.repeat.endsMode === "occurrences")
        return idx < (ev.repeat.occurrences ?? 1);

    return true;
}

/**
 * getEventsForDate — returns all visible events that occur on a given date.
 */
export function getEventsForDate(
    events: CalEvent[],
    date: Date,
    calendars: CalCalendar[],
): CalEvent[] {
    const visible = new Set(
        calendars.filter((c) => c.visible).map((c) => c.id),
    );
    return events.filter(
        (ev) => visible.has(ev.calendarId) && eventOccursOn(ev, date),
    );
}

// ── SEED DATA ─────────────────────────────────────────────────────────────────

function buildSeed(): CalendarState {
    const today = new Date();
    const todayStr = toYMD(today);
    const tom = new Date(today);
    tom.setDate(today.getDate() + 1);
    const tomStr = toYMD(tom);
    const later = new Date(today);
    later.setDate(today.getDate() + 5);
    const laterStr = toYMD(later);

    return {
        calendars: [
            { id: "c1", name: "Personal", color: "#de8900", visible: true },
            { id: "c2", name: "Classes", color: "#5b8dee", visible: true },
            { id: "c3", name: "Fitness", color: "#4caf78", visible: true },
        ],
        events: [
            makeEvent(todayStr, "c3", {
                id: "e1",
                title: "Gym Session",
                startTime: "06:30",
                endTime: "07:30",
                location: "Campus Gym",
            }),
            makeEvent(todayStr, "c2", {
                id: "e2",
                title: "Calculus Lecture",
                startTime: "09:00",
                endTime: "10:15",
            }),
            makeEvent(tomStr, "c2", {
                id: "e3",
                title: "Physics Lab",
                startTime: "13:00",
                endTime: "15:00",
            }),
            makeEvent(laterStr, "c1", {
                id: "e4",
                title: "Study Group",
                startTime: "18:00",
                endTime: "19:30",
                color: "#a78bfa",
            }),
            makeEvent(laterStr, "c1", {
                id: "e5",
                title: "All-day Review",
                allDay: true,
                startTime: "",
                endTime: "",
            }),
        ],
    };
}

// ── PERSISTENCE ───────────────────────────────────────────────────────────────

/**
 * loadCalendar — reads state from localStorage.
 * On first visit writes seed data so every page finds real data immediately.
 * SSR-safe: returns seed if window is undefined.
 */
export function loadCalendar(): CalendarState {
    if (typeof window === "undefined") return buildSeed();
    try {
        const raw = localStorage.getItem(CAL_LS_KEY);
        if (raw) return JSON.parse(raw) as CalendarState;
        // First visit — persist seed so editor pages can find events
        const seed = buildSeed();
        localStorage.setItem(CAL_LS_KEY, JSON.stringify(seed));
        return seed;
    } catch {
        return buildSeed();
    }
}

export function saveCalendar(state: CalendarState): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(CAL_LS_KEY, JSON.stringify(state));
    } catch {}
}
