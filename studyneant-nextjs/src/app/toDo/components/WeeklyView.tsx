"use client";

import { useState } from "react";
import type { TodoState, TodoItem } from "../types";
import { makeItem, saveTodo, PRIORITY_CONFIG } from "../storage";

// ── FIX 1: Import BOTH css modules ───────────────────────────────────────────
// tw = weekly-specific styles (weekGrid, weekCol, weekCard, etc.)
import tw from "./Weekly.module.css";

// ── HELPERS ───────────────────────────────────────────────────────────────────
function toYMD(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── FIX 2: Guard against invalid / empty dateStr ──────────────────────────────
// Previously called with "unscheduled" → new Date("unscheduled") = Invalid Date
// → NaN arithmetic → "Due in NaNd"
function relativeLabel(
    dateStr: string,
    todayStr: string,
): { label: string; overdue: boolean } {
    // No date or sentinel value → show nothing
    if (!dateStr || dateStr === "unscheduled")
        return { label: "", overdue: false };

    const due = new Date(dateStr);
    // Guard: if still not a real date, bail out silently
    if (isNaN(due.getTime())) return { label: "", overdue: false };

    if (dateStr === todayStr) return { label: "Due today", overdue: false };

    const diff = Math.round(
        (due.getTime() - new Date(todayStr).getTime()) / 86_400_000,
    );

    if (diff < -1)
        return { label: `Due ${Math.abs(diff)}d ago`, overdue: true };
    if (diff === -1) return { label: "Due yesterday", overdue: true };
    if (diff === 0) return { label: "Due today", overdue: false };
    if (diff === 1) return { label: "Due tomorrow", overdue: false };
    return { label: `Due in ${diff}d`, overdue: false };
}

// ── PROPS ─────────────────────────────────────────────────────────────────────
type Props = {
    state: TodoState;
    setState: (next: TodoState) => void;
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function WeeklyView({ state, setState }: Props) {
    const today = new Date();
    const todayStr = toYMD(today);

    // Build 7-day window starting from Sunday of the current week
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const days: Date[] = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
    });

    // Inline-add state
    const [addingDay, setAddingDay] = useState<string | null>(null);
    const [addText, setAddText] = useState("");
    const [addListId, setAddListId] = useState<string>(
        () => state.lists[0]?.id ?? "",
    );

    // Quick lookup maps
    const colorMap = Object.fromEntries(
        state.lists.map((l) => [l.id, l.color]),
    );
    const emojiMap = Object.fromEntries(
        state.lists.map((l) => [l.id, l.emoji]),
    );
    const nameMap = Object.fromEntries(state.lists.map((l) => [l.id, l.name]));

    // Items grouped by their dueDate
    const itemsByDate = state.items.reduce<Record<string, TodoItem[]>>(
        (acc, item) => {
            if (!item.dueDate) return acc;
            if (!acc[item.dueDate]) acc[item.dueDate] = [];
            acc[item.dueDate].push(item);
            return acc;
        },
        {},
    );

    // Items with no due date → Unscheduled column
    const unscheduled = state.items.filter((i) => !i.dueDate);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleToggleDone = (id: string) => {
        const item = state.items.find((i) => i.id === id);
        if (!item) return;
        const next = {
            ...state,
            items: state.items.map((i) =>
                i.id === id ? { ...i, done: !i.done } : i,
            ),
        };
        saveTodo(next);
        setState(next);
    };

    const handleAddItem = (dateStr: string) => {
        const text = addText.trim();
        const listId = addListId || state.lists[0]?.id;
        if (!text || !listId) {
            setAddingDay(null);
            return;
        }

        // For the "unscheduled" sentinel, don't set a dueDate
        const dueDate = dateStr === "unscheduled" ? "" : dateStr;
        const item = makeItem(listId, text);
        const next = {
            ...state,
            items: [...state.items, { ...item, dueDate }],
        };
        saveTodo(next);
        setState(next);
        setAddText("");
        // Keep form open so user can add another
    };

    const openAdd = (dateStr: string) => {
        setAddingDay(dateStr);
        setAddText("");
        setAddListId(state.lists[0]?.id ?? "");
    };

    // ── Task card ──────────────────────────────────────────────────────────────
    const TaskCard = ({
        item,
        colDateStr,
    }: {
        item: TodoItem;
        colDateStr: string;
    }) => {
        const color = colorMap[item.listId] || "#de8900";
        const emoji = emojiMap[item.listId] || "📋";
        const listName = nameMap[item.listId] || "List";
        const pCfg = PRIORITY_CONFIG[item.priority];
        // Use the item's own dueDate for the label; fall back to column date
        const rel = relativeLabel(item.dueDate || colDateStr, todayStr);
        const subDone = item.subTasks.filter((st) => st.done).length;
        const subTotal = item.subTasks.length;

        return (
            <div
                className={`${tw.weekCard} ${item.done ? tw.weekCardDone : ""}`}
            >
                {/* Header: list badge + complete circle */}
                <div className={tw.weekCardHeader}>
                    <span
                        className={tw.weekCardBadge}
                        style={{ background: color + "22", color }}
                    >
                        <span>{emoji}</span>
                        {listName}
                    </span>
                    <button
                        className={`${tw.weekCardCheck} ${item.done ? tw.weekCardCheckDone : ""}`}
                        style={
                            item.done
                                ? { background: color, borderColor: color }
                                : { borderColor: color }
                        }
                        onClick={() => handleToggleDone(item.id)}
                        title={item.done ? "Mark undone" : "Mark done"}
                    >
                        {item.done && "✓"}
                    </button>
                </div>

                {/* Title */}
                <p className={tw.weekCardTitle}>{item.text}</p>

                {/* Note preview */}
                {item.note && <p className={tw.weekCardNote}>{item.note}</p>}

                {/* Sub-task progress bar */}
                {subTotal > 0 && (
                    <div className={tw.weekCardSubRow}>
                        <div className={tw.weekCardSubTrack}>
                            <div
                                className={tw.weekCardSubFill}
                                style={{
                                    width: `${Math.round((subDone / subTotal) * 100)}%`,
                                    background: color,
                                }}
                            />
                        </div>
                        <span className={tw.weekCardSubLabel}>
                            {subDone}/{subTotal}
                        </span>
                    </div>
                )}

                {/* Footer: priority + relative due label */}
                <div className={tw.weekCardFooter}>
                    {item.priority !== "none" && (
                        <span
                            className={tw.weekCardPriority}
                            style={{ color: pCfg.color }}
                        >
                            {pCfg.flag} {pCfg.label}
                        </span>
                    )}
                    {rel.label && (
                        <span
                            className={`${tw.weekCardDue} ${rel.overdue ? tw.weekCardDueOverdue : ""}`}
                        >
                            {rel.label}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    // ── Column renderer ────────────────────────────────────────────────────────
    const renderColumn = (
        label: string,
        dateStr: string,
        isToday: boolean,
        items: TodoItem[],
    ) => {
        const isAdding = addingDay === dateStr;
        const active = items.filter((i) => !i.done);
        const done = items.filter((i) => i.done);

        return (
            <div
                key={dateStr}
                className={`${tw.weekCol} ${isToday ? tw.weekColToday : ""}`}
            >
                {/* Column header */}
                <div className={tw.weekColHeader}>
                    <span className={tw.weekColDay}>{label}</span>
                    {active.length > 0 && (
                        <span className={tw.weekColCount}>{active.length}</span>
                    )}
                </div>

                {/* Add button */}
                <button
                    className={tw.weekAddBtn}
                    onClick={() => openAdd(dateStr)}
                >
                    + Add item
                </button>

                {/* Inline add form */}
                {isAdding && (
                    <div className={tw.weekAddForm}>
                        <input
                            autoFocus
                            className={tw.weekAddInput}
                            placeholder="Task name…"
                            value={addText}
                            onChange={(e) => setAddText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddItem(dateStr);
                                if (e.key === "Escape") setAddingDay(null);
                            }}
                        />
                        <select
                            className={tw.weekAddSelect}
                            value={addListId}
                            onChange={(e) => setAddListId(e.target.value)}
                        >
                            {state.lists.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.emoji} {l.name}
                                </option>
                            ))}
                        </select>
                        <div style={{ display: "flex", gap: 4 }}>
                            <button
                                className={tw.weekAddConfirm}
                                onClick={() => handleAddItem(dateStr)}
                            >
                                Add
                            </button>
                            <button
                                className={tw.weekAddCancel}
                                onClick={() => setAddingDay(null)}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Active cards */}
                <div className={tw.weekColCards}>
                    {active.length === 0 && !isAdding && (
                        <div className={tw.weekColEmpty}>Nothing due</div>
                    )}
                    {active.map((item) => (
                        <TaskCard
                            key={item.id}
                            item={item}
                            colDateStr={dateStr}
                        />
                    ))}
                </div>

                {/* Completed cards — collapsed */}
                {done.length > 0 && (
                    <details className={tw.weekDoneSection}>
                        <summary className={tw.weekDoneSummary}>
                            ✓ {done.length} completed
                        </summary>
                        <div style={{ padding: "4px 10px" }}>
                            {done.map((item) => (
                                <TaskCard
                                    key={item.id}
                                    item={item}
                                    colDateStr={dateStr}
                                />
                            ))}
                        </div>
                    </details>
                )}
            </div>
        );
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className={tw.weeklyWrap}>
            {/* Banner */}
            <div className={tw.weekNav}>
                <span className={tw.weekNavLabel}>
                    Week of{" "}
                    {weekStart.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    })}
                    {" – "}
                    {days[6].toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
                <span className={tw.weekNavHint}>
                    Tasks with a due date appear in their column · click + Add
                    item to schedule anything
                </span>
            </div>

            {/* 7 day columns + Unscheduled */}
            <div className={tw.weekGrid}>
                {days.map((day) => {
                    const ds = toYMD(day);
                    const isToday = ds === todayStr;
                    const items = itemsByDate[ds] ?? [];
                    const dayName = day.toLocaleDateString("en-US", {
                        weekday: "short",
                    });
                    const dayNum = day.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    });
                    const label = isToday
                        ? `Due Today ${dayNum}`
                        : `${dayName} ${dayNum}`;
                    return renderColumn(label, ds, isToday, items);
                })}

                {/* Unscheduled column — no date sentinel, no due label */}
                {renderColumn(
                    `Unscheduled${unscheduled.length > 0 ? ` · ${unscheduled.length}` : ""}`,
                    "unscheduled",
                    false,
                    unscheduled,
                )}
            </div>
        </div>
    );
}
