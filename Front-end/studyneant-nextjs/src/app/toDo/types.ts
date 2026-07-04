// ── TO-DO TYPES ───────────────────────────────────────────────────────────────

export type SortMode = "manual" | "alpha" | "date" | "done-last" | "priority";

export type TodoList = {
    id: string;
    name: string;
    color: string;
    emoji: string; // user-picked emoji icon e.g. "📚"
    order: number;
    createdAt: number;
};

export type SubTask = {
    id: string;
    text: string;
    done: boolean;
};

export type TodoItem = {
    id: string;
    listId: string;
    text: string;
    note: string; // optional short description / note
    done: boolean;
    pinned: boolean; // pinned tasks float to top of their list
    priority: "low" | "medium" | "high" | "none";
    dueDate: string; // "YYYY-MM-DD" or ""
    subTasks: SubTask[]; // nested checklist
    createdAt: number;
};

export type TodoState = {
    lists: TodoList[];
    items: TodoItem[];
    sortMode: SortMode;
};
