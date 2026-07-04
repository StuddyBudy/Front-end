import type {
    Course,
    Category,
    Assignment,
    GpaConfig,
    CourseWeight,
} from "./types";

// ── GRADE SCALE ───────────────────────────────────────────────────────────────
export function pctToLetter(pct: number): string {
    if (pct >= 97) return "A+";
    if (pct >= 93) return "A";
    if (pct >= 90) return "A-";
    if (pct >= 87) return "B+";
    if (pct >= 83) return "B";
    if (pct >= 80) return "B-";
    if (pct >= 77) return "C+";
    if (pct >= 73) return "C";
    if (pct >= 70) return "C-";
    if (pct >= 67) return "D+";
    if (pct >= 60) return "D";
    return "F";
}

// Base GPA points on 4.0 scale before weighting
export function letterToGpaPoints(letter: string): number {
    const map: Record<string, number> = {
        "A+": 4.0,
        A: 4.0,
        "A-": 3.7,
        "B+": 3.3,
        B: 3.0,
        "B-": 2.7,
        "C+": 2.3,
        C: 2.0,
        "C-": 1.7,
        "D+": 1.3,
        D: 1.0,
        F: 0.0,
    };
    return map[letter] ?? 0;
}

// Bonus points added based on course type (for weighted GPA)
export function weightBonus(weight: CourseWeight): number {
    switch (weight) {
        case "honors":
        case "dual":
            return 0.5;
        case "ap":
        case "ib":
            return 1.0;
        default:
            return 0.0;
    }
}

export function gpaPoints(
    pct: number,
    weight: CourseWeight,
    config: GpaConfig,
    graded: boolean,
): number | null {
    if (!graded) return null;
    const base = letterToGpaPoints(pctToLetter(pct));
    const bonus = config.useWeightedGpa ? weightBonus(weight) : 0;
    return Math.min(base + bonus, config.gpaScale);
}

// ── CATEGORY AVERAGE ──────────────────────────────────────────────────────────
export function categoryAverage(
    categoryId: string,
    assignments: Assignment[],
): number | null {
    const graded = assignments.filter(
        (a) =>
            a.categoryId === categoryId &&
            !a.excluded &&
            !a.missing &&
            a.pointsEarned !== null,
    );
    if (graded.length === 0) return null;

    const earned = graded.reduce(
        (sum, a) => sum + a.pointsEarned! * a.multiplier,
        0,
    );
    const total = graded.reduce(
        (sum, a) => sum + a.pointsTotal * a.multiplier,
        0,
    );
    return total === 0 ? null : (earned / total) * 100;
}

// ── COURSE AVERAGE ────────────────────────────────────────────────────────────
// Weighted average across categories (category.weight must sum to ~100)
export function courseAverage(
    courseId: string,
    categories: Category[],
    assignments: Assignment[],
): number | null {
    const cats = categories.filter((c) => c.courseId === courseId);
    if (cats.length === 0) return null;

    let weightSum = 0;
    let weightedTotal = 0;

    for (const cat of cats) {
        const avg = categoryAverage(cat.id, assignments);
        if (avg !== null) {
            weightedTotal += avg * cat.weight;
            weightSum += cat.weight;
        }
    }

    return weightSum === 0 ? null : weightedTotal / weightSum;
}

// ── OVERALL GPA ───────────────────────────────────────────────────────────────
export function calculateGpa(
    courses: Course[],
    categories: Category[],
    assignments: Assignment[],
    config: GpaConfig,
): { gpa: number | null; creditHours: number; gradedCourses: number } {
    let totalPoints = 0;
    let totalCredits = 0;
    let gradedCount = 0;

    for (const course of courses) {
        const avg = courseAverage(course.id, categories, assignments);
        if (avg === null) continue;
        const pts = gpaPoints(avg, course.weight, config, true);
        if (pts === null) continue;
        totalPoints += pts * course.credits;
        totalCredits += course.credits;
        gradedCount++;
    }

    return {
        gpa: totalCredits === 0 ? null : totalPoints / totalCredits,
        creditHours: totalCredits,
        gradedCourses: gradedCount,
    };
}

// ── PROJECTED GPA (all courses receive same grade) ────────────────────────────
export function projectedGpa(
    courses: Course[],
    categories: Category[],
    assignments: Assignment[],
    config: GpaConfig,
): number | null {
    // For ungraded courses, project 90% (A-)
    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
        const avg = courseAverage(course.id, categories, assignments) ?? 90;
        const pts = gpaPoints(avg, course.weight, config, true)!;
        totalPoints += pts * course.credits;
        totalCredits += course.credits;
    }

    return totalCredits === 0 ? null : totalPoints / totalCredits;
}

// ── EMOJI REACTION ────────────────────────────────────────────────────────────
export function gradeEmoji(pct: number | null): string {
    if (pct === null) return "😴";
    if (pct >= 97) return "🤩";
    if (pct >= 93) return "😁";
    if (pct >= 90) return "😊";
    if (pct >= 87) return "😃";
    if (pct >= 83) return "🙂";
    if (pct >= 80) return "😌";
    if (pct >= 70) return "😐";
    if (pct >= 60) return "😟";
    return "😰";
}

// ── GRADE COLOUR ──────────────────────────────────────────────────────────────
export function gradeColor(pct: number | null): string {
    if (pct === null) return "var(--dash-text-muted)";
    if (pct >= 90) return "#4caf78";
    if (pct >= 80) return "#de8900";
    if (pct >= 70) return "#e0a030";
    if (pct >= 60) return "#e05555";
    return "#c0392b";
}

// ── MISSING COUNT ─────────────────────────────────────────────────────────────
export function missingCount(
    courseId: string,
    assignments: Assignment[],
): number {
    return assignments.filter((a) => a.courseId === courseId && a.missing)
        .length;
}

// ── FORMAT PCT ────────────────────────────────────────────────────────────────
export function fmtPct(n: number | null, decimals = 1): string {
    if (n === null) return "—";
    return n.toFixed(decimals) + "%";
}

export function fmtGpa(n: number | null): string {
    if (n === null) return "—";
    return n.toFixed(2);
}

// ── GRADE CHIP CLASS ─────────────────────────────────────────────────────────
export function chipClass(letter: string): string {
    if (letter.startsWith("A")) return "chipA";
    if (letter.startsWith("B")) return "chipB";
    if (letter.startsWith("C")) return "chipC";
    if (letter.startsWith("D")) return "chipD";
    return "chipF";
}

// ── CSV PARSE ─────────────────────────────────────────────────────────────────
type CsvRow = {
    name: string;
    category: string;
    pointsEarned: number | null;
    pointsTotal: number;
    dueDate: string;
    missing: boolean;
};

export function parseCsv(raw: string): { rows: CsvRow[]; errors: string[] } {
    const lines = raw.trim().split(/\r?\n/);
    const errors: string[] = [];
    const rows: CsvRow[] = [];

    if (lines.length < 2) {
        errors.push("CSV must have a header row and at least one data row.");
        return { rows, errors };
    }

    const header = lines[0]
        .toLowerCase()
        .split(",")
        .map((h) => h.trim());
    const nameIdx =
        header.indexOf("assignment") !== -1
            ? header.indexOf("assignment")
            : header.indexOf("name");
    const catIdx = header.indexOf("category");
    const earnedIdx = header.findIndex(
        (h) => h.includes("earned") || h.includes("points earned"),
    );
    const totalIdx = header.findIndex(
        (h) =>
            h.includes("total") ||
            h.includes("points total") ||
            h.includes("points possible"),
    );
    const dueIdx = header.findIndex((h) => h.includes("due"));

    if (nameIdx === -1) errors.push("Missing 'Assignment' or 'Name' column");
    if (earnedIdx === -1) errors.push("Missing 'Points Earned' column");
    if (totalIdx === -1)
        errors.push("Missing 'Points Total' or 'Points Possible' column");
    if (errors.length) return { rows, errors };

    for (let i = 1; i < lines.length; i++) {
        const cells = lines[i]
            .split(",")
            .map((c) => c.trim().replace(/^"|"$/g, ""));
        const earnedRaw = cells[earnedIdx] ?? "";
        const totalRaw = cells[totalIdx] ?? "";
        const earned =
            earnedRaw === "" || earnedRaw === "-"
                ? null
                : parseFloat(earnedRaw);
        const total = parseFloat(totalRaw);

        if (isNaN(total) || total <= 0) {
            errors.push(`Row ${i + 1}: invalid points total "${totalRaw}"`);
            continue;
        }

        rows.push({
            name: cells[nameIdx] ?? `Assignment ${i}`,
            category: catIdx !== -1 ? (cells[catIdx] ?? "General") : "General",
            pointsEarned: earned !== null && !isNaN(earned) ? earned : null,
            pointsTotal: total,
            dueDate: dueIdx !== -1 ? (cells[dueIdx] ?? "") : "",
            missing: earnedRaw === "-" || earnedRaw.toLowerCase() === "missing",
        });
    }

    return { rows, errors };
}
