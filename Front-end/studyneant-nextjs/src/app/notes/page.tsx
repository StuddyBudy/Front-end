"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { makeNote, notesStore } from "./storage";
import { useStorageStore } from "@/hooks/storageStore";

import NotesTopBar from "./components/NotesTopBar";
import NotesDashboard from "./components/NotesDashboard";
import BottomNav from "../../components/bottomNav/BottomNav";

export default function NotesPage() {
    const router = useRouter();

    // Read through notesStore (useSyncExternalStore): the server prerender
    // and the client's hydration render both see the empty state, then the
    // persisted/seeded notes arrive in the post-hydration render. setState is
    // the store's set — every write persists to localStorage automatically.
    const [state, setState] = useStorageStore(notesStore);

    // Folder modal open state — lifted here so the top-bar button can trigger it
    const [folderModalOpen, setFolderModalOpen] = useState(false);

    const handleNewNote = () => {
        const note = makeNote(null, "Untitled");
        const next = { ...state, notes: [...state.notes, note] };
        setState(next);
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
                backgroundImage:
                    "var(--dash-bg-image, url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\"))",
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
