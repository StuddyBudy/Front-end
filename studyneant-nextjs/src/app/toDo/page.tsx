"use client";

import { useState, useEffect, useMemo } from "react";
import type { TodoState } from "./types";
import { loadTodo, saveTodo, makeItem } from "./storage";

import ToDoTopBar, { type ToDoView } from "./components/ToDoTopBar";
import ListSidebar from "./components/ListSidebar";
import TaskGroup from "./components/TaskGroup";
import WeeklyView from "./components/WeeklyView";

import s from "./ToDo.module.css";

// ── TO-DO PAGE ────────────────────────────────────────────────────────────────
// Route: /toDo
// Views:  "lists"  → checkbox sidebar + grouped task lists (original)
//         "weekly" → 7-column kanban board grouped by due date
export default function ToDoPage() {
    // ── Core state ──
    const [state, setState] = useState<TodoState>(() => {
        if (typeof window === "undefined")
            return { lists: [], items: [], sortMode: "manual" };
        return loadTodo();
    });
    const [view, setView] = useState<ToDoView>("lists");

    // ── Visible lists (for the lists view) ──
    const [visibleListIds, setVisibleListIds] = useState<Set<string>>(() => {
        if (typeof window === "undefined") return new Set();
        return new Set(loadTodo().lists.map((l) => l.id));
    });

    // ── Hydrate from localStorage on mount ──
    useEffect(() => {
        const loaded = loadTodo();
        setState(loaded);
        setVisibleListIds(new Set(loaded.lists.map((l) => l.id)));
    }, []);

    // Keep visible set valid when lists are added / deleted
    useEffect(() => {
        setVisibleListIds((prev) => {
            const valid = new Set(state.lists.map((l) => l.id));
            return new Set([...prev].filter((id) => valid.has(id)));
        });
    }, [state.lists]);

    // ── Visibility toggles ──
    const toggleList = (id: string) =>
        setVisibleListIds((prev) => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    const selectAll = () =>
        setVisibleListIds(new Set(state.lists.map((l) => l.id)));
    const deselectAll = () => setVisibleListIds(new Set());

    // ── Sort ──
    const handleSortChange = (mode: typeof state.sortMode) => {
        const next = { ...state, sortMode: mode };
        setState(next);
        saveTodo(next);
    };

    // ── Global quick-add (lists view) ──
    const [globalText, setGlobalText] = useState("");
    const [globalListId, setGlobalListId] = useState<string>(
        () => loadTodo().lists[0]?.id ?? "",
    );
    useEffect(() => {
        if (!state.lists.find((l) => l.id === globalListId))
            setGlobalListId(state.lists[0]?.id ?? "");
    }, [state.lists, globalListId]);

    const handleGlobalAdd = () => {
        const text = globalText.trim();
        if (!text || !globalListId) return;
        const item = makeItem(globalListId, text);
        const next = { ...state, items: [...state.items, item] };
        setState(next);
        saveTodo(next);
        setGlobalText("");
        setVisibleListIds((prev) => new Set([...prev, globalListId]));
    };

    // ── Derived ──
    const visibleLists = useMemo(
        () =>
            [...state.lists]
                .sort((a, b) => a.order - b.order)
                .filter((l) => visibleListIds.has(l.id)),
        [state.lists, visibleListIds],
    );
    const totalVisibleTasks = useMemo(
        () => state.items.filter((i) => visibleListIds.has(i.listId)).length,
        [state.items, visibleListIds],
    );

    const headerTitle =
        visibleListIds.size === 0
            ? "No lists selected"
            : visibleListIds.size === state.lists.length
              ? "All Lists"
              : visibleLists.map((l) => `${l.emoji} ${l.name}`).join(", ");

    return (
        <div className={s.shell} suppressHydrationWarning>
            {/* Top bar — includes Lists/Weekly toggle */}
            <ToDoTopBar
                sortMode={state.sortMode}
                onSortChange={handleSortChange}
                view={view}
                onViewChange={setView}
                visibleCount={visibleListIds.size}
                totalTasks={totalVisibleTasks}
            />

            {/* ── LISTS VIEW ── */}
            {view === "lists" && (
                <div className={s.body}>
                    <ListSidebar
                        state={state}
                        setState={setState}
                        visibleListIds={visibleListIds}
                        onToggleList={toggleList}
                        onSelectAll={selectAll}
                        onDeselectAll={deselectAll}
                    />

                    <div className={s.mainPanel}>
                        <div className={s.mainHeader}>
                            <span className={s.mainHeaderTitle}>
                                {headerTitle}
                            </span>
                            {totalVisibleTasks > 0 && (
                                <span className={s.mainHeaderMeta}>
                                    {totalVisibleTasks} task
                                    {totalVisibleTasks !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>

                        {/* Global quick-add */}
                        {state.lists.length > 0 && (
                            <div className={s.globalAddRow}>
                                <input
                                    className={s.globalAddInput}
                                    placeholder="Quick-add a task…"
                                    value={globalText}
                                    onChange={(e) =>
                                        setGlobalText(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleGlobalAdd()
                                    }
                                />
                                <select
                                    className={s.globalListSelect}
                                    value={globalListId}
                                    onChange={(e) =>
                                        setGlobalListId(e.target.value)
                                    }
                                >
                                    {state.lists.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.emoji} {l.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className={s.globalAddBtn}
                                    onClick={handleGlobalAdd}
                                >
                                    + Add
                                </button>
                            </div>
                        )}

                        <div className={s.mainScroll}>
                            {visibleListIds.size === 0 ? (
                                <div className={s.emptyState}>
                                    <span className={s.emptyEmoji}>☑️</span>
                                    <p className={s.emptyText}>
                                        Check a list on the left to view its
                                        tasks.
                                    </p>
                                </div>
                            ) : (
                                visibleLists.map((list) => (
                                    <TaskGroup
                                        key={list.id}
                                        list={list}
                                        state={state}
                                        setState={setState}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── WEEKLY VIEW ── */}
            {view === "weekly" && (
                <div
                    style={{
                        flex: 1,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <WeeklyView state={state} setState={setState} />
                </div>
            )}
        </div>
    );
}
