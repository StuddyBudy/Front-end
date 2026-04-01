"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NotesState } from "./types";
import { loadNotes, saveNotes, makeNote } from "./storage";

import NotesTopBar from "./components/NotesTopBar";
import NotesDashboard from "./components/NotesDashboard";
import BottomNav from "../../components/bottomNav/BottomNav";

export default function NotesPage() {
    const router = useRouter();

    // FIX: Same pattern as [noteId]/page.tsx — load from localStorage immediately
    // in the useState initializer so state is populated on the first client render.
    const [state, setState] = useState<NotesState>(() => {
        if (typeof window === "undefined") return { folders: [], notes: [] };
        return loadNotes(); // writes seed data to localStorage if first visit
    });

    // Folder modal open state — lifted here so the top-bar button can trigger it
    const [folderModalOpen, setFolderModalOpen] = useState(false);

    const handleNewNote = () => {
        const note = makeNote(null, "Untitled");
        const next = { ...state, notes: [...state.notes, note] };
        setState(next);
        saveNotes(next);
        router.push(`/notes/editor?id=${note.id}`);
    };

    return (
        <div
            suppressHydrationWarning
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                overflow: "hidden",
                backgroundColor: "var(--dash-bg-page, #16120e)",
            }}
        >
            <NotesTopBar
                mode="dashboard"
                onNewNote={handleNewNote}
                onNewFolder={() => setFolderModalOpen(true)}
            />

            <NotesDashboard
                state={state}
                setState={setState}
                folderModalOpen={folderModalOpen}
                onFolderModalClose={() => setFolderModalOpen(false)}
            />
            <BottomNav />
        </div>
    );
}
