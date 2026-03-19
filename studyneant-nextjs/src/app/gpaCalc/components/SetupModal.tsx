"use client";

import { useState } from "react";
import type { GpaConfig, GpaScale, PeriodType, SchoolType } from "../types";
import { PARTNER_SCHOOLS } from "../types";
import { DEFAULT_CONFIG, buildPeriods, newId } from "../storage";
import type { GpaState } from "../types";
import s from "../GpaCalc.module.css";

type Props = {
    onComplete: (state: Partial<GpaState>) => void;
};

const TOTAL_STEPS = 5;

export default function SetupModal({ onComplete }: Props) {
    const [step, setStep] = useState(1);
    const [cfg, setCfg] = useState<GpaConfig>({ ...DEFAULT_CONFIG });

    const set = (partial: Partial<GpaConfig>) =>
        setCfg((prev) => ({ ...prev, ...partial }));

    const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    const back = () => setStep((s) => Math.max(s - 1, 1));

    const handleFinish = () => {
        const periods = buildPeriods(cfg.periodType, cfg.periodCount);
        // Mark first period as current
        if (periods.length > 0) periods[0].isCurrent = true;
        onComplete({
            config: { ...cfg, setupComplete: true },
            periods,
            courses: [],
            categories: [],
            assignments: [],
        });
    };

    return (
        <div className={s.setupOverlay}>
            <div className={s.setupModal}>
                <div className={s.setupInner}>
                    {/* Step dots */}
                    <div className={s.setupDots} style={{ marginBottom: 20 }}>
                        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                            <div
                                key={i}
                                className={`${s.setupDot} ${i + 1 <= step ? s.setupDotActive : ""}`}
                            />
                        ))}
                    </div>

                    {/* ── STEP 1: School type ── */}
                    {step === 1 && (
                        <>
                            <div className={s.setupLogoMark}>◈ StudyOS</div>
                            <div className={s.setupStep}>
                                Step 1 of {TOTAL_STEPS} — School Type
                            </div>
                            <h2 className={s.setupTitle}>
                                Welcome to GPA Calc
                            </h2>
                            <p className={s.setupSubtitle}>
                                Let's set up your grade tracker. First — what
                                kind of school are you in?
                            </p>
                            <div className={s.optionGrid}>
                                {[
                                    {
                                        value: "hs",
                                        icon: "🏫",
                                        label: "High School",
                                        sub: "Grades 9–12",
                                    },
                                    {
                                        value: "college",
                                        icon: "🎓",
                                        label: "College / Uni",
                                        sub: "Undergraduate",
                                    },
                                ].map((opt) => (
                                    <div
                                        key={opt.value}
                                        className={`${s.optionCard} ${cfg.schoolType === opt.value ? s.optionCardActive : ""}`}
                                        onClick={() =>
                                            set({
                                                schoolType:
                                                    opt.value as SchoolType,
                                            })
                                        }
                                    >
                                        <span className={s.optionCardIcon}>
                                            {opt.icon}
                                        </span>
                                        <span className={s.optionCardLabel}>
                                            {opt.label}
                                        </span>
                                        <span className={s.optionCardSub}>
                                            {opt.sub}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ── STEP 2: GPA Scale + weighted ── */}
                    {step === 2 && (
                        <>
                            <div className={s.setupStep}>
                                Step 2 of {TOTAL_STEPS} — GPA Scale
                            </div>
                            <h2 className={s.setupTitle}>GPA Scale</h2>
                            <p className={s.setupSubtitle}>
                                What scale does your school use?
                            </p>
                            <div className={s.scaleGrid}>
                                {([4.0, 5.0, 6.0] as GpaScale[]).map(
                                    (scale) => (
                                        <div
                                            key={scale}
                                            className={`${s.scaleCard} ${cfg.gpaScale === scale ? s.scaleCardActive : ""}`}
                                            onClick={() =>
                                                set({ gpaScale: scale })
                                            }
                                        >
                                            <span className={s.scaleCardNum}>
                                                {scale.toFixed(1)}
                                            </span>
                                            <span className={s.scaleCardLabel}>
                                                {scale === 4.0
                                                    ? "Standard"
                                                    : scale === 5.0
                                                      ? "Weighted"
                                                      : "6-Point"}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>

                            {/* Weighted GPA toggle */}
                            <div className={s.setupToggleRow}>
                                <div>
                                    <div className={s.setupToggleLabel}>
                                        Weighted GPA
                                    </div>
                                    <div className={s.setupToggleSub}>
                                        Honours/AP/IB courses add bonus points
                                    </div>
                                </div>
                                <button
                                    className={`${s.toggle} ${cfg.useWeightedGpa ? s.toggleOn : ""}`}
                                    onClick={() =>
                                        set({
                                            useWeightedGpa: !cfg.useWeightedGpa,
                                        })
                                    }
                                >
                                    <span
                                        className={`${s.toggleKnob} ${cfg.useWeightedGpa ? s.toggleKnobOn : ""}`}
                                    />
                                </button>
                            </div>
                        </>
                    )}

                    {/* ── STEP 3: Period structure ── */}
                    {step === 3 && (
                        <>
                            <div className={s.setupStep}>
                                Step 3 of {TOTAL_STEPS} — Grading Periods
                            </div>
                            <h2 className={s.setupTitle}>
                                How is your year structured?
                            </h2>
                            <p className={s.setupSubtitle}>
                                This determines how your grades are organised in
                                the sidebar.
                            </p>
                            <div
                                className={s.optionGrid}
                                style={{
                                    gridTemplateColumns:
                                        "repeat(auto-fill, minmax(140px, 1fr))",
                                }}
                            >
                                {(
                                    [
                                        {
                                            value: "mp",
                                            icon: "📋",
                                            label: "Marking Periods",
                                            counts: [4],
                                        },
                                        {
                                            value: "quarter",
                                            icon: "🗓️",
                                            label: "Quarters",
                                            counts: [4],
                                        },
                                        {
                                            value: "semester",
                                            icon: "📅",
                                            label: "Semesters",
                                            counts: [2],
                                        },
                                        {
                                            value: "trimester",
                                            icon: "📆",
                                            label: "Trimesters",
                                            counts: [3],
                                        },
                                        {
                                            value: "year",
                                            icon: "📓",
                                            label: "Full Year",
                                            counts: [1],
                                        },
                                    ] as const
                                ).map((opt) => (
                                    <div
                                        key={opt.value}
                                        className={`${s.optionCard} ${cfg.periodType === opt.value ? s.optionCardActive : ""}`}
                                        onClick={() =>
                                            set({
                                                periodType:
                                                    opt.value as PeriodType,
                                                periodCount: opt.counts[0],
                                            })
                                        }
                                    >
                                        <span className={s.optionCardIcon}>
                                            {opt.icon}
                                        </span>
                                        <span className={s.optionCardLabel}>
                                            {opt.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Period count (only for MP / quarter) */}
                            {(cfg.periodType === "mp" ||
                                cfg.periodType === "quarter") && (
                                <>
                                    <label className={s.setupLabel}>
                                        How many periods?
                                    </label>
                                    <div className={s.scaleGrid}>
                                        {[2, 3, 4, 6].map((n) => (
                                            <div
                                                key={n}
                                                className={`${s.scaleCard} ${cfg.periodCount === n ? s.scaleCardActive : ""}`}
                                                onClick={() =>
                                                    set({ periodCount: n })
                                                }
                                            >
                                                <span
                                                    className={s.scaleCardNum}
                                                >
                                                    {n}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* ── STEP 4: Partner school ── */}
                    {step === 4 && (
                        <>
                            <div className={s.setupStep}>
                                Step 4 of {TOTAL_STEPS} — Your School
                            </div>
                            <h2 className={s.setupTitle}>
                                Which school are you at?
                            </h2>
                            <p className={s.setupSubtitle}>
                                Partnered schools get a verified badge and may
                                unlock additional features. You cannot manually
                                type a partner school — select from the list.
                            </p>

                            {/* Partner schools — only EHS for now */}
                            <div className={s.partnerSection}>
                                {PARTNER_SCHOOLS.map((school) => (
                                    <div
                                        key={school.id}
                                        className={`${s.partnerOption} ${cfg.partnerId === school.id ? s.partnerOptionActive : ""}`}
                                        onClick={() =>
                                            set({
                                                partnerId: school.id,
                                                customSchoolName: "",
                                            })
                                        }
                                    >
                                        <span className={s.partnerBadge}>
                                            ✓ Partner
                                        </span>
                                        <div style={{ flex: 1 }}>
                                            <div className={s.partnerName}>
                                                {school.name}
                                            </div>
                                            <div className={s.partnerSub}>
                                                {school.location}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={s.divider} />

                            {/* Custom school name (non-partner) */}
                            <label className={s.setupLabel}>
                                Or enter your school name
                            </label>
                            <input
                                className={s.setupInput}
                                placeholder="My School Name"
                                value={cfg.customSchoolName}
                                onChange={(e) =>
                                    set({
                                        customSchoolName: e.target.value,
                                        partnerId: null,
                                    })
                                }
                            />
                        </>
                    )}

                    {/* ── STEP 5: Confirm ── */}
                    {step === 5 && (
                        <>
                            <div className={s.setupStep}>
                                Step 5 of {TOTAL_STEPS} — Ready!
                            </div>
                            <h2 className={s.setupTitle}>You're all set 🎉</h2>
                            <p className={s.setupSubtitle}>
                                Here's what we've configured:
                            </p>

                            {[
                                [
                                    "School type",
                                    cfg.schoolType === "hs"
                                        ? "High School"
                                        : "College / University",
                                ],
                                [
                                    "GPA scale",
                                    `${cfg.gpaScale.toFixed(1)} point${cfg.useWeightedGpa ? " · Weighted" : ""}`,
                                ],
                                [
                                    "Period type",
                                    `${cfg.periodCount}× ${cfg.periodType.toUpperCase()}`,
                                ],
                                [
                                    "School",
                                    cfg.partnerId
                                        ? (PARTNER_SCHOOLS.find(
                                              (p) => p.id === cfg.partnerId,
                                          )?.name ?? cfg.partnerId)
                                        : cfg.customSchoolName ||
                                          "Not specified",
                                ],
                            ].map(([label, val]) => (
                                <div
                                    key={label}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "9px 0",
                                        borderBottom:
                                            "1px solid var(--dash-border, rgba(223,208,184,0.10))",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "0.84rem",
                                            color: "var(--dash-text-muted)",
                                        }}
                                    >
                                        {label}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "0.84rem",
                                            fontWeight: 600,
                                            color: "var(--dash-text-primary)",
                                        }}
                                    >
                                        {val}
                                    </span>
                                </div>
                            ))}

                            <p
                                style={{
                                    fontSize: "0.78rem",
                                    color: "var(--dash-text-muted)",
                                    marginTop: 14,
                                }}
                            >
                                You can change any of these later in Settings.
                            </p>
                        </>
                    )}

                    {/* Footer nav */}
                    <div className={s.setupFooter}>
                        {step > 1 ? (
                            <button className={s.setupBack} onClick={back}>
                                ← Back
                            </button>
                        ) : (
                            <span />
                        )}

                        {step < TOTAL_STEPS ? (
                            <button className={s.setupNext} onClick={next}>
                                Continue →
                            </button>
                        ) : (
                            <button
                                className={s.setupNext}
                                onClick={handleFinish}
                            >
                                Launch GPA Calc →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
