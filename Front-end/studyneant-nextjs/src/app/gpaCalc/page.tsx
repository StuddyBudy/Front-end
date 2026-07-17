"use client";

import { useState } from "react";

import type { GpaState } from "./types";
import { gpaStore } from "./storage";
import { useStorageStore } from "@/hooks/storageStore";

import SetupModal from "./components/SetupModal";
import GpaTopBar from "./components/GpaTopBar";
import GpaSidebar from "./components/GpaSidebar";
import CourseGrid from "./components/CourseGrid";
import CourseDetailModal from "./components/CourseDetailModal";
import ImportModal from "./components/ImportModal";
import AddCourseModal from "./components/AddCourseModal";

import BottomNav from "@/components/bottomNav/BottomNav";

import s from "./GpaCalc.module.css";

export default function GpaCalcPage() {
    // ── State ─────────────────────────────────────────────────────────────────
    // Read through gpaStore (useSyncExternalStore): the server prerender and
    // the client's hydration render both see the empty state (so the baked
    // setup tree always matches), then a returning user's persisted state
    // arrives right after hydration and the derived `mode` below flips to
    // "app". setState is the store's set — every write persists.
    const [state, setState] = useStorageStore(gpaStore);

    // Derived from persisted config; the override exists so the ⚙ button can
    // re-open the wizard after setup is complete.
    const [modeOverride, setModeOverride] = useState<"setup" | "app" | null>(
        null,
    );
    const mode = modeOverride ?? (state.config.setupComplete ? "app" : "setup");

    const [showImport, setShowImport] = useState(false);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null,
    );
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Active period follows the persisted "current" period unless the user
    // picked another one this session (and that pick still exists).
    const [activePeriodOverride, setActivePeriodOverride] = useState<
        string | null
    >(null);
    const derivedPeriodId =
        (state.periods.find((p) => p.isCurrent) ?? state.periods[0])?.id ??
        null;
    const activePeriodId =
        activePeriodOverride &&
        state.periods.some((p) => p.id === activePeriodOverride)
            ? activePeriodOverride
            : derivedPeriodId;

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
        setState(next); // persists via the store
        setModeOverride(null); // setupComplete is true → derived mode = "app"
        setActivePeriodOverride(null); // follow the new current period
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
                onPeriodChange={setActivePeriodOverride}
                onAddCourse={() => setShowAddCourse(true)}
                onImport={() => setShowImport(true)}
                onRefresh={() => setLastUpdated(new Date())}
                onOpenSetup={() => setModeOverride("setup")}
                lastUpdated={lastUpdated}
            />

            <div className={s.body}>
                <GpaSidebar
                    state={state}
                    activePeriodId={activePeriodId}
                    onSelectCourse={(id) => {
                        setSelectedCourseId(id);
                        const course = state.courses.find((c) => c.id === id);
                        if (course) setActivePeriodOverride(course.periodId);
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
                        if (latest) setActivePeriodOverride(latest.periodId);
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
