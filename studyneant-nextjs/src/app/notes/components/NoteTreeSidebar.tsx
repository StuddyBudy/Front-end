"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NotesState, Folder } from "../types";
import { makeNote, makeFolder, saveNotes, FOLDER_COLORS } from "../storage";
import s from "../Notes.module.css";

type Props = {
    state: NotesState;
    setState: (s: NotesState) => void;
    activeNoteId: string;
};

export default function NoteTreeSidebar({
    state,
    setState,
    activeNoteId,
}: Props) {
    const router = useRouter();

    // Which folders are expanded
    const [openFolders, setOpenFolders] = useState<Set<string>>(() => {
        // Auto-expand the folder containing the active note
        const note = state.notes.find((n) => n.id === activeNoteId);
        return note?.folderId ? new Set([note.folderId]) : new Set();
    });

    // Inline new-folder creation
    const [addingFolder, setAddingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    const toggleFolder = (id: string) =>
        setOpenFolders((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const openNote = (noteId: string) => router.push(`/notes/${noteId}`);

    const handleNewNote = (folderId: string | null = null) => {
        const note = makeNote(folderId, "Untitled");
        const next = { ...state, notes: [...state.notes, note] };
        setState(next);
        saveNotes(next);
        router.push(`/notes/${note.id}`);
    };

    const handleCreateFolder = () => {
        const name = newFolderName.trim();
        if (!name) {
            setAddingFolder(false);
            return;
        }
        const color =
            FOLDER_COLORS[state.folders.length % FOLDER_COLORS.length];
        const folder = makeFolder(name, color);
        const next = { ...state, folders: [...state.folders, folder] };
        setState(next);
        saveNotes(next);
        setOpenFolders((prev) => new Set([...prev, folder.id]));
        setAddingFolder(false);
        setNewFolderName("");
    };

    const looseNotes = state.notes.filter((n) => n.folderId === null);

    return (
        <aside className={s.treeSidebar}>
            {/* Action buttons */}
            <div className={s.treeActions}>
                <button
                    className={s.iconBtn}
                    onClick={() => setAddingFolder(true)}
                    title="New folder"
                >
                    📁
                </button>
                <button
                    className={s.iconBtn}
                    onClick={() => handleNewNote(null)}
                    title="New quick note"
                >
                    +
                </button>
            </div>

            <div className={s.treeScroll}>
                {/* ── FOLDERS ── */}
                {state.folders.map((folder) => {
                    const isOpen = openFolders.has(folder.id);
                    const children = state.notes.filter(
                        (n) => n.folderId === folder.id,
                    );
                    return (
                        <div key={folder.id}>
                            {/* Folder row */}
                            <button
                                className={`${s.folderRow} ${isOpen ? s.folderRowOpen : ""}`}
                                onClick={() => toggleFolder(folder.id)}
                            >
                                <span
                                    className={`${s.folderChevron} ${isOpen ? s.folderChevronOpen : ""}`}
                                >
                                    ›
                                </span>
                                <span
                                    className={s.folderDot}
                                    style={{ background: folder.color }}
                                />
                                {folder.name}
                            </button>

                            {/* Child notes */}
                            {isOpen && (
                                <>
                                    {children.map((note) => (
                                        <button
                                            key={note.id}
                                            className={`${s.noteRow} ${note.id === activeNoteId ? s.noteRowActive : ""}`}
                                            onClick={() => openNote(note.id)}
                                        >
                                            <span className={s.noteRowText}>
                                                {note.title || "Untitled"}
                                            </span>
                                        </button>
                                    ))}
                                    {/* + note inside folder */}
                                    <button
                                        className={s.noteRow}
                                        onClick={() => handleNewNote(folder.id)}
                                        style={{ opacity: 0.5 }}
                                    >
                                        <span className={s.noteRowText}>
                                            + New note
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}

                {/* ── ADDING FOLDER INLINE ── */}
                {addingFolder && (
                    <input
                        autoFocus
                        className={s.modalInput}
                        style={{
                            margin: "8px 4px 4px",
                            width: "calc(100% - 8px)",
                            fontSize: "0.80rem",
                        }}
                        placeholder="Folder name…"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreateFolder();
                            if (e.key === "Escape") {
                                setAddingFolder(false);
                                setNewFolderName("");
                            }
                        }}
                        onBlur={handleCreateFolder}
                    />
                )}

                {/* ── LOOSE NOTES ── */}
                {looseNotes.length > 0 && (
                    <>
                        <p className={s.treeLooseLabel}>Quick Notes</p>
                        {looseNotes.map((note) => (
                            <button
                                key={note.id}
                                className={`${s.noteRow} ${note.id === activeNoteId ? s.noteRowActive : ""}`}
                                style={{ paddingLeft: 12 }}
                                onClick={() => openNote(note.id)}
                            >
                                <span className={s.noteRowText}>
                                    {note.title || "Untitled"}
                                </span>
                            </button>
                        ))}
                    </>
                )}
            </div>
        </aside>
    );
}
