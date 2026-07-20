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

export default function () {
    return (
        <>
            <NoteEditorContent />
            <BottomNav />
        </>
    );
}

function NoteEditorContent() {
    const searchParams = useSearchParams();
    const noteId = searchParams.get("id") ?? "";

    const [state, setState] = useStorageStore(notesStore);

    const activeNote = state.notes.find((n) => n.id === noteId);

    return (
        <Suspense fallback={"Note Loading"}>
            <div className={s.shell} suppressHydrationWarning>
                <NotesTopBar noteTitle={activeNote?.title ?? ""} />
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
