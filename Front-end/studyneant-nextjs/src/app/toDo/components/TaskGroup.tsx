"use client";

import { useState, useRef, useEffect } from "react";
import type { TodoState, TodoList, TodoItem, SubTask } from "../types";
import {
    makeItem,
    makeSubTask,
    itemsForList,
    PRIORITY_CONFIG,
    isOverdue,
} from "../storage";
import s from "../ToDo.module.css";

type Props = {
    list: TodoList;
    state: TodoState;
    setState: (next: TodoState) => void;
};

// ── TASK GROUP ────────────────────────────────────────────────────────────────
// One collapsible list section: header (color bar, progress %), active tasks,
// inline add/edit rows, per-task detail panel (priority/due/move/note/subtasks),
// and a collapsible "Completed" section. All mutations flow through setState on
// the whole TodoState — this component owns only UI state (open/editing/etc.).
export default function TaskGroup({ list, state, setState }: Props) {
    const [isOpen, setIsOpen] = useState(true);
    const [completedOpen, setCompletedOpen] = useState(false);
    const [addingTask, setAddingTask] = useState(false);
    const [addText, setAddText] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");
    const [addingSubTaskId, setAddingSubTaskId] = useState<string | null>(null);
    const [subTaskInput, setSubTaskInput] = useState("");

    const addRef = useRef<HTMLInputElement>(null);
    const editRef = useRef<HTMLInputElement>(null);
    const subAddRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (addingTask) addRef.current?.focus();
    }, [addingTask]);
    useEffect(() => {
        if (editingId) editRef.current?.focus();
    }, [editingId]);
    useEffect(() => {
        if (addingSubTaskId) subAddRef.current?.focus();
    }, [addingSubTaskId]);

    const allTasks = itemsForList(state, list.id);
    const active = allTasks.filter((t) => !t.done);
    const completed = allTasks.filter((t) => t.done);
    const completedPct =
        allTasks.length > 0
            ? Math.round((completed.length / allTasks.length) * 100)
            : 0;

    // ── Generic item updater ─────────────────────────────────────────────────
    const updateItem = (id: string, partial: Partial<TodoItem>) => {
        const next = {
            ...state,
            items: state.items.map((i) =>
                i.id === id ? { ...i, ...partial } : i,
            ),
        };
        setState(next);
    };

    // ── Task handlers ────────────────────────────────────────────────────────
    const handleAddTask = () => {
        const text = addText.trim();
        if (!text) {
            setAddingTask(false);
            return;
        }
        const item = makeItem(list.id, text);
        const next = { ...state, items: [...state.items, item] };
        setState(next);
        setAddText("");
        addRef.current?.focus();
    };

    const handleToggleDone = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const item = state.items.find((i) => i.id === id);
        if (!item) return;
        updateItem(id, { done: !item.done });
        // Collapse detail row when marking done
        if (!item.done && expandedId === id) setExpandedId(null);
    };

    const handleDeleteTask = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = {
            ...state,
            items: state.items.filter((i) => i.id !== id),
        };
        setState(next);
        if (expandedId === id) setExpandedId(null);
    };

    const handleRenameCommit = (id: string) => {
        const text = editingText.trim();
        setEditingId(null);
        if (!text) return;
        updateItem(id, { text });
    };

    const handleMoveToList = (id: string, newListId: string) => {
        if (newListId === list.id) return;
        updateItem(id, { listId: newListId });
    };

    const handleClearCompleted = () => {
        const next = {
            ...state,
            items: state.items.filter((i) => !(i.listId === list.id && i.done)),
        };
        setState(next);
    };

    // ── Subtask handlers ──────────────────────────────────────────────────────
    const handleAddSubTask = (taskId: string) => {
        const text = subTaskInput.trim();
        if (!text) {
            setAddingSubTaskId(null);
            return;
        }
        const task = state.items.find((i) => i.id === taskId);
        if (!task) return;
        const sub: SubTask = makeSubTask(text);
        updateItem(taskId, { subTasks: [...task.subTasks, sub] });
        setSubTaskInput("");
        subAddRef.current?.focus();
    };

    const handleToggleSubTask = (taskId: string, subId: string) => {
        const task = state.items.find((i) => i.id === taskId);
        if (!task) return;
        updateItem(taskId, {
            subTasks: task.subTasks.map((sub) =>
                sub.id === subId ? { ...sub, done: !sub.done } : sub,
            ),
        });
    };

    const handleDeleteSubTask = (
        taskId: string,
        subId: string,
        e: React.MouseEvent,
    ) => {
        e.stopPropagation();
        const task = state.items.find((i) => i.id === taskId);
        if (!task) return;
        updateItem(taskId, {
            subTasks: task.subTasks.filter((sub) => sub.id !== subId),
        });
    };

    // ── Shared task renderer ──────────────────────────────────────────────────
    const renderTask = (task: TodoItem, idx: number) => {
        const isExpanded = expandedId === task.id;
        const isEditing = editingId === task.id;
        const priorityCfg = PRIORITY_CONFIG[task.priority];
        const overdue = isOverdue(task.dueDate);
        const subDone = task.subTasks.filter((sub) => sub.done).length;
        const subTotal = task.subTasks.length;

        return (
            <div key={task.id}>
                {/* ── Main task row ── */}
                <div
                    className={[
                        s.taskRow,
                        task.done ? s.taskRowDone : "",
                        task.pinned ? s.taskRowPinned : "",
                    ].join(" ")}
                    onClick={() => {
                        if (!isEditing)
                            setExpandedId((prev) =>
                                prev === task.id ? null : task.id,
                            );
                    }}
                >
                    <span className={s.taskNum}>{idx + 1})</span>

                    {/* Checkbox */}
                    <div
                        className={`${s.taskCheck} ${task.done ? s.taskCheckDone : ""}`}
                        style={
                            task.done
                                ? {
                                      background: list.color,
                                      borderColor: list.color,
                                  }
                                : {}
                        }
                        onClick={(e) => handleToggleDone(task.id, e)}
                    >
                        {task.done && "✓"}
                    </div>

                    {/* Pin button */}
                    <button
                        className={`${s.pinBtn} ${task.pinned ? s.pinBtnActive : ""}`}
                        title={task.pinned ? "Unpin" : "Pin to top"}
                        onClick={(e) => {
                            e.stopPropagation();
                            updateItem(task.id, { pinned: !task.pinned });
                        }}
                    >
                        {task.pinned ? "📌" : "📍"}
                    </button>

                    {/* Priority flag */}
                    {task.priority !== "none" && (
                        <span
                            className={s.priorityFlag}
                            style={{ color: priorityCfg.color }}
                            title={priorityCfg.label}
                        >
                            {priorityCfg.flag}
                        </span>
                    )}

                    {/* Text / inline edit */}
                    {isEditing ? (
                        <input
                            ref={editRef}
                            className={s.taskEditInput}
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter")
                                    handleRenameCommit(task.id);
                                if (e.key === "Escape") setEditingId(null);
                            }}
                            onBlur={() => handleRenameCommit(task.id)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span
                            className={`${s.taskText} ${task.done ? s.taskTextDone : ""}`}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                setEditingId(task.id);
                                setEditingText(task.text);
                            }}
                            title="Double-click to edit"
                        >
                            {task.text}
                            {subTotal > 0 && (
                                <span
                                    style={{
                                        marginLeft: 6,
                                        fontSize: "0.65rem",
                                        color: "var(--dash-text-muted)",
                                        opacity: 0.7,
                                    }}
                                >
                                    [{subDone}/{subTotal}]
                                </span>
                            )}
                            {task.note && (
                                <span
                                    style={{
                                        marginLeft: 6,
                                        fontSize: "0.65rem",
                                        color: "var(--dash-text-muted)",
                                        opacity: 0.6,
                                    }}
                                >
                                    📎
                                </span>
                            )}
                        </span>
                    )}

                    {/* Due date */}
                    {task.dueDate && (
                        <span
                            className={`${s.taskDueDate} ${overdue && !task.done ? s.taskDueDateOverdue : ""}`}
                        >
                            {task.dueDate}
                        </span>
                    )}

                    {/* Delete */}
                    <button
                        className={s.taskDeleteBtn}
                        onClick={(e) => handleDeleteTask(task.id, e)}
                        title="Remove"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Detail panel (expanded) ── */}
                {isExpanded && !isEditing && (
                    <div
                        className={s.taskDetail}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Row 1: priority + due date + move to */}
                        <div className={s.taskDetailRow}>
                            <select
                                className={s.prioritySelect}
                                value={task.priority}
                                onChange={(e) =>
                                    updateItem(task.id, {
                                        priority: e.target
                                            .value as TodoItem["priority"],
                                    })
                                }
                                title="Priority"
                            >
                                <option value="none">☐ None</option>
                                <option value="low">↓ Low</option>
                                <option value="medium">→ Medium</option>
                                <option value="high">↑ High</option>
                            </select>

                            <input
                                type="date"
                                className={s.taskDetailInput}
                                value={task.dueDate}
                                onChange={(e) =>
                                    updateItem(task.id, {
                                        dueDate: e.target.value,
                                    })
                                }
                                title="Due date"
                            />
                            {task.dueDate && (
                                <button
                                    className={s.xBtn}
                                    onClick={() =>
                                        updateItem(task.id, { dueDate: "" })
                                    }
                                    title="Clear date"
                                >
                                    ✕
                                </button>
                            )}

                            <select
                                className={s.moveSelect}
                                value={task.listId}
                                onChange={(e) =>
                                    handleMoveToList(task.id, e.target.value)
                                }
                                title="Move to list"
                            >
                                {state.lists.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.emoji} {l.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Row 2: Note textarea */}
                        <textarea
                            className={s.taskNoteInput}
                            placeholder="Add a note…"
                            value={task.note}
                            onChange={(e) =>
                                updateItem(task.id, { note: e.target.value })
                            }
                            rows={2}
                        />

                        {/* Row 3: Sub-tasks */}
                        {(task.subTasks.length > 0 ||
                            addingSubTaskId === task.id) && (
                            <div>
                                <span
                                    className={s.detailLabel}
                                    style={{
                                        display: "block",
                                        marginBottom: 4,
                                    }}
                                >
                                    Sub-tasks{" "}
                                    {subTotal > 0 && `${subDone}/${subTotal}`}
                                </span>
                                <div className={s.subTaskList}>
                                    {task.subTasks.map((sub: SubTask) => (
                                        <div
                                            key={sub.id}
                                            className={s.subTaskRow}
                                            onClick={() =>
                                                handleToggleSubTask(
                                                    task.id,
                                                    sub.id,
                                                )
                                            }
                                        >
                                            <div
                                                className={`${s.subTaskCheck} ${sub.done ? s.subTaskCheckDone : ""}`}
                                            >
                                                {sub.done && "✓"}
                                            </div>
                                            <span
                                                className={`${s.subTaskText} ${sub.done ? s.subTaskTextDone : ""}`}
                                            >
                                                {sub.text}
                                            </span>
                                            <button
                                                className={s.subTaskDeleteBtn}
                                                onClick={(e) =>
                                                    handleDeleteSubTask(
                                                        task.id,
                                                        sub.id,
                                                        e,
                                                    )
                                                }
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}

                                    {addingSubTaskId === task.id && (
                                        <div className={s.subTaskRow}>
                                            <div className={s.subTaskCheck} />
                                            <input
                                                ref={subAddRef}
                                                className={s.subTaskAddInput}
                                                placeholder="Sub-task…"
                                                value={subTaskInput}
                                                onChange={(e) =>
                                                    setSubTaskInput(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter")
                                                        handleAddSubTask(
                                                            task.id,
                                                        );
                                                    if (e.key === "Escape")
                                                        setAddingSubTaskId(
                                                            null,
                                                        );
                                                }}
                                                onBlur={() => {
                                                    handleAddSubTask(task.id);
                                                    setAddingSubTaskId(null);
                                                }}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Add sub-task button */}
                        <button
                            className={s.groupAddBtn}
                            style={{ paddingLeft: 0 }}
                            onClick={() => {
                                setAddingSubTaskId(task.id);
                                setSubTaskInput("");
                            }}
                        >
                            + Add sub-task
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={s.taskGroup}>
            {/* Group header */}
            <div
                className={s.taskGroupHeader}
                onClick={() => setIsOpen((o) => !o)}
            >
                <span
                    className={`${s.taskGroupChevron} ${isOpen ? s.taskGroupChevronOpen : ""}`}
                >
                    ›
                </span>
                <div
                    className={s.taskGroupColorBar}
                    style={{ background: list.color }}
                />
                <span className={s.taskGroupEmoji}>{list.emoji}</span>
                <span className={s.taskGroupName}>{list.name}</span>
                <span className={s.taskGroupCount}>{active.length}</span>
                {allTasks.length > 0 && (
                    <span className={s.taskGroupProgress}>
                        {completedPct}%
                    </span>
                )}
            </div>

            {isOpen && (
                <>
                    {/* Progress bar */}
                    {allTasks.length > 0 && (
                        <div style={{ padding: "0 10px 6px 30px" }}>
                            <div className={s.progressTrack}>
                                <div
                                    className={s.progressFill}
                                    style={{
                                        width: `${completedPct}%`,
                                        background: list.color,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Active tasks */}
                    <div
                        className={s.taskGroupItems}
                        style={{ borderLeftColor: list.color }}
                    >
                        {active.length === 0 && !addingTask && (
                            <div
                                className={s.emptyState}
                                style={{ padding: "12px 8px" }}
                            >
                                <p className={s.emptyText}>
                                    No tasks — add one below
                                </p>
                            </div>
                        )}

                        {active.map((task, idx) => renderTask(task, idx))}

                        {/* Inline add row */}
                        {addingTask && (
                            <div
                                className={s.taskRow}
                                style={{
                                    border: "1px solid var(--dash-accent-warm)",
                                    background: "rgba(222,137,0,0.04)",
                                }}
                            >
                                <span className={s.taskNum}>
                                    {active.length + 1})
                                </span>
                                <div className={s.taskCheck} />
                                <input
                                    ref={addRef}
                                    className={s.taskEditInput}
                                    placeholder="New task…"
                                    value={addText}
                                    onChange={(e) => setAddText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleAddTask();
                                        if (e.key === "Escape") {
                                            setAddingTask(false);
                                            setAddText("");
                                        }
                                    }}
                                    onBlur={() => {
                                        if (addText.trim()) handleAddTask();
                                        else setAddingTask(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer: add + clear */}
                    <div className={s.groupFooter}>
                        <button
                            className={s.groupAddBtn}
                            onClick={() => setAddingTask(true)}
                        >
                            + Add task
                        </button>
                        {completed.length > 0 && (
                            <button
                                className={s.groupClearBtn}
                                onClick={handleClearCompleted}
                            >
                                Clear done ({completed.length})
                            </button>
                        )}
                    </div>

                    {/* Completed section — collapsible */}
                    {completed.length > 0 && (
                        <div style={{ paddingLeft: 8 }}>
                            <div
                                className={s.completedHeader}
                                onClick={() => setCompletedOpen((o) => !o)}
                            >
                                <span
                                    className={`${s.completedChevron} ${completedOpen ? s.completedChevronOpen : ""}`}
                                >
                                    ›
                                </span>
                                <span className={s.completedTitle}>
                                    Completed — {completed.length}
                                </span>
                            </div>
                            {completedOpen && (
                                <div
                                    className={s.taskGroupItems}
                                    style={{
                                        borderLeftColor:
                                            "rgba(255,255,255,0.12)",
                                        opacity: 0.75,
                                    }}
                                >
                                    {completed.map((task, idx) =>
                                        renderTask(task, idx),
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
