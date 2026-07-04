"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { NotesState } from "./types";
import { loadNotes, saveNotes, makeNote } from "./storage";

import NotesTopBar from "./components/NotesTopBar";
import NotesDashboard from "./components/NotesDashboard";
import BottomNav from "../../components/bottomNav/BottomNav";

export default function NotesPage() {
    const router = useRouter();

    // Starts empty on the server prerender AND the client's first render so
    // the two agree; the persisted notes load in the mount effect below.
    // (The previous "load immediately in the initializer" approach populated
    // the first client render but made it diverge from the static HTML —
    // that divergence is exactly what a hydration error is.)
    const [state, setState] = useState<NotesState>({ folders: [], notes: [] });

    // Hydrate persisted notes after mount. loadNotes() seeds localStorage on
    // first visit — doing that here keeps the write out of render.
    useEffect(() => {
        setState(loadNotes());
    }, []);

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
