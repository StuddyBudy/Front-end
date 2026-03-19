import type {
    GpaState,
    GpaConfig,
    Period,
    Course,
    Category,
    Assignment,
} from "./types";

export const GPA_LS_KEY = "studyos_gpa_v1";

// ── ID GENERATOR ──────────────────────────────────────────────────────────────
export function newId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ── DEFAULT CONFIG ────────────────────────────────────────────────────────────
export const DEFAULT_CONFIG: GpaConfig = {
    schoolType: "hs",
    gpaScale: 4.0,
    useWeightedGpa: true,
    periodType: "mp",
    periodCount: 4,
    partnerId: null,
    customSchoolName: "",
    setupComplete: false,
};

// ── EMPTY INITIAL STATE ───────────────────────────────────────────────────────
// No preset courses, grades, or categories. Everything starts blank.
function buildEmpty(): GpaState {
    return {
        config: { ...DEFAULT_CONFIG, setupComplete: false },
        periods: [],
        courses: [],
        categories: [],
        assignments: [],
    };
}

// ── LOAD / SAVE ───────────────────────────────────────────────────────────────
export function loadGpa(): GpaState {
    if (typeof window === "undefined") return buildEmpty();
    try {
        const raw = localStorage.getItem(GPA_LS_KEY);
        if (raw) return JSON.parse(raw) as GpaState;
        // First visit — return empty, do NOT persist yet
        // (setup wizard will persist after the user completes it)
        return buildEmpty();
    } catch {
        return buildEmpty();
    }
}

export function saveGpa(state: GpaState): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(GPA_LS_KEY, JSON.stringify(state));
    } catch {}
}

export function clearGpa(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(GPA_LS_KEY);
}

// ── PERIOD BUILDER ────────────────────────────────────────────────────────────
export function buildPeriods(type: string, count: number): Period[] {
    const prefixes: Record<string, string> = {
        mp: "MP",
        quarter: "Q",
        semester: "Semester ",
        trimester: "Trimester ",
        year: "Year",
    };
    const prefix = prefixes[type] ?? "Period ";
    return Array.from({ length: count }, (_, i) => ({
        id: newId(),
        name: count === 1 ? "Full Year" : `${prefix}${i + 1}`,
        order: i,
        isCurrent: i === 0,
        year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    }));
}

// ── COURSE COLORS ─────────────────────────────────────────────────────────────
export const COURSE_COLORS = [
    "#5b8dee",
    "#4caf78",
    "#de8900",
    "#a78bfa",
    "#e05555",
    "#f472b6",
    "#22d3ee",
    "#e0a030",
    "#64748b",
    "#10b981",
    "#6366f1",
    "#f59e0b",
];
