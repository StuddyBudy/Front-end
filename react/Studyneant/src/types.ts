// ── SHARED TYPES ──────────────────────────────────────────────────────────────
// Import LayoutItem from react-grid-layout and re-export so every file
// imports from one place instead of directly from the library.
export type { LayoutItem } from "react-grid-layout";

// All navigable pages in the app
export type Page = "dashboard" | "settings" | "notes" | "grades" | "calendar";

// Theme definition — vars map directly to CSS custom properties
export type ThemeDef = {
    id: string;
    name: string;
    label: string;
    vars: Record<string, string>;
};

// Used by ScheduleWidget
export type SchEvent = {
    day: number;
    hour: number;
    label: string;
    color: string;
};
