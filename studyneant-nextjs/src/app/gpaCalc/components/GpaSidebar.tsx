"use client";

import { useState } from "react";
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
import s from "../GpaCalc.module.css";

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
            n.has(id) ? n.delete(id) : n.add(id);
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
        <aside className={s.sidebar}>
            {/* GPA summary card */}
            <div className={s.gpaCard}>
                <div className={s.gpaCardTitle}>Current GPA</div>
                <div className={s.gpaValueRow}>
                    <span
                        className={s.gpaValue}
                        style={{
                            color: gradeColor(
                                gpa !== null ? (gpa / gpaMax) * 100 : null,
                            ),
                        }}
                    >
                        {fmtGpa(gpa)}
                    </span>
                    <span className={s.gpaScale}>/ {gpaMax.toFixed(1)}</span>
                    <span style={{ fontSize: "1.4rem", marginLeft: "auto" }}>
                        {gradeEmoji(gpa !== null ? (gpa / gpaMax) * 100 : null)}
                    </span>
                </div>
                <div className={s.gpaMeter}>
                    <div
                        className={s.gpaMeterFill}
                        style={{
                            width: `${gpaPct}%`,
                            background: gradeColor(gpaPct),
                        }}
                    />
                </div>
                <div className={s.gpaMetaRow}>
                    <span className={s.gpaMeta}>
                        Courses:{" "}
                        <span className={s.gpaMetaVal}>{gradedCourses}</span>
                    </span>
                    <span className={s.gpaMeta}>
                        Credits:{" "}
                        <span className={s.gpaMetaVal}>
                            {creditHours.toFixed(1)}
                        </span>
                    </span>
                </div>
                {proj !== null && (
                    <div className={s.projRow}>
                        <span className={s.projLabel}>Projected GPA</span>
                        <span className={s.projValue}>
                            {fmtGpa(proj)} / {gpaMax.toFixed(1)}
                        </span>
                    </div>
                )}
                {state.config.useWeightedGpa && (
                    <div
                        style={{
                            fontSize: "0.65rem",
                            color: "var(--dash-text-muted)",
                            marginTop: 6,
                            textAlign: "center",
                        }}
                    >
                        ⚖ Weighted GPA enabled
                    </div>
                )}
            </div>

            {/* FIX: Section title adapts to periodType */}
            <div className={s.sidebarSectionTitle}>
                {periodSectionLabel(state.config.periodType)}
            </div>

            <div className={s.sidebarScroll}>
                {sortedPeriods.map((period) => {
                    const isExpanded = expandedPeriods.has(period.id);
                    const periodCourses = state.courses
                        .filter((c) => c.periodId === period.id)
                        .sort((a, b) => a.name.localeCompare(b.name));

                    return (
                        <div key={period.id}>
                            <button
                                className={`${s.periodItem} ${activePeriodId === period.id ? s.periodItemActive : ""} ${period.isCurrent ? s.periodItemCurrent : ""}`}
                                onClick={() => togglePeriod(period.id)}
                            >
                                <span
                                    className={`${s.periodChevron} ${isExpanded ? s.periodChevronOpen : ""}`}
                                >
                                    ›
                                </span>
                                {period.name}
                                <span
                                    style={{
                                        marginLeft: "auto",
                                        fontSize: "0.70rem",
                                        color: "var(--dash-text-muted)",
                                    }}
                                >
                                    {periodCourses.length}
                                </span>
                            </button>

                            {isExpanded && (
                                <div className={s.courseTree}>
                                    {periodCourses.length === 0 && (
                                        <div
                                            style={{
                                                fontSize: "0.72rem",
                                                color: "var(--dash-text-muted)",
                                                padding: "4px 8px",
                                            }}
                                        >
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
                                                className={s.courseTreeItem}
                                                onClick={() =>
                                                    onSelectCourse(course.id)
                                                }
                                            >
                                                <div
                                                    className={s.courseTreeDot}
                                                    style={{
                                                        background:
                                                            course.color,
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        flex: 1,
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {course.name}
                                                </span>
                                                <span
                                                    className={
                                                        s.courseTreeGrade
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

                <button className={s.addPeriodBtn}>+ Add Period</button>
            </div>
        </aside>
    );
}
