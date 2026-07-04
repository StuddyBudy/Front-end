"use client";

import { useState } from "react";
import type { GpaState, Course, Category, CourseWeight } from "../types";
import { newId, saveGpa, COURSE_COLORS } from "../storage";
import s from "../GpaCalc.module.css";

type Props = {
    state: GpaState;
    activePeriodId: string | null;
    onSave: (next: GpaState) => void;
    onClose: () => void;
};

const WEIGHT_OPTIONS: { value: CourseWeight; label: string; desc: string }[] = [
    { value: "standard", label: "Standard", desc: "No bonus" },
    { value: "honors", label: "Honours", desc: "+0.5 pts" },
    { value: "ap", label: "AP", desc: "+1.0 pts" },
    { value: "ib", label: "IB", desc: "+1.0 pts" },
    { value: "dual", label: "Dual Enroll", desc: "+0.5 pts" },
];

const DEFAULT_CATEGORIES = [
    { name: "Assessments", weight: 50 },
    { name: "Homework", weight: 30 },
    { name: "Classwork", weight: 20 },
];

export default function AddCourseModal({
    state,
    activePeriodId,
    onSave,
    onClose,
}: Props) {
    const isCollege = state.config.schoolType === "college";

    const [name, setName] = useState("");
    const [teacher, setTeacher] = useState("");
    const [room, setRoom] = useState("");
    const [credits, setCredits] = useState("1");
    // FIX: college never uses weighted course types — default stays "standard" but field is hidden
    const [weight, setWeight] = useState<CourseWeight>("standard");
    const [color, setColor] = useState(
        COURSE_COLORS[state.courses.length % COURSE_COLORS.length],
    );
    const [periodId, setPeriodId] = useState<string>(
        activePeriodId ?? state.periods[0]?.id ?? "",
    );

    const [categories, setCategories] = useState(
        DEFAULT_CATEGORIES.map((c) => ({ ...c, id: newId() })),
    );

    const setCatName = (id: string, v: string) =>
        setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, name: v } : c)),
        );
    const setCatWeight = (id: string, v: string) =>
        setCategories((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, weight: parseInt(v) || 0 } : c,
            ),
        );
    const addCat = () =>
        setCategories((prev) => [
            ...prev,
            { id: newId(), name: "", weight: 0 },
        ]);
    const removeCat = (id: string) =>
        setCategories((prev) => prev.filter((c) => c.id !== id));

    const totalWeight = categories.reduce((sum, c) => sum + (c.weight || 0), 0);
    const weightOk = totalWeight === 100;
    const canSave = name.trim() && periodId;

    const handleSave = () => {
        if (!canSave) return;
        const course: Course = {
            id: newId(),
            periodId,
            name: name.trim(),
            teacher: teacher.trim(),
            room: room.trim(),
            credits: parseFloat(credits) || 1,
            weight,
            color,
        };
        const newCats: Category[] = categories
            .filter((c) => c.name.trim())
            .map((c) => ({
                id: c.id,
                courseId: course.id,
                name: c.name.trim(),
                weight: c.weight,
            }));

        const next: GpaState = {
            ...state,
            courses: [...state.courses, course],
            categories: [...state.categories, ...newCats],
        };
        saveGpa(next);
        onSave(next);
        onClose();
    };

    return (
        <div
            className={s.modalOverlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={s.courseModal} style={{ maxWidth: 560 }}>
                <div className={s.modalHeader}>
                    <span className={s.modalTitle}>Add Course</span>
                    <button className={s.modalClose} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div
                    className={s.modalBody}
                    style={{ padding: "18px 22px 20px" }}
                >
                    {/* Basic info */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 10,
                            marginBottom: 14,
                        }}
                    >
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label className={s.addAssignTitle}>
                                Course Name *
                            </label>
                            <input
                                autoFocus
                                className={s.addAssignInput}
                                style={{ width: "100%", marginTop: 4 }}
                                placeholder="e.g. English 11, AP Calculus"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSave()
                                }
                            />
                        </div>
                        <div>
                            <label className={s.addAssignTitle}>Teacher</label>
                            <input
                                className={s.addAssignInput}
                                style={{ width: "100%", marginTop: 4 }}
                                placeholder="Teacher name"
                                value={teacher}
                                onChange={(e) => setTeacher(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={s.addAssignTitle}>Room</label>
                            <input
                                className={s.addAssignInput}
                                style={{ width: "100%", marginTop: 4 }}
                                placeholder="Room / location"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Period */}
                    <div style={{ marginBottom: 14 }}>
                        <label className={s.addAssignTitle}>
                            {/* FIX: label matches the user's actual period type */}
                            {state.config.periodType === "semester"
                                ? "Semester"
                                : state.config.periodType === "quarter"
                                  ? "Quarter"
                                  : state.config.periodType === "trimester"
                                    ? "Trimester"
                                    : state.config.periodType === "year"
                                      ? "Year"
                                      : "Marking Period"}
                        </label>
                        <select
                            className={s.addAssignSelect}
                            style={{ width: "100%", marginTop: 4 }}
                            value={periodId}
                            onChange={(e) => setPeriodId(e.target.value)}
                        >
                            {state.periods.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                    {p.isCurrent ? " (current)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Credits + Course Weight */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: isCollege
                                ? "1fr"
                                : "120px 1fr",
                            gap: 10,
                            marginBottom: 14,
                        }}
                    >
                        <div>
                            <label className={s.addAssignTitle}>Credits</label>
                            <select
                                className={s.addAssignSelect}
                                style={{ width: "100%", marginTop: 4 }}
                                value={credits}
                                onChange={(e) => setCredits(e.target.value)}
                            >
                                {["0.5", "1", "1.5", "2", "3", "4"].map((v) => (
                                    <option key={v} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* FIX: College/Uni does not use HS course weighting — hide entirely */}
                        {!isCollege && (
                            <div>
                                <label className={s.addAssignTitle}>
                                    Course Weight
                                </label>
                                <select
                                    className={s.addAssignSelect}
                                    style={{ width: "100%", marginTop: 4 }}
                                    value={weight}
                                    onChange={(e) =>
                                        setWeight(
                                            e.target.value as CourseWeight,
                                        )
                                    }
                                >
                                    {WEIGHT_OPTIONS.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label} — {opt.desc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Colour */}
                    <div style={{ marginBottom: 16 }}>
                        <label className={s.addAssignTitle}>Colour</label>
                        <div
                            style={{
                                display: "flex",
                                gap: 6,
                                flexWrap: "wrap",
                                marginTop: 6,
                            }}
                        >
                            {COURSE_COLORS.map((c) => (
                                <div
                                    key={c}
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        background: c,
                                        cursor: "pointer",
                                        border:
                                            color === c
                                                ? "2px solid #fff"
                                                : "2px solid transparent",
                                        transform:
                                            color === c
                                                ? "scale(1.2)"
                                                : "scale(1)",
                                        transition: "transform 0.12s",
                                    }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Grade Categories */}
                    <div style={{ marginBottom: 8 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 6,
                            }}
                        >
                            <label className={s.addAssignTitle}>
                                Grade Categories
                            </label>
                            <span
                                style={{
                                    fontSize: "0.70rem",
                                    color: weightOk ? "#4caf78" : "#e05555",
                                    fontWeight: 600,
                                }}
                            >
                                Total: {totalWeight}%{" "}
                                {weightOk ? "✓" : "(needs 100%)"}
                            </span>
                        </div>
                        <p
                            style={{
                                fontSize: "0.72rem",
                                color: "var(--dash-text-muted)",
                                marginBottom: 8,
                            }}
                        >
                            Weights must add up to exactly 100%.
                        </p>
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                style={{
                                    display: "flex",
                                    gap: 6,
                                    marginBottom: 5,
                                    alignItems: "center",
                                }}
                            >
                                <input
                                    className={s.addAssignInput}
                                    style={{ flex: 1 }}
                                    placeholder="Category name"
                                    value={cat.name}
                                    onChange={(e) =>
                                        setCatName(cat.id, e.target.value)
                                    }
                                />
                                <input
                                    className={s.addAssignInput}
                                    style={{ width: 64, textAlign: "center" }}
                                    type="number"
                                    placeholder="%"
                                    value={cat.weight || ""}
                                    onChange={(e) =>
                                        setCatWeight(cat.id, e.target.value)
                                    }
                                    min={0}
                                    max={100}
                                />
                                <span
                                    style={{
                                        fontSize: "0.76rem",
                                        color: "var(--dash-text-muted)",
                                    }}
                                >
                                    %
                                </span>
                                <button
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "var(--dash-text-muted)",
                                        cursor: "pointer",
                                        fontSize: "0.75rem",
                                        padding: 4,
                                    }}
                                    onClick={() => removeCat(cat.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            style={{
                                marginTop: 4,
                                padding: "6px 12px",
                                borderRadius: 7,
                                border: "1px dashed var(--dash-border)",
                                background: "transparent",
                                color: "var(--dash-text-muted)",
                                fontFamily: "var(--font-body)",
                                fontSize: "0.76rem",
                                cursor: "pointer",
                            }}
                            onClick={addCat}
                        >
                            + Add category
                        </button>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        padding: "12px 22px 18px",
                        borderTop:
                            "1px solid var(--dash-border, rgba(223,208,184,0.10))",
                    }}
                >
                    <button className={s.importCancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={s.importConfirmBtn}
                        onClick={handleSave}
                        disabled={!canSave}
                    >
                        Add Course
                    </button>
                </div>
            </div>
        </div>
    );
}
