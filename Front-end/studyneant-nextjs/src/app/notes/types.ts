// ── NOTES TYPES ───────────────────────────────────────────────────────────────

export type Folder = {
    id: string;
    name: string;
    createdAt: number;
};

export type Note = {
    id: string;
    folderId: string | null; // null = loose note (no folder)
    title: string;
    content: string;
    updatedAt: number;
};

export type NotesState = {
    folders: Folder[];
    notes: Note[];
};
