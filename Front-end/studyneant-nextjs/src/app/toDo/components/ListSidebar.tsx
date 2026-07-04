"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import c from "@/components/sidebar/Sidebar.module.css";
import type { TodoState, TodoList } from "../types";
import {
    makeList,
    saveTodo,
    duplicateList,
    LIST_COLORS,
    LIST_EMOJIS,
    pendingCount,
    totalCount,
} from "../storage";
import p from "../ToDo.module.css";

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

    // ── FIX (line 38 equivalent): Close any open popover when user clicks
    //    OUTSIDE it. Uses the ref to check containment instead of blindly
    //    closing on any click. Uses MouseEvent typing to satisfy TypeScript.
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

    // FIX (line 52 equivalent): restructured so state updates are synchronous
    // and the auto-toggle call uses the new list's id directly (no stale closure).
    const handleCreateList = () => {
        const name = newName.trim();
        if (!name) {
            setAddingList(false);
            return;
        }

        const list = makeList(name, newColor, newEmoji, state.lists.length);
        const next = { ...state, lists: [...state.lists, list] };

        // 1. Persist first so the new list is in storage before any re-render
        saveTodo(next);
        // 2. Update state
        setState(next);
        // 3. Auto-check the new list — uses list.id directly, no stale closure
        onToggleList(list.id);

        // 4. Reset form
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
        saveTodo(next);
        setState(next);
    };

    const handleColorChange = (id: string, color: string) => {
        const next = {
            ...state,
            lists: state.lists.map((l) => (l.id === id ? { ...l, color } : l)),
        };
        saveTodo(next);
        setState(next);
        setColorPickerId(null);
    };

    const handleEmojiChange = (id: string, emoji: string) => {
        const next = {
            ...state,
            lists: state.lists.map((l) => (l.id === id ? { ...l, emoji } : l)),
        };
        saveTodo(next);
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
        saveTodo(next);
        setState(next);
        setCtxMenuId(null);
    };

    const handleDuplicateList = (id: string) => {
        const next = duplicateList(state, id);
        saveTodo(next);
        setState(next);
        setCtxMenuId(null);
    };

    const allVisible =
        state.lists.length > 0 &&
        state.lists.every((l) => visibleListIds.has(l.id));
    const sorted = [...state.lists].sort((a, b) => a.order - b.order);

    return (
        <aside className={c.sidePanel + " " + p.listSidebar} ref={sidebarRef}>
            {/* Header */}
            <div className={c.sidePanelHeader + " " + p.sidebarHeader}>
                <span className={c.sidePanelLabel + " " + p.sidebarTitle}>
                    Lists
                </span>
                <button
                    className={c.sidePanelTextBtn + " " + p.selectAllBtn}
                    onClick={allVisible ? onDeselectAll : onSelectAll}
                >
                    {allVisible ? "Deselect all" : "Select all"}
                </button>
            </div>

            {/* List items */}
            <div className={c.sidePanelScroll + " " + p.sidebarScroll}>
                {sorted.map((list: TodoList) => {
                    const isVisible = visibleListIds.has(list.id);
                    const isEditing = editingId === list.id;
                    const pending = pendingCount(state, list.id);
                    const total = totalCount(state, list.id);

                    return (
                        <div key={list.id} className={p.listItemWrap}>
                            <div
                                className={`${p.listItem} ${isVisible ? p.listItemVisible : ""}`}
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
                                    setCtxMenuId((p) =>
                                        p === list.id ? null : list.id,
                                    );
                                }}
                            >
                                {/* Drag handle */}
                                <span
                                    className={p.dragHandle}
                                    title="Drag to reorder"
                                >
                                    ⠿
                                </span>

                                {/* Checkbox */}
                                <div
                                    className={p.listCheckbox}
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
                                    className={p.listEmoji}
                                    title="Change emoji"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEmojiPickerId((p) =>
                                            p === list.id ? null : list.id,
                                        );
                                        setColorPickerId(null);
                                    }}
                                >
                                    {list.emoji}
                                </span>

                                {/* Colour dot — click to open colour picker */}
                                <div
                                    className={p.listColorDot}
                                    style={{ background: list.color }}
                                    title="Change colour"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setColorPickerId((p) =>
                                            p === list.id ? null : list.id,
                                        );
                                        setEmojiPickerId(null);
                                    }}
                                />

                                {/* Name — double-click to rename */}
                                {isEditing ? (
                                    <input
                                        ref={editInputRef}
                                        className={p.listItemNameEditing}
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
                                        className={p.listItemName}
                                        title="Double-click to rename · Right-click for options"
                                    >
                                        {list.name}
                                    </span>
                                )}

                                {/* Pending count */}
                                <span className={p.listItemCount}>
                                    {pending > 0
                                        ? pending
                                        : total > 0
                                          ? total
                                          : ""}
                                </span>

                                {/* Quick delete */}
                                <button
                                    className={p.listDeleteBtn}
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
                                    className={p.colorPopover}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {LIST_COLORS.map((c) => (
                                        <div
                                            key={c}
                                            className={`${p.colorOption} ${list.color === c ? p.colorOptionActive : ""}`}
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
                                    className={p.emojiPopover}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {LIST_EMOJIS.map((em) => (
                                        <div
                                            key={em}
                                            className={`${p.emojiOption} ${list.emoji === em ? p.emojiOptionActive : ""}`}
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
                                    className={p.ctxMenu}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className={p.ctxItem}
                                        onClick={() => {
                                            setEditingId(list.id);
                                            setEditingName(list.name);
                                            setCtxMenuId(null);
                                        }}
                                    >
                                        ✏️ Rename
                                    </button>
                                    <button
                                        className={p.ctxItem}
                                        onClick={() => {
                                            setColorPickerId(list.id);
                                            setCtxMenuId(null);
                                        }}
                                    >
                                        🎨 Change colour
                                    </button>
                                    <button
                                        className={p.ctxItem}
                                        onClick={() => {
                                            setEmojiPickerId(list.id);
                                            setCtxMenuId(null);
                                        }}
                                    >
                                        😀 Change emoji
                                    </button>
                                    <button
                                        className={p.ctxItem}
                                        onClick={() =>
                                            handleDuplicateList(list.id)
                                        }
                                    >
                                        📋 Duplicate list
                                    </button>
                                    <div className={p.ctxDivider} />
                                    <button
                                        className={`${p.ctxItem} ${p.ctxItemDanger}`}
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
                <div className={p.newListForm}>
                    {/* Name input */}
                    <input
                        ref={addInputRef}
                        className={p.newListInput}
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
                    <span className={p.newListFormLabel}>Colour</span>
                    <div className={p.newListColorRow}>
                        {LIST_COLORS.map((c) => (
                            <div
                                key={c}
                                className={`${p.colorOption} ${newColor === c ? p.colorOptionActive : ""}`}
                                style={{ background: c }}
                                onClick={() => setNewColor(c)}
                            />
                        ))}
                    </div>

                    {/* Emoji picker */}
                    <span className={p.newListFormLabel}>Icon</span>
                    <div className={p.newListEmojiRow}>
                        {LIST_EMOJIS.map((em) => (
                            <div
                                key={em}
                                className={`${p.newListEmoji} ${newEmoji === em ? p.newListEmojiActive : ""}`}
                                onClick={() => setNewEmoji(em)}
                            >
                                {em}
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className={p.newListFormRow}>
                        <button
                            className={p.newListCancel}
                            onClick={() => {
                                setAddingList(false);
                                setNewName("");
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className={p.newListConfirm}
                            onClick={handleCreateList}
                        >
                            Create
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className={p.newListBtn}
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
