"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppDrawer, { HamburgerBtn } from "@/components/AppDrawer";
import s from "../Notes.module.css";

type Props = {
    mode: "dashboard" | "editor";
    noteTitle?: string;
    onNewNote?: () => void;
    onNewFolder?: () => void;
};

export default function NotesTopBar({
    mode,
    noteTitle,
    onNewNote,
    onNewFolder,
}: Props) {
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <header className={s.topBar}>
                <div className={s.topBarLeft}>
                    {/* Hamburger → shared app-wide nav drawer */}
                    <HamburgerBtn
                        open={drawerOpen}
                        onClick={() => setDrawerOpen((o) => !o)}
                    />

                    {mode === "editor" ? (
                        <button
                            className={s.backBtn}
                            onClick={() => router.push("/notes")}
                        >
                            ← Back
                        </button>
                    ) : (
                        <span className={s.topBarTitle}>📝 Notes</span>
                    )}
                </div>

                <div className={s.topBarCenter}>
                    {mode === "editor" && noteTitle && (
                        <span className={s.noteTitle}>{noteTitle}</span>
                    )}
                </div>

                <div className={s.topBarRight}>
                    {mode === "dashboard" && (
                        <>
                            {onNewFolder && (
                                <button
                                    className={s.iconBtn}
                                    onClick={onNewFolder}
                                    title="New folder"
                                >
                                    📁
                                </button>
                            )}
                            {onNewNote && (
                                <button
                                    className={s.newNoteBtn}
                                    onClick={onNewNote}
                                >
                                    + New Note
                                </button>
                            )}
                        </>
                    )}
                    <div className={s.profileAvatar}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    </div>
                </div>
            </header>

            {/* Shared navigation drawer */}
            {drawerOpen && <AppDrawer onClose={() => setDrawerOpen(false)} />}
        </>
    );
}
