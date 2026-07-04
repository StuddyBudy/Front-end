"use client";

import type { GpaState, Course } from "../types";
import {
    courseAverage,
    gpaPoints,
    fmtPct,
    fmtGpa,
    pctToLetter,
    gradeColor,
    gradeEmoji,
    missingCount,
    chipClass,
} from "../utils";
import s from "../GpaCalc.module.css";

type Props = {
    state: GpaState;
    setState: (next: GpaState) => void;
    activePeriodId: string | null;
    onSelectCourse: (courseId: string) => void;
    onAddCourse: () => void; // ← parent opens AddCourseModal
};

export default function CourseGrid({
    state,
    activePeriodId,
    onSelectCourse,
    onAddCourse,
}: Props) {
    const courses = [...state.courses]
        .filter((c) => !activePeriodId || c.periodId === activePeriodId)
        .sort((a, b) => a.name.localeCompare(b.name));

    const graded = courses.filter(
        (c) =>
            courseAverage(c.id, state.categories, state.assignments) !== null,
    );
    const avgAll =
        graded.length === 0
            ? null
            : graded.reduce(
                  (sum, c) =>
                      sum +
                      courseAverage(c.id, state.categories, state.assignments)!,
                  0,
              ) / graded.length;

    return (
        <div className={s.gridWrap}>
            {/* Summary bar */}
            {(graded.length > 0 || courses.length > 0) && (
                <div className={s.summaryBar}>
                    <div className={s.summaryChip}>
                        Period avg:
                        <span
                            className={s.summaryChipVal}
                            style={{ color: gradeColor(avgAll) }}
                        >
                            {avgAll !== null ? fmtPct(avgAll) : "—"}
                        </span>
                    </div>
                    <div className={s.summaryChip}>
                        Courses graded:
                        <span className={s.summaryChipVal}>
                            {graded.length} / {courses.length}
                        </span>
                    </div>
                    <div className={s.summaryChip}>
                        Period:
                        <span className={s.summaryChipVal}>
                            {state.periods.find((p) => p.id === activePeriodId)
                                ?.name ?? "All"}
                        </span>
                    </div>
                </div>
            )}

            {/* Column headers */}
            <div className={s.gridHeader}>
                <div className={s.gridHeaderCell}>Course</div>
                <div
                    className={s.gridHeaderCell}
                    style={{ textAlign: "right" }}
                >
                    Average
                </div>
                <div
                    className={s.gridHeaderCell}
                    style={{ textAlign: "center" }}
                >
                    Grade
                </div>
                <div
                    className={s.gridHeaderCell}
                    style={{ textAlign: "center" }}
                >
                    GPA Pts
                </div>
                <div
                    className={s.gridHeaderCell}
                    style={{ textAlign: "center" }}
                >
                    Credits
                </div>
                <div
                    className={s.gridHeaderCell}
                    style={{ textAlign: "center" }}
                >
                    😊
                </div>
            </div>

            {/* Empty state */}
            {courses.length === 0 ? (
                <div className={s.emptyState}>
                    <span className={s.emptyEmoji}>📚</span>
                    <p className={s.emptyText}>
                        No courses yet — click "+ Add Course" to get started
                    </p>
                </div>
            ) : (
                courses.map((course: Course) => {
                    const avg = courseAverage(
                        course.id,
                        state.categories,
                        state.assignments,
                    );
                    const letter = avg !== null ? pctToLetter(avg) : null;
                    const pts =
                        avg !== null
                            ? gpaPoints(avg, course.weight, state.config, true)
                            : null;
                    const missing = missingCount(course.id, state.assignments);
                    const hasGrade = avg !== null;

                    return (
                        <div
                            key={course.id}
                            className={`${s.gridRow} ${!hasGrade ? s.gridRowNoGrade : ""}`}
                            onClick={() => onSelectCourse(course.id)}
                            title="Click to view assignments"
                        >
                            {/* Course */}
                            <div className={s.gridCell}>
                                <div
                                    className={s.courseColorBar}
                                    style={{ background: course.color }}
                                />
                                <div>
                                    <div className={s.courseName}>
                                        {course.name}
                                    </div>
                                    {(course.teacher || course.room) && (
                                        <div
                                            style={{
                                                fontSize: "0.66rem",
                                                color: "var(--dash-text-muted)",
                                                marginTop: 1,
                                            }}
                                        >
                                            {course.teacher}
                                            {course.room
                                                ? ` · Rm ${course.room}`
                                                : ""}
                                        </div>
                                    )}
                                </div>
                                {course.weight !== "standard" && (
                                    <span className={s.courseWeightBadge}>
                                        {course.weight.toUpperCase()}
                                    </span>
                                )}
                                {missing > 0 && (
                                    <span className={s.missingBadge}>
                                        ⚠ {missing}
                                    </span>
                                )}
                            </div>

                            {/* Average */}
                            <div className={`${s.gridCell} ${s.gridCellRight}`}>
                                {hasGrade ? (
                                    <div className={s.avgWrap}>
                                        <span
                                            className={s.avgPct}
                                            style={{ color: gradeColor(avg) }}
                                        >
                                            {fmtPct(avg)}
                                        </span>
                                        <div className={s.avgBar}>
                                            <div
                                                className={s.avgBarFill}
                                                style={{
                                                    width: `${Math.min(avg!, 100)}%`,
                                                    background: gradeColor(avg),
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <span className={s.noGradesText}>
                                        No Grades
                                    </span>
                                )}
                            </div>

                            {/* Grade chip */}
                            <div className={s.gridCellCenter}>
                                {letter ? (
                                    <span
                                        className={`${s.gradeChip} ${s[chipClass(letter) as keyof typeof s]}`}
                                    >
                                        {letter}
                                    </span>
                                ) : (
                                    <span className={s.noGradesText}>—</span>
                                )}
                            </div>

                            {/* GPA pts */}
                            <div
                                className={`${s.gridCell} ${s.gridCellCenter}`}
                            >
                                <span
                                    className={s.gpaPoints}
                                    style={{
                                        color:
                                            pts !== null
                                                ? gradeColor(
                                                      (pts /
                                                          state.config
                                                              .gpaScale) *
                                                          100,
                                                  )
                                                : undefined,
                                    }}
                                >
                                    {pts !== null ? fmtGpa(pts) : "—"}
                                </span>
                            </div>

                            {/* Credits */}
                            <div
                                className={`${s.gridCell} ${s.gridCellCenter}`}
                            >
                                <span
                                    style={{
                                        fontSize: "0.80rem",
                                        color: "var(--dash-text-muted)",
                                    }}
                                >
                                    {course.credits}
                                </span>
                            </div>

                            {/* Emoji */}
                            <div
                                className={`${s.gridCell} ${s.gridCellCenter}`}
                            >
                                <span className={s.gradeEmoji}>
                                    {gradeEmoji(avg)}
                                </span>
                            </div>
                        </div>
                    );
                })
            )}

            {/* Add course button */}
            <div className={s.addCourseRow}>
                <button className={s.addCourseBtn} onClick={onAddCourse}>
                    + Add Course
                </button>
            </div>
        </div>
    );
}
