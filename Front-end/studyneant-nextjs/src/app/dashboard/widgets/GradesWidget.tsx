"use client";

import s from "../Dashboard.module.css";

const GRADES = [
    { subject: "Calculus", grade: "A", pct: 100 },
    { subject: "Physics", grade: "B", pct: 79 },
    { subject: "Gym", grade: "C", pct: 67 },
    { subject: "English", grade: "A-", pct: 92 },
];

function gradeColor(pct: number): string {
    if (pct >= 90) return "#4caf78";
    if (pct >= 80) return "#de8900";
    if (pct >= 70) return "#e0a030";
    return "#e05555";
}

export default function GradesWidget() {
    return (
        <ul className={s.gradeList}>
            {GRADES.map(({ subject, grade, pct }) => (
                <li key={subject} className={s.gradeItem}>
                    <div className={s.gradeRow}>
                        <span className={s.gSub}>{subject}</span>
                        <span
                            className={s.gBadge}
                            style={{ color: gradeColor(pct) }}
                        >
                            {grade}
                        </span>
                    </div>
                    <div className={s.gradeTrack}>
                        <div
                            className={s.gradeFill}
                            style={{
                                width: `${pct}%`,
                                background: gradeColor(pct),
                            }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
}
