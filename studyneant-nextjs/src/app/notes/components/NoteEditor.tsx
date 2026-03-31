"use client";

import { useState, useRef, useCallback } from "react";
import type { Note, NotesState } from "../types";
import { saveNotes, fmtDate } from "../storage";
import s from "../Notes.module.css";

type Props = {
    note: Note;
    state: NotesState;
    setState: (s: NotesState) => void;
};

export default function NoteEditor({ note, state, setState }: Props) {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [saved, setSaved] = useState(false);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-save with 800 ms debounce
    const persist = useCallback(
        (nextTitle: string, nextContent: string) => {
            if (saveTimer.current) clearTimeout(saveTimer.current);
            saveTimer.current = setTimeout(() => {
                const updatedNote: Note = {
                    ...note,
                    title: nextTitle,
                    content: nextContent,
                    updatedAt: Date.now(),
                };
                const nextState: NotesState = {
                    ...state,
                    notes: state.notes.map((n) =>
                        n.id === note.id ? updatedNote : n,
                    ),
                };
                setState(nextState);
                saveNotes(nextState);
                setSaved(true);
                setTimeout(() => setSaved(false), 1800);
            }, 800);
        },
        [note, state, setState],
    );

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        persist(e.target.value, content);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        persist(title, e.target.value);
    };

    const folder = state.folders.find((f) => f.id === note.folderId);

    return (
        <div className={s.editorArea}>
            {/* Title row */}
            <div className={s.editorTitleWrap}>
                <input
                    className={s.editorTitleInput}
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Untitled"
                />
                <div className={s.editorMeta}>
                    <span className={s.editorMetaText}>
                        Last edited {fmtDate(note.updatedAt)}
                    </span>
                    {folder && (
                        <span
                            className={s.noteCardFolder}
                            style={{
                                background: folder.color + "33",
                                color: folder.color,
                                padding: "2px 8px",
                                borderRadius: 99,
                                fontSize: "0.70rem",
                            }}
                        >
                            {folder.name}
                        </span>
                    )}
                </div>
            </div>

            {/* Lined editor */}
            <div className={s.editorScroll}>
                <textarea
                    className={s.editorContent}
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Start writing…"
                    spellCheck
                />
                <span
                    className={`${s.saveIndicator} ${saved ? s.saveIndicatorVisible : ""}`}
                >
                    ✓ Saved
                </span>
            </div>
        </div>
    );
}
