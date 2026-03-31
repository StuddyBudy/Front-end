"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { NotesState } from "../types";
import { loadNotes } from "../storage";
import NotesTopBar from "../components/NotesTopBar";
import NoteTreeSidebar from "../components/NoteTreeSidebar";
import NoteEditor from "../components/NoteEditor";
import s from "../Notes.module.css";

export default function NoteEditorPage() {
    return (
        <Suspense fallback={null}>
            <NoteEditorContent />
        </Suspense>
    );
}

function NoteEditorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const noteId = searchParams.get("id") ?? "";

    const [state, setState] = useState<NotesState>(() => {
        if (typeof window === "undefined") return { folders: [], notes: [] };
        return loadNotes();
    });

    const activeNote = state.notes.find((n) => n.id === noteId);

    // If a note exists but no id is provided, fall back to first note to keep the editor usable
    useEffect(() => {
        if (!noteId && state.notes.length > 0) {
            router.replace(`/notes/editor?id=${state.notes[0].id}`);
        }
    }, [noteId, state.notes, router]);

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
                                    : "No note selected. Use the list to pick a note."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Suspense>
    );
}
