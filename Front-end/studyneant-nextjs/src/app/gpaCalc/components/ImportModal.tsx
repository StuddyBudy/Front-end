"use client";

import { useState, useRef } from "react";
import type { GpaState, Assignment, Category } from "../types";
import { parseCsv } from "../utils";
import { newId } from "../storage";
import s from "../GpaCalc.module.css";

type Props = {
    state: GpaState;
    setState: (next: GpaState) => void;
    onClose: () => void;
};

export default function ImportModal({ state, setState, onClose }: Props) {
    const [csvText, setCsvText] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [preview, setPreview] = useState<ReturnType<typeof parseCsv>["rows"]>(
        [],
    );
    const [targetCourse, setTargetCourse] = useState<string>(
        () => state.courses[0]?.id ?? "",
    );
    const [isDragging, setIsDragging] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const parseText = (text: string) => {
        const result = parseCsv(text);
        setErrors(result.errors);
        setPreview(result.rows);
        setCsvText(text);
    };

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => parseText((e.target?.result as string) ?? "");
        reader.readAsText(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleImport = () => {
        if (!targetCourse || preview.length === 0) return;

        const course = state.courses.find((c) => c.id === targetCourse);
        if (!course) return;

        const cats = state.categories.filter(
            (c) => c.courseId === targetCourse,
        );

        // Build category map or create new categories as needed
        const catMap: Record<string, string> = {};
        cats.forEach((c) => {
            catMap[c.name.toLowerCase()] = c.id;
        });
        const newCats: Category[] = [];

        const newAssigns: Assignment[] = preview.map((row) => {
            const catNameLower = row.category.toLowerCase();
            let catId = catMap[catNameLower];

            // Auto-create category if not found
            if (!catId) {
                catId = newId();
                catMap[catNameLower] = catId;
                newCats.push({
                    id: catId,
                    courseId: targetCourse,
                    name: row.category,
                    weight: 0, // user should adjust
                });
            }

            return {
                id: newId(),
                courseId: targetCourse,
                categoryId: catId,
                name: row.name,
                pointsEarned: row.pointsEarned,
                pointsTotal: row.pointsTotal,
                dueDate: row.dueDate,
                missing: row.missing,
                excluded: false,
                multiplier: 1.0,
            };
        });

        const next: GpaState = {
            ...state,
            categories: [...state.categories, ...newCats],
            assignments: [...state.assignments, ...newAssigns],
        };
        setState(next);
        onClose();
    };

    const hasData = preview.length > 0 && errors.length === 0;

    return (
        <div
            className={s.modalOverlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={s.importModal}>
                <div className={s.importHeader}>
                    <span className={s.importTitle}>
                        ⬆ Import Grades from CSV
                    </span>
                    <button className={s.modalClose} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={s.importBody}>
                    {/* Format hint */}
                    <div className={s.importFormatHint}>
                        Expected columns (order flexible):{" "}
                        <code>Assignment</code>, <code>Category</code>,{" "}
                        <code>Points Earned</code>, <code>Points Total</code>,{" "}
                        <code>Due</code>
                    </div>

                    {/* Drop zone */}
                    <div
                        className={`${s.importDropzone} ${isDragging ? s.importDropzoneActive : ""}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                    >
                        <div className={s.importDropIcon}>📄</div>
                        <div className={s.importDropText}>
                            {isDragging
                                ? "Drop it!"
                                : "Drag & drop a CSV file here, or click to browse"}
                        </div>
                        <div className={s.importDropHint}>
                            Supports .csv exports from Canvas, Schoology,
                            PowerSchool
                        </div>
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".csv,text/csv"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFile(file);
                        }}
                    />

                    {/* Manual paste */}
                    <details style={{ marginBottom: 10 }}>
                        <summary
                            style={{
                                fontSize: "0.76rem",
                                color: "var(--dash-text-muted)",
                                cursor: "pointer",
                                padding: "4px 0",
                            }}
                        >
                            Or paste CSV text manually
                        </summary>
                        <textarea
                            style={{
                                width: "100%",
                                minHeight: 80,
                                marginTop: 6,
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid var(--dash-border)",
                                borderRadius: 8,
                                padding: "8px 10px",
                                color: "var(--dash-text-primary)",
                                fontFamily: "monospace",
                                fontSize: "0.76rem",
                                outline: "none",
                                resize: "vertical",
                            }}
                            placeholder="Paste CSV here…"
                            value={csvText}
                            onChange={(e) => parseText(e.target.value)}
                        />
                    </details>

                    {/* Errors */}
                    {errors.map((err, i) => (
                        <div key={i} className={s.importError}>
                            ⚠ {err}
                        </div>
                    ))}

                    {/* Target course selector */}
                    {hasData && (
                        <>
                            <label
                                style={{
                                    fontSize: "0.70rem",
                                    fontWeight: 600,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "var(--dash-text-muted)",
                                    display: "block",
                                    marginBottom: 5,
                                }}
                            >
                                Import into course
                            </label>
                            <select
                                className={s.importCourseSelect}
                                value={targetCourse}
                                onChange={(e) =>
                                    setTargetCourse(e.target.value)
                                }
                            >
                                {state.courses.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            {/* Preview table */}
                            <div className={s.importPreviewTitle}>
                                Preview — {preview.length} rows
                            </div>
                            <table className={s.importTable}>
                                <thead>
                                    <tr>
                                        <th>Assignment</th>
                                        <th>Category</th>
                                        <th>Grade</th>
                                        <th>Due</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.slice(0, 8).map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.name}</td>
                                            <td>{row.category}</td>
                                            <td>
                                                {row.missing ? (
                                                    <span
                                                        style={{
                                                            color: "#e05555",
                                                        }}
                                                    >
                                                        Missing
                                                    </span>
                                                ) : row.pointsEarned !==
                                                  null ? (
                                                    `${row.pointsEarned} / ${row.pointsTotal}`
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                            <td>{row.dueDate || "—"}</td>
                                        </tr>
                                    ))}
                                    {preview.length > 8 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                style={{
                                                    color: "var(--dash-text-muted)",
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                + {preview.length - 8} more
                                                rows…
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>

                <div className={s.importFooter}>
                    <button className={s.importCancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={s.importConfirmBtn}
                        disabled={!hasData}
                        onClick={handleImport}
                    >
                        Import{" "}
                        {preview.length > 0
                            ? `${preview.length} assignments`
                            : ""}
                    </button>
                </div>
            </div>
        </div>
    );
}
