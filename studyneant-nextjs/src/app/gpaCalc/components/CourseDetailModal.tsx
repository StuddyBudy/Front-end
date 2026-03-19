"use client";

import { useState } from "react";
import type { GpaState, Course, Assignment } from "../types";
import {
    courseAverage,
    categoryAverage,
    fmtPct,
    pctToLetter,
    gradeColor,
    gradeEmoji,
    missingCount,
    chipClass,
} from "../utils";
import { newId } from "../storage";
import WhatIfPanel from "./WhatIfPannel";
import s from "../GpaCalc.module.css";

type Props = {
    course: Course;
    state: GpaState;
    setState: (next: GpaState) => void;
    onClose: () => void;
};

export default function CourseDetailModal({
    course,
    state,
    setState,
    onClose,
}: Props) {
    const [showCatAvg, setShowCatAvg] = useState(false);
    const [showWhatIf, setShowWhatIf] = useState(false);

    // Add-assignment form state
    const [addName, setAddName] = useState("");
    const [addCatId, setAddCatId] = useState<string>(
        () => state.categories.find((c) => c.courseId === course.id)?.id ?? "",
    );
    const [addEarned, setAddEarned] = useState("");
    const [addTotal, setAddTotal] = useState("100");
    const [addDue, setAddDue] = useState("");
    const [addMissing, setAddMissing] = useState(false);
    const [addMulti, setAddMulti] = useState("1.0");

    const cats = state.categories.filter((c) => c.courseId === course.id);
    const assigns = state.assignments
        .filter((a) => a.courseId === course.id)
        .sort((a, b) => b.dueDate.localeCompare(a.dueDate));

    const avg = courseAverage(course.id, state.categories, state.assignments);
    const missing = missingCount(course.id, state.assignments);
    const letter = avg !== null ? pctToLetter(avg) : null;

    // ── Handlers ────────────────────────────────────────────────────────────────
    const handleAddAssignment = () => {
        const name = addName.trim();
        if (!name || !addCatId) return;
        const earned = addMissing
            ? null
            : addEarned === ""
              ? null
              : parseFloat(addEarned);
        const total = parseFloat(addTotal) || 100;
        const assign: Assignment = {
            id: newId(),
            courseId: course.id,
            categoryId: addCatId,
            name,
            pointsEarned: earned,
            pointsTotal: total,
            dueDate: addDue,
            missing: addMissing,
            excluded: false,
            multiplier: parseFloat(addMulti) || 1.0,
        };
        const next: GpaState = {
            ...state,
            assignments: [...state.assignments, assign],
        };
        setState(next);
        setAddName("");
        setAddEarned("");
        setAddDue("");
        setAddMissing(false);
        setAddMulti("1.0");
    };

    const handleToggleExclude = (id: string) => {
        setState({
            ...state,
            assignments: state.assignments.map((a) =>
                a.id === id ? { ...a, excluded: !a.excluded } : a,
            ),
        });
    };

    const handleDeleteAssign = (id: string) => {
        setState({
            ...state,
            assignments: state.assignments.filter((a) => a.id !== id),
        });
    };

    const fmtDue = (d: string) => {
        if (!d) return "—";
        const dt = new Date(d);
        return `${dt.getMonth() + 1}/${dt.getDate()}`;
    };

    return (
        <div
            className={s.modalOverlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={s.courseModal}>
                {/* ── Header ── */}
                <div className={s.modalHeader}>
                    <div
                        className={s.courseColorBar}
                        style={{
                            background: course.color,
                            width: 4,
                            height: 36,
                        }}
                    />
                    <span className={s.modalTitle}>{course.name}</span>

                    {avg !== null ? (
                        <span
                            className={s.modalAvg}
                            style={{ color: gradeColor(avg) }}
                        >
                            {fmtPct(avg)}
                        </span>
                    ) : null}

                    {letter && (
                        <span
                            className={`${s.gradeChip} ${s[chipClass(letter) as keyof typeof s]}`}
                        >
                            {letter}
                        </span>
                    )}

                    <span style={{ fontSize: "1.5rem" }}>
                        {gradeEmoji(avg)}
                    </span>

                    <div className={s.modalActions}>
                        <button
                            className={`${s.modalActionBtn} ${showWhatIf ? s.modalActionBtnActive : ""}`}
                            onClick={() => {
                                setShowWhatIf((o) => !o);
                                setShowCatAvg(false);
                            }}
                        >
                            🤔 What if…
                        </button>
                        <button
                            className={`${s.modalActionBtn} ${showCatAvg ? s.modalActionBtnActive : ""}`}
                            onClick={() => {
                                setShowCatAvg((o) => !o);
                                setShowWhatIf(false);
                            }}
                        >
                            🎯 Category Averages
                        </button>
                        <button className={s.modalActionBtn} onClick={onClose}>
                            ✕ Close
                        </button>
                    </div>

                    {missing > 0 && (
                        <span className={s.missingBadge}>
                            ⚠ {missing} missing
                        </span>
                    )}
                </div>

                <div className={s.modalBody}>
                    {/* ── Category averages panel ── */}
                    {showCatAvg && (
                        <div className={s.catAveragesPanel}>
                            {cats.map((cat) => {
                                const catAvg = categoryAverage(
                                    cat.id,
                                    state.assignments,
                                );
                                return (
                                    <div key={cat.id} className={s.catAvgCard}>
                                        <div className={s.catAvgName}>
                                            {cat.name}
                                        </div>
                                        <div
                                            className={s.catAvgValue}
                                            style={{
                                                color: gradeColor(catAvg),
                                            }}
                                        >
                                            {fmtPct(catAvg)}
                                        </div>
                                        <div className={s.catAvgWeight}>
                                            {cat.weight}% weight
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── What-If panel ── */}
                    {showWhatIf && (
                        <WhatIfPanel
                            course={course}
                            state={state}
                            onClose={() => setShowWhatIf(false)}
                        />
                    )}

                    {/* ── Assignment table ── */}
                    <table className={s.assignTable}>
                        <thead className={s.assignTableHead}>
                            <tr>
                                <th>Due</th>
                                <th>Category</th>
                                <th>Assignment</th>
                                <th style={{ textAlign: "right" }}>Grade</th>
                                <th style={{ width: 60 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {assigns.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        style={{
                                            padding: "24px 12px",
                                            textAlign: "center",
                                            color: "var(--dash-text-muted)",
                                            fontSize: "0.82rem",
                                        }}
                                    >
                                        No assignments yet — add one below
                                    </td>
                                </tr>
                            )}
                            {assigns.map((a) => {
                                const cat = cats.find(
                                    (c) => c.id === a.categoryId,
                                );
                                const pct =
                                    a.pointsEarned !== null && !a.missing
                                        ? (a.pointsEarned / a.pointsTotal) * 100
                                        : null;
                                return (
                                    <tr
                                        key={a.id}
                                        className={`${s.assignRow} ${a.missing ? s.assignRowMissing : ""} ${a.excluded ? s.assignRowExcluded : ""}`}
                                    >
                                        <td
                                            className={`${s.assignCell} ${s.assignCellDue}`}
                                        >
                                            {fmtDue(a.dueDate)}
                                        </td>
                                        <td
                                            className={`${s.assignCell} ${s.assignCellCat}`}
                                        >
                                            {cat?.name ?? "—"}
                                        </td>
                                        <td className={s.assignCell}>
                                            {a.name}
                                            {a.missing && (
                                                <span
                                                    className={s.missingTag}
                                                    style={{ marginLeft: 6 }}
                                                >
                                                    missing
                                                </span>
                                            )}
                                            {a.excluded && (
                                                <span
                                                    className={s.excludedTag}
                                                    style={{ marginLeft: 6 }}
                                                >
                                                    excluded
                                                </span>
                                            )}
                                        </td>
                                        <td
                                            className={`${s.assignCell} ${s.assignCellGrade}`}
                                        >
                                            {a.missing ? (
                                                <span
                                                    style={{ color: "#e05555" }}
                                                >
                                                    — / {a.pointsTotal}
                                                </span>
                                            ) : a.pointsEarned !== null ? (
                                                <>
                                                    <span
                                                        className={
                                                            s.gradePoints
                                                        }
                                                    >
                                                        {a.pointsEarned} /{" "}
                                                        {a.pointsTotal}
                                                    </span>
                                                    <span
                                                        className={s.gradePct}
                                                        style={{
                                                            color: gradeColor(
                                                                pct,
                                                            ),
                                                        }}
                                                    >
                                                        {fmtPct(pct)}
                                                    </span>
                                                    {a.multiplier !== 1.0 && (
                                                        <span
                                                            className={
                                                                s.gradeMultiplier
                                                            }
                                                        >
                                                            ×{a.multiplier}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span
                                                    style={{
                                                        color: "var(--dash-text-muted)",
                                                    }}
                                                >
                                                    Not graded
                                                </span>
                                            )}
                                        </td>
                                        <td className={s.assignCell}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 4,
                                                }}
                                            >
                                                <button
                                                    style={{
                                                        fontSize: "0.68rem",
                                                        background: "none",
                                                        border: "none",
                                                        color: "var(--dash-text-muted)",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        handleToggleExclude(
                                                            a.id,
                                                        )
                                                    }
                                                    title={
                                                        a.excluded
                                                            ? "Include"
                                                            : "Exclude from grade"
                                                    }
                                                >
                                                    {a.excluded ? "↩" : "⊘"}
                                                </button>
                                                <button
                                                    style={{
                                                        fontSize: "0.68rem",
                                                        background: "none",
                                                        border: "none",
                                                        color: "var(--dash-text-muted)",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        handleDeleteAssign(a.id)
                                                    }
                                                    title="Delete"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* ── Add assignment form ── */}
                    <div className={s.addAssignSection}>
                        <div className={s.addAssignTitle}>Add Assignment</div>
                        <div className={s.addAssignRow}>
                            <input
                                className={s.addAssignInput}
                                placeholder="Assignment name"
                                value={addName}
                                onChange={(e) => setAddName(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleAddAssignment()
                                }
                            />
                            <select
                                className={s.addAssignSelect}
                                value={addCatId}
                                onChange={(e) => setAddCatId(e.target.value)}
                            >
                                {cats.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                className={s.addAssignInput}
                                style={{ width: 60 }}
                                placeholder="Earned"
                                type="number"
                                value={addEarned}
                                onChange={(e) => setAddEarned(e.target.value)}
                                disabled={addMissing}
                            />
                            <span style={{ color: "var(--dash-text-muted)" }}>
                                /
                            </span>
                            <input
                                className={s.addAssignInput}
                                style={{ width: 60 }}
                                placeholder="Total"
                                type="number"
                                value={addTotal}
                                onChange={(e) => setAddTotal(e.target.value)}
                            />
                            <input
                                type="date"
                                className={s.addAssignInput}
                                value={addDue}
                                onChange={(e) => setAddDue(e.target.value)}
                            />
                            <input
                                className={s.addAssignInput}
                                style={{ width: 52 }}
                                placeholder="×mult"
                                type="number"
                                step="0.1"
                                value={addMulti}
                                onChange={(e) => setAddMulti(e.target.value)}
                                title="Score multiplier (default 1.0)"
                            />
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                    fontSize: "0.78rem",
                                    color: "var(--dash-text-muted)",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={addMissing}
                                    onChange={(e) =>
                                        setAddMissing(e.target.checked)
                                    }
                                />
                                Missing
                            </label>
                            <button
                                className={s.addAssignBtn}
                                onClick={handleAddAssignment}
                            >
                                Add
                            </button>
                        </div>

                        {/* Category manager shortcut */}
                        {cats.length === 0 && (
                            <p
                                style={{
                                    fontSize: "0.76rem",
                                    color: "#e05555",
                                    marginTop: 8,
                                }}
                            >
                                ⚠ No categories set up for this course. Add
                                categories first so grades calculate correctly.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
