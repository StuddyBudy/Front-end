import type { NotesState, Folder, Note } from "./types";

// ── KEY ───────────────────────────────────────────────────────────────────────
export const NOTES_LS_KEY = "studyos_notes";

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const NOW = Date.now();

export const SEED_STATE: NotesState = {
    folders: [
        {
            id: "f1",
            name: "Calculus",
            color: "#de8900",
            createdAt: NOW - 86400000 * 3,
        },
        {
            id: "f2",
            name: "Physics",
            color: "#5b8dee",
            createdAt: NOW - 86400000 * 2,
        },
        {
            id: "f3",
            name: "Literature",
            color: "#4caf78",
            createdAt: NOW - 86400000,
        },
    ],
    notes: [
        {
            id: "n1",
            folderId: "f1",
            title: "Derivatives",
            content:
                "A derivative measures how a function changes as its input changes.\n\n" +
                "f'(x) = lim(h→0) [f(x+h) - f(x)] / h\n\n" +
                "Common rules:\n" +
                "• Power rule: d/dx(xⁿ) = nxⁿ⁻¹\n" +
                "• Product rule: (uv)' = u'v + uv'\n" +
                "• Chain rule: d/dx f(g(x)) = f'(g(x)) · g'(x)",
            createdAt: NOW - 86400000 * 2,
            updatedAt: NOW - 3600000,
        },
        {
            id: "n2",
            folderId: "f1",
            title: "Integrals",
            content:
                "Integration is the reverse of differentiation.\n\n" +
                "∫xⁿ dx = xⁿ⁺¹ / (n+1) + C\n\n" +
                "Definite integral gives the area under a curve between two points.",
            createdAt: NOW - 86400000,
            updatedAt: NOW - 7200000,
        },
        {
            id: "n3",
            folderId: "f2",
            title: "Newton's Laws",
            content:
                "1st Law — An object at rest stays at rest unless acted on by a force.\n" +
                "2nd Law — F = ma\n" +
                "3rd Law — For every action there is an equal and opposite reaction.",
            createdAt: NOW - 86400000,
            updatedAt: NOW - 1800000,
        },
        {
            id: "n4",
            folderId: null,
            title: "Study Tips",
            content:
                "• Pomodoro: 25 min focus, 5 min break\n" +
                "• Spaced repetition for memorisation\n" +
                "• Teach the concept to someone else\n" +
                "• Review notes within 24 hours",
            createdAt: NOW - 3600000,
            updatedAt: NOW - 1800000,
        },
    ],
};

// ── LOAD ──────────────────────────────────────────────────────────────────────
// ROOT FIX: On first visit localStorage is empty, so we return SEED_STATE AND
// immediately write it to localStorage. This means every subsequent page
// (including the note editor) will always find data in localStorage — no more
// "note not found" on freshly-loaded notes.
export function loadNotes(): NotesState {
    if (typeof window === "undefined") return SEED_STATE;
    try {
        const raw = localStorage.getItem(NOTES_LS_KEY);
        if (raw) {
            return JSON.parse(raw) as NotesState;
        }
        // First visit — persist the seed data immediately so editor pages can find it
        localStorage.setItem(NOTES_LS_KEY, JSON.stringify(SEED_STATE));
        return SEED_STATE;
    } catch {
        return SEED_STATE;
    }
}

// ── SAVE ──────────────────────────────────────────────────────────────────────
export function saveNotes(state: NotesState): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(NOTES_LS_KEY, JSON.stringify(state));
    } catch {}
}

// ── ID GENERATOR ──────────────────────────────────────────────────────────────
export function newId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── FOLDER COLOURS ────────────────────────────────────────────────────────────
export const FOLDER_COLORS = [
    "#de8900",
    "#5b8dee",
    "#4caf78",
    "#a78bfa",
    "#e05555",
    "#e0a030",
    "#f472b6",
    "#22d3ee",
];

// ── DATE FORMATTER ────────────────────────────────────────────────────────────
export function fmtDate(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── NOTE PREVIEW ──────────────────────────────────────────────────────────────
export function notePreview(content: string, chars = 80): string {
    const firstLine = content.split("\n").find((l) => l.trim()) ?? "";
    return firstLine.length > chars
        ? firstLine.slice(0, chars) + "…"
        : firstLine || "Empty note";
}

// ── FACTORY HELPERS ───────────────────────────────────────────────────────────
export function makeFolder(name: string, color: string): Folder {
    return { id: newId(), name, color, createdAt: Date.now() };
}

export function makeNote(folderId: string | null, title = "Untitled"): Note {
    const now = Date.now();
    return {
        id: newId(),
        folderId,
        title,
        content: "",
        createdAt: now,
        updatedAt: now,
    };
}
