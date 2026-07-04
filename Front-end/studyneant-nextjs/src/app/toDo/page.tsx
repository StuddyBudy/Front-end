"use client";

import { useState, useEffect, useMemo } from "react";
import type { TodoState } from "./types";
import { loadTodo, saveTodo, makeItem } from "./storage";

import ToDoTopBar, { type ToDoView } from "./components/ToDoTopBar";
import ListSidebar from "./components/ListSidebar";
import TaskGroup from "./components/TaskGroup";
import WeeklyView from "./components/WeeklyView";
import BottomNav from "../../components/bottomNav/BottomNav";

import s from "./ToDo.module.css";

// ── TO-DO PAGE ────────────────────────────────────────────────────────────────
// Route: /toDo
// Views:  "lists"  → checkbox sidebar + grouped task lists (original)
//         "weekly" → 7-column kanban board grouped by due date
export default function ToDoPage() {
    // ── Core state ──
    // Starts empty on the server prerender AND the client's first render;
    // the persisted state loads in the mount effect below. Reading loadTodo()
    // inside initializers made the two renders diverge (hydration errors) and
    // wrote seed data to localStorage as a render side-effect.
    const [state, setState] = useState<TodoState>({
        lists: [],
        items: [],
        sortMode: "manual",
    });
    const [view, setView] = useState<ToDoView>("lists");

    // ── Visible lists (for the lists view) ──
    const [visibleListIds, setVisibleListIds] = useState<Set<string>>(
        new Set(),
    );

    // ── Global quick-add (lists view) ──
    const [globalText, setGlobalText] = useState("");
    const [globalListId, setGlobalListId] = useState<string>("");

    // ── Hydrate persisted state after mount ──
    useEffect(() => {
        const loaded = loadTodo();
        setState(loaded);
        setVisibleListIds(new Set(loaded.lists.map((l) => l.id)));
        setGlobalListId(loaded.lists[0]?.id ?? "");
    }, []);

    // ── Visibility toggles ──
    const toggleList = (id: string) =>
        setVisibleListIds((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
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

    const effectiveVisibleListIds = useMemo(() => {
        const valid = new Set(state.lists.map((l) => l.id));
        return new Set([...visibleListIds].filter((id) => valid.has(id)));
    }, [state.lists, visibleListIds]);

    const resolvedGlobalListId =
        state.lists.find((l) => l.id === globalListId)?.id ??
        state.lists[0]?.id ??
        "";

    const handleGlobalAdd = () => {
        const text = globalText.trim();
        if (!text || !resolvedGlobalListId) return;
        const item = makeItem(resolvedGlobalListId, text);
        const next = { ...state, items: [...state.items, item] };
        setState(next);
        saveTodo(next);
        setGlobalText("");
        setVisibleListIds((prev) => new Set([...prev, resolvedGlobalListId]));
    };

    // ── Derived ──
    const visibleLists = useMemo(
        () =>
            [...state.lists]
                .sort((a, b) => a.order - b.order)
                .filter((l) => effectiveVisibleListIds.has(l.id)),
        [state.lists, effectiveVisibleListIds],
    );
    const totalVisibleTasks = useMemo(
        () =>
            state.items.filter((i) => effectiveVisibleListIds.has(i.listId))
                .length,
        [state.items, effectiveVisibleListIds],
    );

    const headerTitle =
        effectiveVisibleListIds.size === 0
            ? "No lists selected"
            : effectiveVisibleListIds.size === state.lists.length
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
                visibleCount={effectiveVisibleListIds.size}
                totalTasks={totalVisibleTasks}
            />

            {/* ── LISTS VIEW ── */}
            {view === "lists" && (
                <div className={s.body}>
                    <ListSidebar
                        state={state}
                        setState={setState}
                        visibleListIds={effectiveVisibleListIds}
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
                                    value={resolvedGlobalListId}
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
                            {effectiveVisibleListIds.size === 0 ? (
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
            <BottomNav />
        </div>
    );
}
