"use client";

import { useState, useRef, useEffect } from "react";
import type { TodoState, TodoList } from "../types";
import { makeItem, saveTodo, itemsForList } from "../storage";
import s from "../ToDo.module.css";

type Props = {
    state: TodoState;
    setState: (next: TodoState) => void;
    activeList: TodoList | null;
};

export default function TaskPanel({ state, setState, activeList }: Props) {
    const [inputVal, setInputVal] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Clear input when switching lists
    useEffect(() => {
        setInputVal("");
    }, [activeList?.id]);

    if (!activeList) {
        return (
            <div className={`${s.taskPanel} ${s.noListState}`}>
                <span className={s.noListEmoji}>📋</span>
                <p className={s.noListText}>
                    Select a list or create a new one to get started.
                </p>
            </div>
        );
    }

    const tasks = itemsForList(state, activeList.id);
    const done = tasks.filter((t) => t.done).length;
    const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

    // ── Handlers ───────────────────────────────────────────────────────────────
    const handleAddTask = () => {
        const text = inputVal.trim();
        if (!text) return;
        const item = makeItem(activeList.id, text);
        const next = { ...state, items: [...state.items, item] };
        setState(next);
        saveTodo(next);
        setInputVal("");
        inputRef.current?.focus();
    };

    const handleToggleDone = (id: string) => {
        const next = {
            ...state,
            items: state.items.map((i) =>
                i.id === id ? { ...i, done: !i.done } : i,
            ),
        };
        setState(next);
        saveTodo(next);
    };

    const handleDeleteTask = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = {
            ...state,
            items: state.items.filter((i) => i.id !== id),
        };
        setState(next);
        saveTodo(next);
    };

    const handleClearAll = () => {
        // Only remove tasks belonging to the current list
        const next = {
            ...state,
            items: state.items.filter((i) => i.listId !== activeList.id),
        };
        setState(next);
        saveTodo(next);
    };

    return (
        <div className={s.taskPanel}>
            {/* Header */}
            <div className={s.taskPanelHeader}>
                <span className={s.taskPanelTitle}>{activeList.name}</span>
                {tasks.length > 0 && (
                    <span className={s.taskPanelMeta}>
                        {done}/{tasks.length} done
                    </span>
                )}
            </div>

            {/* Progress bar */}
            {tasks.length > 0 && (
                <div className={s.progressWrap}>
                    <div className={s.progressLabel}>
                        <span>Progress</span>
                        <span>{pct}%</span>
                    </div>
                    <div className={s.progressTrack}>
                        <div
                            className={s.progressFill}
                            style={{
                                width: `${pct}%`,
                                background: activeList.color,
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Add task input */}
            <div className={s.addTaskRow}>
                <input
                    ref={inputRef}
                    className={s.addTaskInput}
                    placeholder="Add a new task…"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                />
                <button className={s.addTaskBtn} onClick={handleAddTask}>
                    Add
                </button>
            </div>

            {/* Task list */}
            <div className={s.taskScroll}>
                {tasks.length === 0 ? (
                    <div className={s.emptyState}>
                        <span className={s.emptyEmoji}>🎉</span>
                        <p className={s.emptyText}>
                            No tasks yet — add one above!
                        </p>
                    </div>
                ) : (
                    tasks.map((task, idx) => (
                        <div
                            key={task.id}
                            className={`${s.taskRow} ${task.done ? s.taskRowDone : ""}`}
                            onClick={() => handleToggleDone(task.id)}
                        >
                            {/* Number */}
                            <span className={s.taskNum}>{idx + 1})</span>

                            {/* Checkbox */}
                            <div
                                className={`${s.taskCheck} ${task.done ? s.taskCheckDone : ""}`}
                                style={
                                    task.done
                                        ? {
                                              background: activeList.color,
                                              borderColor: activeList.color,
                                          }
                                        : {}
                                }
                            >
                                {task.done && "✓"}
                            </div>

                            {/* Text */}
                            <span
                                className={`${s.taskText} ${task.done ? s.taskTextDone : ""}`}
                            >
                                {task.text}
                            </span>

                            {/* Delete */}
                            <button
                                className={s.taskDeleteBtn}
                                onClick={(e) => handleDeleteTask(task.id, e)}
                                title="Remove task"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Clear all — only shown when there are tasks */}
            {tasks.length > 0 && (
                <div className={s.taskFooter}>
                    <button className={s.clearAllBtn} onClick={handleClearAll}>
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}
