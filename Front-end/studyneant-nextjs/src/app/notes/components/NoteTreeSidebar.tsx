"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import c from "@/components/sidebar/Sidebar.module.css";
import type { NotesState } from "../types";
import { makeNote, makeFolder, saveNotes, FOLDER_COLORS } from "../storage";
import p from "../Notes.module.css";

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
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const openNote = (noteId: string) =>
        router.push(`/notes/editor?id=${noteId}`);

    const handleNewNote = (folderId: string | null = null) => {
        const note = makeNote(folderId, "Untitled");
        const next = { ...state, notes: [...state.notes, note] };
        setState(next);
        saveNotes(next);
        router.push(`/notes/editor?id=${note.id}`);
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
        <aside className={c.sidePanel + " " + p.treeSidebar}>
            {/* Action buttons */}
            <div className={c.sideActionsRow + " " + p.treeActions}>
                <button
                    className={c.sideIconBtn + " " + p.iconBtn}
                    onClick={() => setAddingFolder(true)}
                    title="New folder"
                >
                    📁
                </button>
                <button
                    className={c.sideIconBtn + " " + p.iconBtn}
                    onClick={() => handleNewNote(null)}
                    title="New quick note"
                >
                    +
                </button>
            </div>

            <div className={c.sidePanelScroll + " " + p.treeScroll}>
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
                                className={`${p.folderRow} ${isOpen ? p.folderRowOpen : ""}`}
                                onClick={() => toggleFolder(folder.id)}
                            >
                                <span
                                    className={`${p.folderChevron} ${isOpen ? p.folderChevronOpen : ""}`}
                                >
                                    ›
                                </span>
                                <span
                                    className={p.folderDot}
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
                                            className={`${p.noteRow} ${note.id === activeNoteId ? p.noteRowActive : ""}`}
                                            onClick={() => openNote(note.id)}
                                        >
                                            <span className={p.noteRowText}>
                                                {note.title || "Untitled"}
                                            </span>
                                        </button>
                                    ))}
                                    {/* + note inside folder */}
                                    <button
                                        className={
                                            p.noteRow + " " + p.noteRowMuted
                                        }
                                        onClick={() => handleNewNote(folder.id)}
                                    >
                                        <span className={p.noteRowText}>
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
                        className={p.modalInput + " " + p.treeInlineInput}
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
                        <p
                            className={
                                c.sidePanelLabel + " " + p.treeLooseLabel
                            }
                        >
                            Quick Notes
                        </p>
                        {looseNotes.map((note) => (
                            <button
                                key={note.id}
                                className={`${p.noteRow} ${p.noteRowLoose} ${note.id === activeNoteId ? p.noteRowActive : ""}`}
                                onClick={() => openNote(note.id)}
                            >
                                <span className={p.noteRowText}>
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
