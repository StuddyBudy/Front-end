"use client";

import { useState, useMemo } from "react";
import type { GpaState, Course, WhatIfAssignment } from "../types";
import { courseAverage, fmtPct, pctToLetter, gradeColor } from "../utils";
import { newId } from "../storage";
import s from "../GpaCalc.module.css";

type Props = {
    course: Course;
    state: GpaState;
    onClose: () => void;
};

export default function WhatIfPanel({ course, state, onClose }: Props) {
    const cats = state.categories.filter((c) => c.courseId === course.id);
    const assigns = state.assignments.filter(
        (a) => a.courseId === course.id && !a.excluded && !a.missing,
    );

    const [overrides, setOverrides] = useState<Record<string, number | null>>(
        {},
    );
    const [hypoAssigns, setHypoAssigns] = useState<WhatIfAssignment[]>([]);

    // ── Calculate what-if average ─────────────────────────────────────────────
    const whatIfAvg = useMemo(() => {
        let totalWeightedPct = 0;
        let totalWeight = 0;

        for (const cat of cats) {
            const catItems: { earned: number; total: number; mult: number }[] =
                [];

            for (const a of assigns) {
                if (a.categoryId !== cat.id) continue;
                const earned =
                    a.id in overrides ? overrides[a.id] : a.pointsEarned;
                if (earned === null || earned === undefined) continue;
                catItems.push({
                    earned: earned as number,
                    total: a.pointsTotal,
                    mult: a.multiplier,
                });
            }
            for (const h of hypoAssigns) {
                if (h.categoryId !== cat.id) continue;
                catItems.push({
                    earned: h.pointsEarned,
                    total: h.pointsTotal,
                    mult: h.multiplier,
                });
            }

            if (catItems.length === 0) continue;
            const e = catItems.reduce((s, a) => s + a.earned * a.mult, 0);
            const t = catItems.reduce((s, a) => s + a.total * a.mult, 0);
            if (t === 0) continue;
            totalWeightedPct += (e / t) * 100 * cat.weight;
            totalWeight += cat.weight;
        }
        return totalWeight === 0 ? null : totalWeightedPct / totalWeight;
    }, [overrides, hypoAssigns, cats, assigns]);

    const realAvg = courseAverage(
        course.id,
        state.categories,
        state.assignments,
    );
    const delta =
        whatIfAvg !== null && realAvg !== null ? whatIfAvg - realAvg : null;
    const hasChanges =
        Object.keys(overrides).length > 0 || hypoAssigns.length > 0;

    const deltaClass =
        delta === null
            ? s.whatIfDeltaZero
            : delta > 0.05
              ? s.whatIfDeltaPos
              : delta < -0.05
                ? s.whatIfDeltaNeg
                : s.whatIfDeltaZero;

    const addHypo = (catId: string) =>
        setHypoAssigns((prev) => [
            ...prev,
            {
                id: "hypo_" + newId(),
                categoryId: catId,
                name: "New assignment",
                pointsEarned: 100,
                pointsTotal: 100,
                multiplier: 1.0,
                isHypothetical: true,
            },
        ]);

    const removeHypo = (id: string) =>
        setHypoAssigns((prev) => prev.filter((h) => h.id !== id));
    const updateHypo = (
        id: string,
        field: "pointsEarned" | "pointsTotal",
        val: number,
    ) =>
        setHypoAssigns((prev) =>
            prev.map((h) => (h.id === id ? { ...h, [field]: val } : h)),
        );

    const overrideVal = (id: string, original: number | null) =>
        id in overrides ? overrides[id] : original;

    const setOverride = (id: string, val: string) => {
        const n = val === "" ? null : parseFloat(val);
        setOverrides((prev) => ({
            ...prev,
            [id]: isNaN(n as number) ? null : n,
        }));
    };

    return (
        <div className={s.whatIfPanel}>
            {/* ── Header row ── */}
            <div className={s.whatIfHeader}>
                <span className={s.whatIfTitle}>🤔 What If…</span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {hasChanges && (
                        <button
                            className={s.whatIfResetBtn}
                            onClick={() => {
                                setOverrides({});
                                setHypoAssigns([]);
                            }}
                        >
                            Reset
                        </button>
                    )}
                    <button className={s.modalClose} onClick={onClose}>
                        ✕
                    </button>
                </div>
            </div>

            {/* ── Live result banner — only shown when there are changes ── */}
            {hasChanges && (
                <div className={s.whatIfBanner}>
                    <div>
                        <div className={s.whatIfResultLabel}>What-If</div>
                        <div
                            className={s.whatIfResultGrade}
                            style={{ color: gradeColor(whatIfAvg) }}
                        >
                            {fmtPct(whatIfAvg)} —{" "}
                            {whatIfAvg !== null ? pctToLetter(whatIfAvg) : "—"}
                        </div>
                    </div>
                    {delta !== null && (
                        <span className={`${s.whatIfDelta} ${deltaClass}`}>
                            {delta > 0 ? "+" : ""}
                            {delta.toFixed(2)}%
                        </span>
                    )}
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                        <div className={s.whatIfResultLabel}>Original</div>
                        <div
                            style={{
                                fontSize: "0.86rem",
                                color: gradeColor(realAvg),
                                fontWeight: 600,
                            }}
                        >
                            {fmtPct(realAvg)}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Assignments — one compact row per item ── */}
            <div
                style={{
                    maxHeight: 220,
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                }}
            >
                {cats.map((cat) => {
                    const catAssigns = assigns.filter(
                        (a) => a.categoryId === cat.id,
                    );
                    const catHypo = hypoAssigns.filter(
                        (h) => h.categoryId === cat.id,
                    );
                    if (catAssigns.length === 0 && catHypo.length === 0)
                        return null;

                    return (
                        <div key={cat.id} style={{ marginBottom: 10 }}>
                            {/* Category header — minimal */}
                            <div
                                style={{
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.09em",
                                    textTransform: "uppercase",
                                    color: "var(--dash-text-muted)",
                                    padding: "4px 0 3px",
                                    borderBottom:
                                        "1px solid var(--dash-border, rgba(223,208,184,0.08))",
                                    marginBottom: 4,
                                }}
                            >
                                {cat.name} · {cat.weight}%
                            </div>

                            {/* Real assignments */}
                            {catAssigns.map((a) => {
                                const cur = overrideVal(a.id, a.pointsEarned);
                                const changed =
                                    a.id in overrides && cur !== a.pointsEarned;
                                return (
                                    <div
                                        key={a.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            padding: "4px 0",
                                            borderBottom:
                                                "1px solid rgba(255,255,255,0.03)",
                                        }}
                                    >
                                        {/* Assignment name */}
                                        <span
                                            style={{
                                                flex: 1,
                                                fontSize: "0.82rem",
                                                color: changed
                                                    ? "var(--dash-accent-warm)"
                                                    : "var(--dash-text-primary)",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                            title={a.name}
                                        >
                                            {a.name}
                                        </span>

                                        {/* Score inputs — inline, compact */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <input
                                                type="number"
                                                className={`${s.whatIfInput} ${changed ? s.whatIfInputChanged : ""}`}
                                                value={
                                                    cur !== null &&
                                                    cur !== undefined
                                                        ? cur
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    setOverride(
                                                        a.id,
                                                        e.target.value,
                                                    )
                                                }
                                                title="Points earned — edit to try a different score"
                                            />
                                            <span
                                                style={{
                                                    fontSize: "0.72rem",
                                                    color: "var(--dash-text-muted)",
                                                }}
                                            >
                                                / {a.pointsTotal}
                                            </span>
                                            {changed && (
                                                <button
                                                    title="Undo this change"
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "0.65rem",
                                                        color: "var(--dash-text-muted)",
                                                        padding: "0 2px",
                                                    }}
                                                    onClick={() => {
                                                        const next = {
                                                            ...overrides,
                                                        };
                                                        delete next[a.id];
                                                        setOverrides(next);
                                                    }}
                                                >
                                                    ↩
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Hypothetical assignments in this category */}
                            {catHypo.map((h) => (
                                <div
                                    key={h.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "4px 0",
                                        borderBottom:
                                            "1px solid rgba(255,255,255,0.03)",
                                    }}
                                >
                                    <span
                                        style={{
                                            flex: 1,
                                            fontSize: "0.82rem",
                                            color: "var(--dash-accent-warm)",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        ✦ {h.name}
                                    </span>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <input
                                            type="number"
                                            className={`${s.whatIfInput} ${s.whatIfInputChanged}`}
                                            value={h.pointsEarned}
                                            onChange={(e) =>
                                                updateHypo(
                                                    h.id,
                                                    "pointsEarned",
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                        />
                                        <span
                                            style={{
                                                fontSize: "0.72rem",
                                                color: "var(--dash-text-muted)",
                                            }}
                                        >
                                            /
                                        </span>
                                        <input
                                            type="number"
                                            className={s.whatIfInput}
                                            value={h.pointsTotal}
                                            onChange={(e) =>
                                                updateHypo(
                                                    h.id,
                                                    "pointsTotal",
                                                    Math.max(
                                                        1,
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 1,
                                                    ),
                                                )
                                            }
                                        />
                                        <button
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "0.68rem",
                                                color: "var(--dash-text-muted)",
                                                padding: "0 2px",
                                            }}
                                            onClick={() => removeHypo(h.id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* ── Add hypothetical — compact button row ── */}
            <div
                style={{
                    paddingTop: 8,
                    borderTop:
                        "1px solid var(--dash-border, rgba(223,208,184,0.10))",
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <span
                    style={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--dash-text-muted)",
                        marginRight: 2,
                    }}
                >
                    Add
                </span>
                {cats.map((cat) => (
                    <button
                        key={cat.id}
                        className={s.hypoAddBtn}
                        onClick={() => addHypo(cat.id)}
                    >
                        + {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
