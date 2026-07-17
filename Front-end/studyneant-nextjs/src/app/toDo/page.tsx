"use client";

import { useState, useMemo } from "react";
import { makeItem, todoStore } from "./storage";
import { useStorageStore } from "@/hooks/storageStore";

import ToDoTopBar, { type ToDoView } from "./components/ToDoTopBar";
import ListSidebar from "./components/ListSidebar";
import TaskGroup from "./components/TaskGroup";
import WeeklyView from "./components/WeeklyView";
import BottomNav from "@/components/bottomNav/BottomNav";

import s from "./ToDo.module.css";

// ── TO-DO PAGE ────────────────────────────────────────────────────────────────
// Route: /toDo
// Views:  "lists"  → checkbox sidebar + grouped task lists (original)
//         "weekly" → 7-column kanban board grouped by due date
export default function ToDoPage() {
    // ── Core state ──
    // Read through todoStore (useSyncExternalStore): the server prerender and
    // the client's hydration render both see the empty default, then the
    // persisted state arrives in the post-hydration render. setState is the
    // store's set — every write persists to localStorage automatically.
    const [state, setState] = useStorageStore(todoStore);
    const [view, setView] = useState<ToDoView>("lists");

    // ── Hidden lists (for the lists view) ──
    // Tracked inverted (hidden rather than visible) so "all lists visible"
    // is the natural default and needs no post-load initialization.
    const [hiddenListIds, setHiddenListIds] = useState<Set<string>>(new Set());

    // ── Global quick-add (lists view) ──
    const [globalText, setGlobalText] = useState("");
    const [globalListId, setGlobalListId] = useState<string>("");

    // ── Visibility toggles ──
    const toggleList = (id: string) =>
        setHiddenListIds((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });
    const selectAll = () => setHiddenListIds(new Set());
    const deselectAll = () =>
        setHiddenListIds(new Set(state.lists.map((l) => l.id)));

    // ── Sort ──
    const handleSortChange = (mode: typeof state.sortMode) => {
        setState({ ...state, sortMode: mode });
    };

    const effectiveVisibleListIds = useMemo(
        () =>
            new Set(
                state.lists
                    .filter((l) => !hiddenListIds.has(l.id))
                    .map((l) => l.id),
            ),
        [state.lists, hiddenListIds],
    );

    const resolvedGlobalListId =
        state.lists.find((l) => l.id === globalListId)?.id ??
        state.lists[0]?.id ??
        "";

    const handleGlobalAdd = () => {
        const text = globalText.trim();
        if (!text || !resolvedGlobalListId) return;
        const item = makeItem(resolvedGlobalListId, text);
        setState({ ...state, items: [...state.items, item] });
        setGlobalText("");
        setHiddenListIds((prev) => {
            const n = new Set(prev);
            n.delete(resolvedGlobalListId);
            return n;
        });
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
