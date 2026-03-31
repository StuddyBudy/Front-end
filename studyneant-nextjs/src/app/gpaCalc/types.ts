// ── Navigation
export type Page = "dashboard" | "settings" | "notes" | "grades" | "calendar";

// ── GPA CALCULATOR TYPES ──────────────────────────────────────────────────────

export type SchoolType = "hs" | "college";
export type GpaScale = 4.0 | 5.0 | 6.0;
export type PeriodType = "mp" | "quarter" | "semester" | "trimester" | "year";
export type CourseWeight = "standard" | "honors" | "ap" | "ib" | "dual";

// Partnered schools — only these may be selected from the partner dropdown
export const PARTNER_SCHOOLS = [
    { id: "EHS", name: "Edison High School", location: "Edison, NJ" },
] as const;
export type PartnerId = (typeof PARTNER_SCHOOLS)[number]["id"];

// ── SETUP ─────────────────────────────────────────────────────────────────────
export type GpaConfig = {
    schoolType: SchoolType;
    gpaScale: GpaScale;
    useWeightedGpa: boolean;
    periodType: PeriodType;
    periodCount: number; // 2, 3, or 4
    partnerId: PartnerId | null;
    customSchoolName: string;
    setupComplete: boolean;
};

// ── MARKING PERIOD ────────────────────────────────────────────────────────────
export type Period = {
    id: string;
    name: string; // "MP1", "Semester 1", etc.
    order: number;
    isCurrent: boolean;
    year: string; // "2025-2026"
};

// ── CATEGORY ─────────────────────────────────────────────────────────────────
export type Category = {
    id: string;
    courseId: string;
    name: string;
    weight: number; // 0–100 (must sum to 100 per course)
};

// ── ASSIGNMENT ────────────────────────────────────────────────────────────────
export type Assignment = {
    id: string;
    courseId: string;
    categoryId: string;
    name: string;
    pointsEarned: number | null; // null = not yet graded
    pointsTotal: number;
    dueDate: string; // "YYYY-MM-DD"
    missing: boolean;
    excluded: boolean; // manually excluded from calc
    multiplier: number; // default 1.0; 0.5 = half-credit
};

// ── COURSE ────────────────────────────────────────────────────────────────────
export type Course = {
    id: string;
    periodId: string;
    name: string;
    teacher: string;
    room: string;
    credits: number; // 0.5, 1.0, etc.
    weight: CourseWeight;
    color: string;
};

// ── FULL STATE ────────────────────────────────────────────────────────────────
export type GpaState = {
    config: GpaConfig;
    periods: Period[];
    courses: Course[];
    categories: Category[];
    assignments: Assignment[];
};

// ── WHAT-IF ───────────────────────────────────────────────────────────────────
export type WhatIfAssignment = {
    id: string; // starts with "hypo_" if hypothetical
    categoryId: string;
    name: string;
    pointsEarned: number;
    pointsTotal: number;
    multiplier: number;
    isHypothetical: boolean;
};
