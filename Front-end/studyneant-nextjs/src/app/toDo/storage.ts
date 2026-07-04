import type { TodoState, TodoList, TodoItem, SubTask, SortMode } from "./types";

export const TODO_LS_KEY = "studyos_todo_v3";

// ── COLOURS & EMOJIS ─────────────────────────────────────────────────────────
export const LIST_COLORS = [
    "#5b8dee",
    "#de8900",
    "#4caf78",
    "#a78bfa",
    "#e05555",
    "#e0a030",
    "#f472b6",
    "#22d3ee",
    "#64748b",
];

export const LIST_EMOJIS = [
    "📋",
    "📚",
    "🎯",
    "💼",
    "🏠",
    "💪",
    "🛒",
    "✈️",
    "🎨",
    "🎵",
    "💡",
    "🔥",
    "⭐",
    "🌿",
    "🏋️",
    "📝",
    "🧪",
    "🎓",
];

export const PRIORITY_CONFIG = {
    none: { label: "None", color: "transparent", flag: "", order: 0 },
    low: { label: "Low", color: "#4caf78", flag: "↓", order: 1 },
    medium: { label: "Medium", color: "#e0a030", flag: "→", order: 2 },
    high: { label: "High", color: "#e05555", flag: "↑", order: 3 },
} as const;

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const NOW = Date.now();

export const SEED_STATE: TodoState = {
    sortMode: "manual",
    lists: [
        {
            id: "l1",
            name: "Personal",
            color: "#4caf78",
            emoji: "🏠",
            order: 0,
            createdAt: NOW - 3 * 86400000,
        },
        {
            id: "l2",
            name: "School",
            color: "#e05555",
            emoji: "🎓",
            order: 1,
            createdAt: NOW - 2 * 86400000,
        },
        {
            id: "l3",
            name: "Fitness",
            color: "#5b8dee",
            emoji: "💪",
            order: 2,
            createdAt: NOW - 1 * 86400000,
        },
        {
            id: "l4",
            name: "General",
            color: "#de8900",
            emoji: "📋",
            order: 3,
            createdAt: NOW,
        },
    ],
    items: [
        {
            id: "i1",
            listId: "l1",
            text: "Call mom",
            done: false,
            pinned: true,
            priority: "low",
            dueDate: "",
            note: "Ask about Thanksgiving plans",
            subTasks: [],
            createdAt: NOW - 5000,
        },
        {
            id: "i2",
            listId: "l1",
            text: "Buy groceries",
            done: false,
            pinned: false,
            priority: "none",
            dueDate: "",
            note: "",
            subTasks: [
                { id: "s1", text: "Milk", done: false },
                { id: "s2", text: "Eggs", done: true },
            ],
            createdAt: NOW - 4800,
        },
        {
            id: "i3",
            listId: "l1",
            text: "Read Chapter 7",
            done: true,
            pinned: false,
            priority: "none",
            dueDate: "",
            note: "",
            subTasks: [],
            createdAt: NOW - 4600,
        },
        {
            id: "i4",
            listId: "l2",
            text: "Submit lab report",
            done: false,
            pinned: true,
            priority: "high",
            dueDate: "",
            note: "Due end of week",
            subTasks: [],
            createdAt: NOW - 4400,
        },
        {
            id: "i5",
            listId: "l2",
            text: "Email professor",
            done: false,
            pinned: false,
            priority: "medium",
            dueDate: "",
            note: "",
            subTasks: [],
            createdAt: NOW - 4200,
        },
        {
            id: "i6",
            listId: "l2",
            text: "Calculus problem set",
            done: false,
            pinned: false,
            priority: "high",
            dueDate: "",
            note: "Problems 1–20 from Ch.4",
            subTasks: [],
            createdAt: NOW - 4000,
        },
        {
            id: "i7",
            listId: "l3",
            text: "Gym — chest day",
            done: false,
            pinned: false,
            priority: "none",
            dueDate: "",
            note: "Bench, flies, cable crossover",
            subTasks: [],
            createdAt: NOW - 3800,
        },
        {
            id: "i8",
            listId: "l3",
            text: "Run 3 miles",
            done: true,
            pinned: false,
            priority: "none",
            dueDate: "",
            note: "",
            subTasks: [],
            createdAt: NOW - 3600,
        },
        {
            id: "i9",
            listId: "l4",
            text: "Finish React dashboard",
            done: false,
            pinned: true,
            priority: "high",
            dueDate: "",
            note: "Focus on grid layout",
            subTasks: [],
            createdAt: NOW - 3400,
        },
        {
            id: "i10",
            listId: "l4",
            text: "Review PR feedback",
            done: false,
            pinned: false,
            priority: "medium",
            dueDate: "",
            note: "",
            subTasks: [],
            createdAt: NOW - 3200,
        },
    ],
};

// ── LOAD / SAVE ───────────────────────────────────────────────────────────────
export function loadTodo(): TodoState {
    if (typeof window === "undefined") return SEED_STATE;
    try {
        const raw = localStorage.getItem(TODO_LS_KEY);
        if (raw) return JSON.parse(raw) as TodoState;
        localStorage.setItem(TODO_LS_KEY, JSON.stringify(SEED_STATE));
        return SEED_STATE;
    } catch {
        return SEED_STATE;
    }
}

export function saveTodo(state: TodoState): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(TODO_LS_KEY, JSON.stringify(state));
    } catch {}
}

// ── ID GENERATOR ──────────────────────────────────────────────────────────────
export function newId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ── FACTORY HELPERS ───────────────────────────────────────────────────────────
export function makeList(
    name: string,
    color: string,
    emoji: string,
    order: number,
): TodoList {
    return {
        id: newId(),
        name: name.trim(),
        color,
        emoji,
        order,
        createdAt: Date.now(),
    };
}

export function makeItem(listId: string, text: string): TodoItem {
    return {
        id: newId(),
        listId,
        text: text.trim(),
        note: "",
        done: false,
        pinned: false,
        priority: "none",
        dueDate: "",
        subTasks: [],
        createdAt: Date.now(),
    };
}

export function makeSubTask(text: string): SubTask {
    return { id: newId(), text: text.trim(), done: false };
}

// ── DUPLICATE LIST ────────────────────────────────────────────────────────────
export function duplicateList(state: TodoState, listId: string): TodoState {
    const src = state.lists.find((l) => l.id === listId);
    if (!src) return state;
    const newList: TodoList = {
        ...src,
        id: newId(),
        name: `${src.name} (copy)`,
        order: state.lists.length,
    };
    const srcItems = state.items.filter((i) => i.listId === listId);
    const newItems = srcItems.map((i) => ({
        ...i,
        id: newId(),
        listId: newList.id,
    }));
    return {
        ...state,
        lists: [...state.lists, newList],
        items: [...state.items, ...newItems],
    };
}

// ── SORT ──────────────────────────────────────────────────────────────────────
export function sortItems(items: TodoItem[], mode: SortMode): TodoItem[] {
    const pinned = items.filter((i) => i.pinned && !i.done);
    const rest = items.filter((i) => !i.pinned || i.done);

    const sortFn = (a: TodoItem, b: TodoItem) => {
        switch (mode) {
            case "alpha":
                return a.text.localeCompare(b.text);
            case "date":
                return a.createdAt - b.createdAt;
            case "done-last":
                return Number(a.done) - Number(b.done);
            case "priority":
                return (
                    PRIORITY_CONFIG[b.priority].order -
                    PRIORITY_CONFIG[a.priority].order
                );
            default:
                return a.createdAt - b.createdAt;
        }
    };

    return [...pinned.sort(sortFn), ...rest.sort(sortFn)];
}

export function itemsForList(state: TodoState, listId: string): TodoItem[] {
    return sortItems(
        state.items.filter((i) => i.listId === listId),
        state.sortMode,
    );
}

export function pendingCount(state: TodoState, listId: string): number {
    return state.items.filter((i) => i.listId === listId && !i.done).length;
}

export function totalCount(state: TodoState, listId: string): number {
    return state.items.filter((i) => i.listId === listId).length;
}

export function isOverdue(dueDate: string): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date(new Date().toDateString());
}
