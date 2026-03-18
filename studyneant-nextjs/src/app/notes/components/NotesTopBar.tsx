"use client";

// FIX: useRouter was missing from the import — back button couldn't navigate
import { useRouter } from "next/navigation";
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
    // FIX: router must be called inside the component — was missing entirely
    const router = useRouter();

    return (
        <header className={s.topBar}>
            {/* Left */}
            <div className={s.topBarLeft}>
                {mode === "editor" ? (
                    // FIX: router.push("/notes") is explicit and reliable.
                    // router.back() is NOT used because the user might have come
                    // from a different page (e.g. the dashboard), making back() unpredictable.
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

            {/* Centre — note title in editor mode */}
            <div className={s.topBarCenter}>
                {mode === "editor" && noteTitle && (
                    <span className={s.noteTitle}>{noteTitle}</span>
                )}
            </div>

            {/* Right */}
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
    );
}
