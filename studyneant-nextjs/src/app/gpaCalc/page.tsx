"use client";

import { useState, useEffect } from "react";

import type { GpaState } from "./types";
// FIX: removed unused `clearGpa` import that was causing a TS error
import { loadGpa, saveGpa } from "./storage";

import SetupModal from "./components/SetupModal";
import GpaTopBar from "./components/GpaTopBar";
import GpaSidebar from "./components/GpaSidebar";
import CourseGrid from "./components/CourseGrid";
import CourseDetailModal from "./components/CourseDetailModal";
import ImportModal from "./components/ImportModal";
import AddCourseModal from "./components/AddCourseModal";

import BottomNav from "../../components/bottomNav/BottomNav";

import s from "./GpaCalc.module.css";

export default function GpaCalcPage() {
    // ── State ─────────────────────────────────────────────────────────────────
    const [state, setState] = useState<GpaState>(() => {
        if (typeof window === "undefined") {
            return {
                config: {
                    schoolType: "hs",
                    gpaScale: 4.0,
                    useWeightedGpa: true,
                    periodType: "mp",
                    periodCount: 4,
                    partnerId: null,
                    customSchoolName: "",
                    setupComplete: false,
                },
                periods: [],
                courses: [],
                categories: [],
                assignments: [],
            };
        }
        return loadGpa();
    });

    // FIX: removed `showSetup` boolean — replaced with a single `mode` state
    // to avoid the unused-variable errors from the old isFirstVisit / shouldShowSetup
    const [mode, setMode] = useState<"setup" | "app">(() =>
        typeof window !== "undefined" && loadGpa().config.setupComplete
            ? "app"
            : "setup",
    );

    const [showImport, setShowImport] = useState(false);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null,
    );
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [activePeriodId, setActivePeriodId] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;
        const loaded = loadGpa();
        const cur =
            loaded.periods.find((p) => p.isCurrent) ?? loaded.periods[0];
        return cur?.id ?? null;
    });

    // ── Persist whenever state changes (after setup complete) ─────────────────
    useEffect(() => {
        if (state.config.setupComplete) {
            saveGpa(state);
        }
    }, [state]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    // Called when the setup wizard finishes (first run OR re-run from ⚙ button)
    const handleSetupComplete = (partial: Partial<GpaState>) => {
        const next: GpaState = {
            // Preserve any existing courses / grades when re-running setup
            config: partial.config ?? state.config,
            courses: partial.courses ?? state.courses,
            categories: partial.categories ?? state.categories,
            assignments: partial.assignments ?? state.assignments,
            periods: partial.periods ?? state.periods,
        };
        setState(next);
        saveGpa(next);
        setMode("app");

        // Jump to the first (current) period
        const firstPeriod = next.periods[0];
        if (firstPeriod) setActivePeriodId(firstPeriod.id);
    };

    const selectedCourse = selectedCourseId
        ? (state.courses.find((c) => c.id === selectedCourseId) ?? null)
        : null;

    // ── Show setup wizard ─────────────────────────────────────────────────────
    if (mode === "setup") {
        return <SetupModal onComplete={handleSetupComplete} />;
    }

    // ── Main app ──────────────────────────────────────────────────────────────
    return (
        <div className={s.shell} suppressHydrationWarning>
            <GpaTopBar
                state={state}
                activePeriodId={activePeriodId}
                onPeriodChange={setActivePeriodId}
                onAddCourse={() => setShowAddCourse(true)}
                onImport={() => setShowImport(true)}
                onRefresh={() => setLastUpdated(new Date())}
                onOpenSetup={() => setMode("setup")}
                lastUpdated={lastUpdated}
            />

            <div className={s.body}>
                <GpaSidebar
                    state={state}
                    activePeriodId={activePeriodId}
                    onSelectCourse={(id) => {
                        setSelectedCourseId(id);
                        const course = state.courses.find((c) => c.id === id);
                        if (course) setActivePeriodId(course.periodId);
                    }}
                />

                <div className={s.mainArea}>
                    <CourseGrid
                        state={state}
                        setState={setState}
                        activePeriodId={activePeriodId}
                        onSelectCourse={setSelectedCourseId}
                        onAddCourse={() => setShowAddCourse(true)}
                    />
                </div>
            </div>

            {/* Course detail + what-if */}
            {selectedCourse && (
                <CourseDetailModal
                    course={selectedCourse}
                    state={state}
                    setState={setState}
                    onClose={() => setSelectedCourseId(null)}
                />
            )}

            {/* Add course modal */}
            {showAddCourse && (
                <AddCourseModal
                    state={state}
                    activePeriodId={activePeriodId}
                    onSave={(next) => {
                        setState(next);
                        const latest = next.courses[next.courses.length - 1];
                        if (latest) setActivePeriodId(latest.periodId);
                    }}
                    onClose={() => setShowAddCourse(false)}
                />
            )}

            {/* CSV import */}
            {showImport && (
                <ImportModal
                    state={state}
                    setState={setState}
                    onClose={() => setShowImport(false)}
                />
            )}
            <BottomNav />
        </div>
    );
}
