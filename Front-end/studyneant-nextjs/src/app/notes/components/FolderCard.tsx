"use client";

import type { Folder, Note } from "../types";
import s from "../Notes.module.css";

type Props = {
    folder: Folder;
    notes: Note[];
    isExpanded: boolean; // new — driven by parent
    onClick: () => void;
};

export default function FolderCard({
    folder,
    notes,
    isExpanded,
    onClick,
}: Props) {
    const count = notes.filter((n) => n.folderId === folder.id).length;

    return (
        <button
            className={`${s.folderCard} ${isExpanded ? s.folderCardExpanded : ""}`}
            onClick={onClick}
        >
            {/* Coloured tab */}
            <div className={s.folderTab} />
            <div className={s.folderBody}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span className={s.folderIcon}>📁</span>
                    <span
                        style={{
                            fontSize: "0.65rem",
                            color: "var(--dash-text-muted)",
                            transition: "transform 0.2s",
                            transform: isExpanded
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                            display: "inline-block",
                        }}
                    >
                        ›
                    </span>
                </div>
                <div className={s.folderName}>{folder.name}</div>
                <div className={s.folderMeta}>
                    {count} note{count !== 1 ? "s" : ""}
                    {isExpanded ? " — click to collapse" : " — click to expand"}
                </div>
            </div>
        </button>
    );
}
