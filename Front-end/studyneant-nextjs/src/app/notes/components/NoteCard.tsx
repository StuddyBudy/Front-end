"use client";

import { useRouter } from "next/navigation";
import type { Note, Folder } from "../types";
import { fmtDate, notePreview } from "../storage";
import s from "../Notes.module.css";

type Props = {
    note: Note;
    folders: Folder[];
};

export default function NoteCard({ note, folders }: Props) {
    const router = useRouter();
    const folder = folders.find((f) => f.id === note.folderId);

    // Fake preview line widths for the visual effect
    const lineWidths = ["85%", "70%", "55%"];

    return (
        <button
            className={s.noteCard}
            onClick={() => router.push(`/notes?id=${note.id}`)}
        >
            <div className={s.noteCardTitle}>{note.title || "Untitled"}</div>

            {note.content ? (
                <div className={s.noteCardPreview}>
                    {notePreview(note.content, 100)}
                </div>
            ) : (
                <div className={s.previewLines}>
                    {lineWidths.map((w, i) => (
                        <div
                            key={i}
                            className={s.previewLine}
                            style={{ width: w }}
                        />
                    ))}
                </div>
            )}

            <div className={s.noteCardMeta}>
                <span className={s.noteCardDate}>
                    {fmtDate(note.updatedAt)}
                </span>
                {folder && (
                    <span className={s.noteCardFolder}>{folder.name}</span>
                )}
            </div>
        </button>
    );
}
