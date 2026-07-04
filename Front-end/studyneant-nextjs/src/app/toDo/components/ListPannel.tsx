"use client";

import { useState, useRef, useEffect } from "react";
import type { TodoState, TodoList } from "../types";
import {
    makeList,
    saveTodo,
    LIST_COLORS,
    LIST_EMOJIS,
    pendingCount,
} from "../storage";
import s from "../ToDo.module.css";

type Props = {
    state: TodoState;
    setState: (next: TodoState) => void;
    selectedListId: string | null;
    onSelectList: (id: string) => void;
};

export default function ListPanel({
    state,
    setState,
    selectedListId,
    onSelectList,
}: Props) {
    const [addingList, setAddingList] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [newListColor, setNewListColor] = useState(LIST_COLORS[0]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus the input whenever it appears
    useEffect(() => {
        if (addingList) inputRef.current?.focus();
    }, [addingList]);

    const handleCreateList = () => {
        const name = newListName.trim();
        if (!name) {
            setAddingList(false);
            return;
        }

        const idx = state.lists.length;
        const list = makeList(
            name,
            newListColor,
            LIST_EMOJIS[idx % LIST_EMOJIS.length],
            idx,
        );
        const next = { ...state, lists: [...state.lists, list] };
        setState(next);
        saveTodo(next);

        // Auto-select the new list
        onSelectList(list.id);
        setAddingList(false);
        setNewListName("");
        setNewListColor(LIST_COLORS[state.lists.length % LIST_COLORS.length]);
    };

    const handleDeleteList = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next: TodoState = {
            sortMode: state.sortMode,
            lists: state.lists.filter((l) => l.id !== id),
            // Also remove all tasks belonging to this list
            items: state.items.filter((i) => i.listId !== id),
        };
        setState(next);
        saveTodo(next);

        // If the deleted list was selected, select the first remaining list
        if (selectedListId === id) {
            const remaining = next.lists;
            onSelectList(remaining.length > 0 ? remaining[0].id : "");
        }
    };

    return (
        <div className={s.listPanel}>
            <div className={s.listPanelHeader}>
                <span className={s.listPanelTitle}>Lists</span>
            </div>

            <div className={s.listScroll}>
                {state.lists.map((list: TodoList) => {
                    const pending = pendingCount(state, list.id);
                    const isActive = selectedListId === list.id;
                    return (
                        <button
                            key={list.id}
                            className={`${s.listRow} ${isActive ? s.listRowActive : ""}`}
                            onClick={() => onSelectList(list.id)}
                        >
                            <div
                                className={s.listColorDot}
                                style={{ background: list.color }}
                            />
                            <span className={s.listRowName}>{list.name}</span>
                            {pending > 0 && (
                                <span className={s.listRowCount}>
                                    {pending}
                                </span>
                            )}
                            <button
                                className={s.listDeleteBtn}
                                onClick={(e) => handleDeleteList(list.id, e)}
                                title="Delete list"
                            >
                                ✕
                            </button>
                        </button>
                    );
                })}
            </div>

            {/* New list UI */}
            {addingList ? (
                <div className={s.newListInputRow}>
                    <input
                        ref={inputRef}
                        className={s.newListInput}
                        placeholder="List name…"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreateList();
                            if (e.key === "Escape") {
                                setAddingList(false);
                                setNewListName("");
                            }
                        }}
                    />
                    <button
                        className={s.newListConfirm}
                        onClick={handleCreateList}
                    >
                        Add
                    </button>
                </div>
            ) : (
                <button
                    className={s.newListBtn}
                    onClick={() => {
                        setNewListColor(
                            LIST_COLORS[
                                state.lists.length % LIST_COLORS.length
                            ],
                        );
                        setAddingList(true);
                    }}
                >
                    + New List
                </button>
            )}
        </div>
    );
}
