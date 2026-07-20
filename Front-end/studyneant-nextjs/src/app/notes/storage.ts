import type { NotesState, Folder, Note } from "./types";
import { createStorageStore } from "@/hooks/storageStore";

// ── KEY ───────────────────────────────────────────────────────────────────────
export const NOTES_LS_KEY = "studyos_notes";

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const NOW = Date.now();

export const SEED_STATE: NotesState = {
    folders: [
        {
            id: "f1",
            name: "Calculus",
            createdAt: NOW - 86400000 * 3,
        },
        {
            id: "f2",
            name: "Physics",
            createdAt: NOW - 86400000 * 2,
        },
        {
            id: "f3",
            name: "Literature",
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
            updatedAt: NOW - 1800000,
        },
    ],
};

// ── LOAD ──────────────────────────────────────────────────────────────────────
// First visit returns SEED_STATE without writing it: load() runs during render
// via the store's getSnapshot, so it must stay read-only. Both notes routes
// read the same notesStore below, so the editor finds freshly-seeded notes in
// shared memory (the old "write the seed immediately" fix is unnecessary);
// the seed persists on the first real mutation through notesStore.set.
export function loadNotes(): NotesState {
    if (typeof window === "undefined") return SEED_STATE;
    try {
        const raw = localStorage.getItem(NOTES_LS_KEY);
        if (raw) {
            return JSON.parse(raw) as NotesState;
        }
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

// ── STORE ─────────────────────────────────────────────────────────────────────
export const EMPTY_NOTES_STATE: NotesState = { folders: [], notes: [] };

export const notesStore = createStorageStore<NotesState>({
    load: loadNotes,
    persist: saveNotes,
    server: EMPTY_NOTES_STATE,
});

// ── ID GENERATOR ──────────────────────────────────────────────────────────────
export function newId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

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
export function makeFolder(name: string): Folder {
    return { id: newId(), name, createdAt: Date.now() };
}

export function makeNote(folderId: string | null, title = "Untitled"): Note {
    const now = Date.now();
    return {
        id: newId(),
        folderId,
        title,
        content: "",
        updatedAt: now,
    };
}
