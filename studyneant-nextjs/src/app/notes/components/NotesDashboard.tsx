"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NotesState, Folder } from "../types";
import { makeFolder, makeNote, saveNotes, FOLDER_COLORS } from "../storage";
import FolderCard from "./FolderCard";
import NoteCard from "./NoteCard";
import s from "../Notes.module.css";

type Props = {
    state: NotesState;
    setState: (next: NotesState) => void;
    // BUG FIX: folder modal state is now lifted up to notes/page.tsx so the
    // top-bar "📁" button can also open it. Dashboard receives both the flag
    // and a close callback.
    folderModalOpen: boolean;
    onFolderModalClose: () => void;
};

export default function NotesDashboard({
    state,
    setState,
    folderModalOpen,
    onFolderModalClose,
}: Props) {
    const router = useRouter();

    // New-folder form values
    const [folderName, setFolderName] = useState("");
    const [folderColor, setFolderColor] = useState(FOLDER_COLORS[0]);

    // Local trigger so the "New folder" card inside the grid also opens the modal
    const [localModalOpen, setLocalModalOpen] = useState(false);

    // BUG FIX: track which folders are expanded on the dashboard.
    // Previously, clicking a folder ALWAYS created a new note — wrong.
    // Now clicking a folder expands / collapses it to reveal notes inside.
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
        new Set(),
    );

    const toggleFolder = (id: string) =>
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    // ── Handlers ─────────────────────────────────────────────────────────────
    const openFolderModal = () => {
        setFolderName("");
        setFolderColor(FOLDER_COLORS[0]);
        setLocalModalOpen(true);
    };

    const closeModal = () => {
        onFolderModalClose(); // tells page.tsx to reset its flag
        setLocalModalOpen(false);
    };

    const handleCreateFolder = () => {
        const name = folderName.trim();
        if (!name) {
            closeModal();
            return;
        }
        const folder = makeFolder(name, folderColor);
        const next = { ...state, folders: [...state.folders, folder] };
        setState(next);
        saveNotes(next);
        setExpandedFolders((prev) => new Set([...prev, folder.id]));
        closeModal();
    };

    const handleNewNote = (folderId: string | null = null) => {
        const note = makeNote(folderId, "Untitled");
        const next = { ...state, notes: [...state.notes, note] };
        setState(next);
        saveNotes(next);
        router.push(`/notes/editor?id=${note.id}`);
    };

    const looseNotes = state.notes.filter((n) => n.folderId === null);
    const showModal = folderModalOpen || localModalOpen;

    return (
        <>
            <main className={s.dashMain}>
                {/* ── FOLDERS ── */}
                <p className={s.sectionLabel}>Folders</p>
                <div className={s.cardGrid}>
                    {state.folders.map((folder: Folder) => {
                        const isExpanded = expandedFolders.has(folder.id);
                        const folderNotes = state.notes.filter(
                            (n) => n.folderId === folder.id,
                        );
                        return (
                            // display:contents lets the children sit in the parent grid
                            <div
                                key={folder.id}
                                style={{ display: "contents" }}
                            >
                                {/* BUG FIX: click toggles expand, does NOT create a note */}
                                <FolderCard
                                    folder={folder}
                                    notes={state.notes}
                                    isExpanded={isExpanded}
                                    onClick={() => toggleFolder(folder.id)}
                                />

                                {/* Notes inside this folder — visible when expanded */}
                                {isExpanded &&
                                    folderNotes.map((note) => (
                                        <NoteCard
                                            key={note.id}
                                            note={note}
                                            folders={state.folders}
                                        />
                                    ))}

                                {/* Add-note card — visible when expanded */}
                                {isExpanded && (
                                    <button
                                        className={s.addCard}
                                        onClick={() => handleNewNote(folder.id)}
                                    >
                                        <span className={s.addCardPlus}>+</span>
                                        <span>New note in {folder.name}</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    {/* New folder card */}
                    <button className={s.addCard} onClick={openFolderModal}>
                        <span className={s.addCardPlus}>📁</span>
                        <span>New folder</span>
                    </button>
                </div>

                {/* ── QUICK NOTES (no folder) ── */}
                {looseNotes.length > 0 && (
                    <>
                        <p className={s.sectionLabel}>Quick Notes</p>
                        <div className={s.cardGrid}>
                            {looseNotes.map((n) => (
                                <NoteCard
                                    key={n.id}
                                    note={n}
                                    folders={state.folders}
                                />
                            ))}
                            <button
                                className={s.addCard}
                                onClick={() => handleNewNote(null)}
                            >
                                <span className={s.addCardPlus}>+</span>
                                <span>New quick note</span>
                            </button>
                        </div>
                    </>
                )}

                {/* ── EMPTY STATE ── */}
                {state.notes.length === 0 && state.folders.length === 0 && (
                    <div className={s.emptyState}>
                        <span className={s.emptyEmoji}>📝</span>
                        <p className={s.emptyText}>
                            No notes yet — create a folder or a quick note to
                            get started.
                        </p>
                    </div>
                )}
            </main>

            {/* ── NEW FOLDER MODAL ──────────────────────────────────────────────
                Opened by EITHER:
                  • Top-bar 📁 button  → folderModalOpen (lifted state in page.tsx)
                  • "New folder" card  → localModalOpen (local state above)
            ─────────────────────────────────────────────────────────────────── */}
            {showModal && (
                <div
                    className={s.modalOverlay}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className={s.modal}>
                        <h3 className={s.modalTitle}>New Folder</h3>

                        <input
                            autoFocus
                            className={s.modalInput}
                            placeholder="Folder name…"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCreateFolder();
                                if (e.key === "Escape") closeModal();
                            }}
                        />

                        <div className={s.colorRow}>
                            {FOLDER_COLORS.map((c) => (
                                <div
                                    key={c}
                                    className={`${s.colorSwatch} ${folderColor === c ? s.colorSwatchActive : ""}`}
                                    style={{ background: c }}
                                    onClick={() => setFolderColor(c)}
                                />
                            ))}
                        </div>

                        <div className={s.modalBtns}>
                            <button
                                className={s.modalBtnGhost}
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className={s.modalBtnPrimary}
                                onClick={handleCreateFolder}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
