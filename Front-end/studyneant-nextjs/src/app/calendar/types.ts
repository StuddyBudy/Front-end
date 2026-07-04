// ── CALENDAR TYPES ────────────────────────────────────────────────────────────
// Every name here must match exactly what components import.
// Components use: ViewMode, CalCalendar, CalEvent, RepeatConfig, CalendarState

/** Which view the main grid is showing */
export type ViewMode = "month" | "week";

/** A user-created calendar (e.g. "Personal", "Classes") */
export type CalCalendar = {
    id: string;
    name: string;
    color: string; // hex colour for events + checkbox
    visible: boolean; // toggled from the sidebar checklist
};

/** Repeat/recurrence settings attached to an event */
export type RepeatConfig = {
    enabled: boolean;
    every: number; // interval, e.g. 1
    unit: "day" | "week" | "month" | "year";
    endsMode: "never" | "on" | "occurrences";
    endsOn?: string; // ISO date "YYYY-MM-DD" — used when endsMode === "on"
    occurrences?: number; // used when endsMode === "occurrences"
    url?: string; // optional link for the event
    description?: string; // max 250 chars
};

/** A single calendar event */
export type CalEvent = {
    id: string;
    title: string;
    calendarId: string; // references CalCalendar.id
    color: string; // "" means use the parent calendar's colour
    startDate: string; // "YYYY-MM-DD"
    endDate: string; // "YYYY-MM-DD"
    startTime: string; // "HH:MM" (24h), ignored when allDay is true
    endTime: string; // "HH:MM" (24h), ignored when allDay is true
    allDay: boolean;
    location: string;
    isTodo: boolean; // whether to also add to the to-do list
    todoListId: string | null; // which to-do list to add to
    repeat: RepeatConfig;
    createdAt: number; // Date.now() timestamp
};

/** Full state persisted to localStorage */
export type CalendarState = {
    calendars: CalCalendar[];
    events: CalEvent[];
};
