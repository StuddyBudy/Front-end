"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { TodoState, TodoList } from "../types";
import {
    makeList,
    duplicateList,
    LIST_COLORS,
    LIST_EMOJIS,
    pendingCount,
    totalCount,
} from "../storage";
import s from "../ToDo.module.css";

// ── TYPES ─────────────────────────────────────────────────────────────────────
type Props = {
    state: TodoState;
    setState: (next: TodoState) => void;
    visibleListIds: Set<string>;
    onToggleList: (id: string) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
// Sidebar of todo lists: visibility checkboxes (which lists show in the main
// view), inline rename, per-list color/emoji popovers, a right-click context
// menu, and the new-list form. List CRUD flows through setState (todoStore.set);
// visibility is owned by the parent via visibleListIds + the onToggle callbacks.
export default function ListSidebar({
    state,
    setState,
    visibleListIds,
    onToggleList,
    onSelectAll,
    onDeselectAll,
}: Props) {
    // ── New list form state
    const [addingList, setAddingList] = useState(false);
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState(LIST_COLORS[0]);
    const [newEmoji, setNewEmoji] = useState(LIST_EMOJIS[0]);

    // ── Editing / popover state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [colorPickerId, setColorPickerId] = useState<string | null>(null);
    const [emojiPickerId, setEmojiPickerId] = useState<string | null>(null);
    const [ctxMenuId, setCtxMenuId] = useState<string | null>(null);

    // ── Refs
    const addInputRef = useRef<HTMLInputElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);
    const colorPopRef = useRef<HTMLDivElement>(null);
    const emojiPopRef = useRef<HTMLDivElement>(null);
    const ctxMenuRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLElement>(null);

    // Focus new-list input when form opens
    useEffect(() => {
        if (addingList) addInputRef.current?.focus();
    }, [addingList]);

    // Focus rename input when editing starts
    useEffect(() => {
        if (editingId) editInputRef.current?.focus();
    }, [editingId]);

    // Close any open popover when the user clicks OUTSIDE it — refs check
    // containment so clicks inside a popover don't dismiss it.
    const handleOutsideClick = useCallback((e: MouseEvent) => {
        const target = e.target as Node;
        if (colorPopRef.current && !colorPopRef.current.contains(target)) {
            setColorPickerId(null);
        }
        if (emojiPopRef.current && !emojiPopRef.current.contains(target)) {
            setEmojiPickerId(null);
        }
        if (ctxMenuRef.current && !ctxMenuRef.current.contains(target)) {
            setCtxMenuId(null);
        }
    }, []);

    useEffect(() => {
        const anyOpen = colorPickerId || emojiPickerId || ctxMenuId;
        if (!anyOpen) return;
        // Use "mousedown" so the check fires before onClick handlers
        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, [colorPickerId, emojiPickerId, ctxMenuId, handleOutsideClick]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleCreateList = () => {
        const name = newName.trim();
        if (!name) {
            setAddingList(false);
            return;
        }

        const list = makeList(name, newColor, newEmoji, state.lists.length);
        const next = { ...state, lists: [...state.lists, list] };

        // Persist + update through the store (setState is todoStore.set).
        // New lists are visible by default (visibility tracks HIDDEN ids),
        // so the old auto-check toggle is unnecessary — and would now hide it.
        setState(next);

        // Reset form
        setAddingList(false);
        setNewName("");
        setNewColor(LIST_COLORS[next.lists.length % LIST_COLORS.length]);
        setNewEmoji(LIST_EMOJIS[0]);
    };

    const handleRenameCommit = (id: string) => {
        const name = editingName.trim();
        setEditingId(null);
        if (!name) return;
        const next = {
            ...state,
            lists: state.lists.map((l) => (l.id === id ? { ...l, name } : l)),
        };
        setState(next);
    };

    const handleColorChange = (id: string, color: string) => {
        const next = {
            ...state,
            lists: state.lists.map((l) => (l.id === id ? { ...l, color } : l)),
        };
        setState(next);
        setColorPickerId(null);
    };

    const handleEmojiChange = (id: string, emoji: string) => {
        const next = {
            ...state,
            lists: state.lists.map((l) => (l.id === id ? { ...l, emoji } : l)),
        };
        setState(next);
        setEmojiPickerId(null);
    };

    const handleDeleteList = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next: TodoState = {
            ...state,
            lists: state.lists.filter((l) => l.id !== id),
            items: state.items.filter((i) => i.listId !== id),
        };
        setState(next);
        setCtxMenuId(null);
    };

    const handleDuplicateList = (id: string) => {
        const next = duplicateList(state, id);
        setState(next);
        setCtxMenuId(null);
    };

    const allVisible =
        state.lists.length > 0 &&
        state.lists.every((l) => visibleListIds.has(l.id));
    const sorted = [...state.lists].sort((a, b) => a.order - b.order);

    return (
        <aside className={s.listSidebar} ref={sidebarRef}>
            {/* Header */}
            <div className={s.sidebarHeader}>
                <span className={s.sidebarTitle}>Lists</span>
                <button
                    className={s.selectAllBtn}
                    onClick={allVisible ? onDeselectAll : onSelectAll}
                >
                    {allVisible ? "Deselect all" : "Select all"}
                </button>
            </div>

            {/* List items */}
            <div className={s.sidebarScroll}>
                {sorted.map((list: TodoList) => {
                    const isVisible = visibleListIds.has(list.id);
                    const isEditing = editingId === list.id;
                    const pending = pendingCount(state, list.id);
                    const total = totalCount(state, list.id);

                    return (
                        <div key={list.id} style={{ position: "relative" }}>
                            <div
                                className={`${s.listItem} ${isVisible ? s.listItemVisible : ""}`}
                                onClick={() => {
                                    if (isEditing) return;
                                    if (
                                        colorPickerId === list.id ||
                                        emojiPickerId === list.id
                                    )
                                        return;
                                    onToggleList(list.id);
                                }}
                                onDoubleClick={() => {
                                    setEditingId(list.id);
                                    setEditingName(list.name);
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    setCtxMenuId((prev) =>
                                        prev === list.id ? null : list.id,
                                    );
                                }}
                            >
                                {/* Drag handle — decorative only: reordering
                                    is not implemented (lists[].order is set on
                                    create/duplicate and never user-mutated) */}
                                <span
                                    className={s.dragHandle}
                                    title="Drag to reorder"
                                >
                                    ⠿
                                </span>

                                {/* Checkbox */}
                                <div
                                    className={s.listCheckbox}
                                    style={{
                                        borderColor: list.color,
                                        background: isVisible
                                            ? list.color
                                            : "transparent",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleList(list.id);
                                    }}
                                >
                                    {isVisible && "✓"}
                                </div>

                                {/* Emoji — click to open emoji picker */}
                                <span
                                    className={s.listEmoji}
                                    title="Change emoji"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEmojiPickerId((prev) =>
                                            prev === list.id ? null : list.id,
                                        );
                                        setColorPickerId(null);
                                    }}
                                >
                                    {list.emoji}
                                </span>

                                {/* Colour dot — click to open colour picker */}
                                <div
                                    className={s.listColorDot}
                                    style={{ background: list.color }}
                                    title="Change colour"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setColorPickerId((prev) =>
                                            prev === list.id ? null : list.id,
                                        );
                                        setEmojiPickerId(null);
                                    }}
                                />

                                {/* Name — double-click to rename */}
                                {isEditing ? (
                                    <input
                                        ref={editInputRef}
                                        className={s.listItemNameEditing}
                                        value={editingName}
                                        onChange={(e) =>
                                            setEditingName(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                                handleRenameCommit(list.id);
                                            if (e.key === "Escape")
                                                setEditingId(null);
                                        }}
                                        onBlur={() =>
                                            handleRenameCommit(list.id)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <span
                                        className={s.listItemName}
                                        title="Double-click to rename · Right-click for options"
                                    >
                                        {list.name}
                                    </span>
                                )}

                                {/* Pending count */}
                                <span className={s.listItemCount}>
                                    {pending > 0
                                        ? pending
                                        : total > 0
                                          ? total
                                          : ""}
                                </span>

                                {/* Quick delete */}
                                <button
                                    className={s.listDeleteBtn}
                                    onClick={(e) =>
                                        handleDeleteList(list.id, e)
                                    }
                                    title="Delete list"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Colour picker popover */}
                            {colorPickerId === list.id && (
                                <div
                                    ref={colorPopRef}
                                    className={s.colorPopover}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {LIST_COLORS.map((c) => (
                                        <div
                                            key={c}
                                            className={`${s.colorOption} ${list.color === c ? s.colorOptionActive : ""}`}
                                            style={{ background: c }}
                                            onClick={() =>
                                                handleColorChange(list.id, c)
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Emoji picker popover */}
                            {emojiPickerId === list.id && (
                                <div
                                    ref={emojiPopRef}
                                    className={s.emojiPopover}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {LIST_EMOJIS.map((em) => (
                                        <div
                                            key={em}
                                            className={`${s.emojiOption} ${list.emoji === em ? s.emojiOptionActive : ""}`}
                                            onClick={() =>
                                                handleEmojiChange(list.id, em)
                                            }
                                        >
                                            {em}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Right-click context menu */}
                            {ctxMenuId === list.id && (
                                <div
                                    ref={ctxMenuRef}
                                    className={s.ctxMenu}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className={s.ctxItem}
                                        onClick={() => {
                                            setEditingId(list.id);
                                            setEditingName(list.name);
                                            setCtxMenuId(null);
                                        }}
                                    >
                                        ✏️ Rename
                                    </button>
                                    <button
                                        className={s.ctxItem}
                                        onClick={() => {
                                            setColorPickerId(list.id);
                                            setCtxMenuId(null);
                                        }}
                                    >
                                        🎨 Change colour
                                    </button>
                                    <button
                                        className={s.ctxItem}
                                        onClick={() => {
                                            setEmojiPickerId(list.id);
                                            setCtxMenuId(null);
                                        }}
                                    >
                                        😀 Change emoji
                                    </button>
                                    <button
                                        className={s.ctxItem}
                                        onClick={() =>
                                            handleDuplicateList(list.id)
                                        }
                                    >
                                        📋 Duplicate list
                                    </button>
                                    <div className={s.ctxDivider} />
                                    <button
                                        className={`${s.ctxItem} ${s.ctxItemDanger}`}
                                        onClick={(e) =>
                                            handleDeleteList(list.id, e)
                                        }
                                    >
                                        🗑️ Delete list
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── NEW LIST FORM ─────────────────────────────────────────────────── */}
            {addingList ? (
                <div className={s.newListForm}>
                    {/* Name input */}
                    <input
                        ref={addInputRef}
                        className={s.newListInput}
                        placeholder="List name…"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreateList();
                            if (e.key === "Escape") {
                                setAddingList(false);
                                setNewName("");
                            }
                        }}
                    />

                    {/* Colour picker */}
                    <span className={s.newListFormLabel}>Colour</span>
                    <div className={s.newListColorRow}>
                        {LIST_COLORS.map((c) => (
                            <div
                                key={c}
                                className={`${s.colorOption} ${newColor === c ? s.colorOptionActive : ""}`}
                                style={{ background: c }}
                                onClick={() => setNewColor(c)}
                            />
                        ))}
                    </div>

                    {/* Emoji picker */}
                    <span className={s.newListFormLabel}>Icon</span>
                    <div className={s.newListEmojiRow}>
                        {LIST_EMOJIS.map((em) => (
                            <div
                                key={em}
                                className={`${s.newListEmoji} ${newEmoji === em ? s.newListEmojiActive : ""}`}
                                onClick={() => setNewEmoji(em)}
                            >
                                {em}
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className={s.newListFormRow}>
                        <button
                            className={s.newListCancel}
                            onClick={() => {
                                setAddingList(false);
                                setNewName("");
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className={s.newListConfirm}
                            onClick={handleCreateList}
                        >
                            Create
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className={s.newListBtn}
                    onClick={() => {
                        setNewColor(
                            LIST_COLORS[
                                state.lists.length % LIST_COLORS.length
                            ],
                        );
                        setNewEmoji(
                            LIST_EMOJIS[
                                state.lists.length % LIST_EMOJIS.length
                            ],
                        );
                        setAddingList(true);
                    }}
                >
                    + New List
                </button>
            )}
        </aside>
    );
}
