"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { notesStore } from "./storage";
import { useStorageStore } from "@/hooks/storageStore";

import NotesTopBar from "./components/NotesTopBar";
import NoteTreeSidebar from "./components/NoteTreeSidebar";
import NoteEditor from "./components/NoteEditor";
import BottomNav from "@/components/bottomNav/BottomNav";

import s from "./Notes.module.css";

export default function NoteEditorPage() {
    return (
        <Suspense fallback={null}>
            <NoteEditorContent />
            <BottomNav />
        </Suspense>
    );
}

function NoteEditorContent() {
    const searchParams = useSearchParams();
    const noteId = searchParams.get("id") ?? "";

    // Same notesStore as /notes — the hydration snapshot is empty on both
    // sides, the persisted/seeded notes arrive right after hydration, and
    // writes persist through the store (see notes/storage.ts).
    const [state, setState] = useStorageStore(notesStore);

    const activeNote = state.notes.find((n) => n.id === noteId);

    return (
        <Suspense fallback={null}>
            <div className={s.shell} suppressHydrationWarning>
                <NotesTopBar mode="editor" noteTitle={activeNote?.title} />
                <div className={s.body}>
                    <NoteTreeSidebar
                        state={state}
                        setState={setState}
                        activeNoteId={noteId}
                    />
                    {activeNote ? (
                        <NoteEditor
                            key={activeNote.id}
                            note={activeNote}
                            state={state}
                            setState={setState}
                        />
                    ) : (
                        <div className={s.noNoteState}>
                            <span className={s.noNoteEmoji}>📄</span>
                            <p className={s.noNoteText}>
                                {noteId
                                    ? "Note not found — it may have been deleted."
                                    : "No note selected. Open a note from the sidebar."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Suspense>
    );
}
