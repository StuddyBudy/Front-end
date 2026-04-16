"use client";

import { useState } from "react";
import c from "@/components/sidebar/Sidebar.module.css";
import type { GpaState, Course } from "../types";
import {
    calculateGpa,
    projectedGpa,
    courseAverage,
    fmtGpa,
    fmtPct,
    gradeColor,
    gradeEmoji,
} from "../utils";
import p from "../GpaCalc.module.css";

type Props = {
    state: GpaState;
    activePeriodId: string | null;
    onSelectCourse: (courseId: string) => void;
};

// FIX: derive a human label from the period type setting
function periodSectionLabel(periodType: string): string {
    switch (periodType) {
        case "semester":
            return "Semesters";
        case "quarter":
            return "Quarters";
        case "trimester":
            return "Trimesters";
        case "year":
            return "Academic Year";
        default:
            return "Marking Periods";
    }
}

export default function GpaSidebar({
    state,
    activePeriodId,
    onSelectCourse,
}: Props) {
    const [expandedPeriods, setExpandedPeriods] = useState<Set<string>>(() => {
        const cur = state.periods.find((p) => p.isCurrent);
        return cur ? new Set([cur.id]) : new Set();
    });

    const togglePeriod = (id: string) =>
        setExpandedPeriods((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });

    const currentCourses = activePeriodId
        ? state.courses.filter((c) => c.periodId === activePeriodId)
        : state.courses;

    const { gpa, creditHours, gradedCourses } = calculateGpa(
        currentCourses,
        state.categories,
        state.assignments,
        state.config,
    );
    const proj = projectedGpa(
        currentCourses,
        state.categories,
        state.assignments,
        state.config,
    );
    const gpaMax = state.config.gpaScale;
    const gpaPct = gpa !== null ? Math.min((gpa / gpaMax) * 100, 100) : 0;

    const sortedPeriods = [...state.periods].sort((a, b) => a.order - b.order);

    return (
        <aside className={c.sidePanel + " " + p.sidebar}>
            {/* GPA summary card */}
            <div className={p.gpaCard}>
                <div className={p.gpaCardTitle}>Current GPA</div>
                <div className={p.gpaValueRow}>
                    <span
                        className={p.gpaValue}
                        style={{
                            color: gradeColor(
                                gpa !== null ? (gpa / gpaMax) * 100 : null,
                            ),
                        }}
                    >
                        {fmtGpa(gpa)}
                    </span>
                    <span className={p.gpaScale}>/ {gpaMax.toFixed(1)}</span>
                    <span className={p.gpaEmoji}>
                        {gradeEmoji(gpa !== null ? (gpa / gpaMax) * 100 : null)}
                    </span>
                </div>
                <div className={p.gpaMeter}>
                    <div
                        className={p.gpaMeterFill}
                        style={{
                            width: `${gpaPct}%`,
                            background: gradeColor(gpaPct),
                        }}
                    />
                </div>
                <div className={p.gpaMetaRow}>
                    <span className={p.gpaMeta}>
                        Courses:{" "}
                        <span className={p.gpaMetaVal}>{gradedCourses}</span>
                    </span>
                    <span className={p.gpaMeta}>
                        Credits:{" "}
                        <span className={p.gpaMetaVal}>
                            {creditHours.toFixed(1)}
                        </span>
                    </span>
                </div>
                {proj !== null && (
                    <div className={p.projRow}>
                        <span className={p.projLabel}>Projected GPA</span>
                        <span className={p.projValue}>
                            {fmtGpa(proj)} / {gpaMax.toFixed(1)}
                        </span>
                    </div>
                )}
                {state.config.useWeightedGpa && (
                    <div className={p.weightedHint}>⚖ Weighted GPA enabled</div>
                )}
            </div>

            {/* FIX: Section title adapts to periodType */}
            <div className={c.sidePanelLabel + " " + p.sidebarSectionTitle}>
                {periodSectionLabel(state.config.periodType)}
            </div>

            <div className={c.sidePanelScroll + " " + p.sidebarScroll}>
                {sortedPeriods.map((period) => {
                    const isExpanded = expandedPeriods.has(period.id);
                    const periodCourses = state.courses
                        .filter((c) => c.periodId === period.id)
                        .sort((a, b) => a.name.localeCompare(b.name));

                    return (
                        <div key={period.id}>
                            <button
                                className={`${p.periodItem} ${activePeriodId === period.id ? p.periodItemActive : ""} ${period.isCurrent ? p.periodItemCurrent : ""}`}
                                onClick={() => togglePeriod(period.id)}
                            >
                                <span
                                    className={`${p.periodChevron} ${isExpanded ? p.periodChevronOpen : ""}`}
                                >
                                    ›
                                </span>
                                {period.name}
                                <span className={p.periodItemCount}>
                                    {periodCourses.length}
                                </span>
                            </button>

                            {isExpanded && (
                                <div className={p.courseTree}>
                                    {periodCourses.length === 0 && (
                                        <div className={p.courseTreeEmpty}>
                                            No courses yet
                                        </div>
                                    )}
                                    {periodCourses.map((course: Course) => {
                                        const avg = courseAverage(
                                            course.id,
                                            state.categories,
                                            state.assignments,
                                        );
                                        return (
                                            <button
                                                key={course.id}
                                                className={p.courseTreeItem}
                                                onClick={() =>
                                                    onSelectCourse(course.id)
                                                }
                                            >
                                                <div
                                                    className={p.courseTreeDot}
                                                    style={{
                                                        background:
                                                            course.color,
                                                    }}
                                                />
                                                <span
                                                    className={p.courseTreeName}
                                                >
                                                    {course.name}
                                                </span>
                                                <span
                                                    className={
                                                        p.courseTreeGrade
                                                    }
                                                    style={{
                                                        color: gradeColor(avg),
                                                    }}
                                                >
                                                    {avg !== null
                                                        ? fmtPct(avg, 0)
                                                        : "—"}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                <button className={p.addPeriodBtn}>+ Add Period</button>
            </div>
        </aside>
    );
}
