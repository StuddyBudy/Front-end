// ── SHARED TYPES ──────────────────────────────────────────────────────────────
// Single source of truth — every dashboard file imports from here.

export type { LayoutItem } from "react-grid-layout";

export type Page = "dashboard" | "settings" | "notes" | "grades" | "calendar";

export type ThemeDef = {
    id: string;
    name: string;
    label: string;
    vars: Record<string, string>;
};

export type SchEvent = {
    day: number;
    hour: number;
    label: string;
    color: string;
};
