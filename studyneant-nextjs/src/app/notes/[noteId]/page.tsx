"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { NotesState } from "../types";
import { loadNotes } from "../storage";
import NotesTopBar from "../components/NotesTopBar";
import NoteTreeSidebar from "../components/NoteTreeSidebar";
import NoteEditor from "../components/NoteEditor";
import s from "../Notes.module.css";

export default function NoteEditorPage() {
    const params = useParams();
    const noteId = typeof params?.noteId === "string" ? params.noteId : "";

    const [state, setState] = useState<NotesState>(() => {
        if (typeof window === "undefined") return { folders: [], notes: [] };
        return loadNotes();
    });

    useEffect(() => {
        setState(loadNotes());
    }, [noteId]);

    const activeNote = state.notes.find((n) => n.id === noteId);

    return (
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
                                : "No note ID. Check folder is named [noteId]."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
