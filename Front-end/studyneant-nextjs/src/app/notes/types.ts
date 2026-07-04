// ── NOTES TYPES ───────────────────────────────────────────────────────────────

export type Folder = {
    id: string;
    name: string;
    color: string; // accent colour for the folder tab
    createdAt: number;
};

export type Note = {
    id: string;
    folderId: string | null; // null = loose note (no folder)
    title: string;
    content: string; // plain text content
    createdAt: number;
    updatedAt: number;
};

// The full notes state persisted to localStorage
export type NotesState = {
    folders: Folder[];
    notes: Note[];
};
