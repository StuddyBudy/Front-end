import { useState, useEffect, useRef } from "react";
// ── FIX 1: Don't import Layout as a value — it's a type.
//           LayoutItem is the correct type for individual layout entries.
//           Also: if you still see errors after this, run:
//               npm uninstall @types/react-grid-layout
//           The old @types package conflicts with react-grid-layout's built-in types
//           and strips `cols`, `rowHeight`, etc. from GridLayoutProps.
import RGL from "react-grid-layout";
import type { LayoutItem } from "react-grid-layout";

// ── FIX 2: Cast RGL to a type that explicitly includes all the props we use.
//           This is the safest approach — works even if @types/react-grid-layout
//           is installed, and avoids the "cols does not exist" error entirely.
import type React from "react";
type GridLayoutProps = {
    layout: LayoutItem[];
    cols?: number;
    rowHeight?: number;
    width: number;
    onLayoutChange?: (layout: LayoutItem[]) => void;
    isDraggable?: boolean;
    isResizable?: boolean;
    draggableHandle?: string;
    margin?: [number, number];
    containerPadding?: [number, number];
    useCSSTransforms?: boolean;
    children?: React.ReactNode;
    className?: string;
};
const GridLayout = RGL as unknown as React.ComponentType<GridLayoutProps>;

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Dashboard.css";

// ── THEMES ───────────────────────────────────────────────────────────────────
export type ThemeDef = {
    id: string;
    name: string;
    label: string;
    vars: Record<string, string>;
};

export const BUILT_IN_THEMES: Record<string, ThemeDef> = {
    ember: {
        id: "ember",
        name: "Ember",
        label: "🔥",
        vars: {
            "--bg-page": "#16120e",
            "--bg-widget": "rgba(30,24,16,0.93)",
            "--bg-handle": "rgba(44,35,22,0.97)",
            "--accent": "#dfd0b8",
            "--accent-warm": "#de8900",
            "--accent-glow": "rgba(222,137,0,0.22)",
            "--text-primary": "#f0e8d8",
            "--text-muted": "rgba(240,232,216,0.45)",
            "--border": "rgba(223,208,184,0.10)",
            "--border-hover": "rgba(223,208,184,0.26)",
        },
    },
    midnight: {
        id: "midnight",
        name: "Midnight",
        label: "🌙",
        vars: {
            "--bg-page": "#0d0f14",
            "--bg-widget": "rgba(15,19,28,0.93)",
            "--bg-handle": "rgba(20,26,40,0.97)",
            "--accent": "#a8b8d8",
            "--accent-warm": "#5b8dee",
            "--accent-glow": "rgba(91,141,238,0.22)",
            "--text-primary": "#dce6f5",
            "--text-muted": "rgba(220,230,245,0.45)",
            "--border": "rgba(168,184,216,0.10)",
            "--border-hover": "rgba(168,184,216,0.26)",
        },
    },
    forest: {
        id: "forest",
        name: "Forest",
        label: "🌿",
        vars: {
            "--bg-page": "#0c120e",
            "--bg-widget": "rgba(14,22,16,0.93)",
            "--bg-handle": "rgba(18,30,20,0.97)",
            "--accent": "#a8cbb0",
            "--accent-warm": "#4caf78",
            "--accent-glow": "rgba(76,175,120,0.22)",
            "--text-primary": "#d8edd8",
            "--text-muted": "rgba(216,237,216,0.45)",
            "--border": "rgba(168,203,176,0.10)",
            "--border-hover": "rgba(168,203,176,0.26)",
        },
    },
    crimson: {
        id: "crimson",
        name: "Crimson",
        label: "🩸",
        vars: {
            "--bg-page": "#140a0a",
            "--bg-widget": "rgba(26,12,12,0.93)",
            "--bg-handle": "rgba(38,16,16,0.97)",
            "--accent": "#d4a0a0",
            "--accent-warm": "#e05555",
            "--accent-glow": "rgba(224,85,85,0.22)",
            "--text-primary": "#f5dada",
            "--text-muted": "rgba(245,218,218,0.45)",
            "--border": "rgba(212,160,160,0.10)",
            "--border-hover": "rgba(212,160,160,0.26)",
        },
    },
};

function applyTheme(theme: ThemeDef) {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) =>
        root.style.setProperty(k, v),
    );
}

// ── PERSISTENCE HELPERS ───────────────────────────────────────────────────────
const LS = {
    layout: "studyos_layout",
    themeId: "studyos_themeId",
    customThemes: "studyos_custom_themes",
};

const DEFAULT_LAYOUT: LayoutItem[] = [
    { i: "grades", x: 0, y: 0, w: 3, h: 7, minW: 2, minH: 4 },
    { i: "todo", x: 3, y: 0, w: 4, h: 7, minW: 2, minH: 4 },
    { i: "reminders", x: 7, y: 0, w: 3, h: 7, minW: 2, minH: 4 },
    { i: "schedule", x: 0, y: 7, w: 10, h: 11, minW: 4, minH: 6 },
];

function lsGet<T>(key: string, fallback: T): T {
    try {
        const s = localStorage.getItem(key);
        return s ? (JSON.parse(s) as T) : fallback;
    } catch {
        return fallback;
    }
}
function lsSet(key: string, val: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch {}
}

// ── CLOCK HOOK ────────────────────────────────────────────────────────────────
function useClock() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return now;
}

function getGreeting(d: Date) {
    const h = d.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

// ── ROOT COMPONENT ────────────────────────────────────────────────────────────
type Page = "dashboard" | "settings" | "notes" | "grades" | "calendar";

export default function Dashboard() {
    const [page, setPage] = useState<Page>("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [savedLayout, setSavedLayout] = useState<LayoutItem[]>(() =>
        lsGet(LS.layout, DEFAULT_LAYOUT),
    );
    const [workingLayout, setWorkingLayout] = useState<LayoutItem[]>(() =>
        lsGet(LS.layout, DEFAULT_LAYOUT),
    );
    const [themeId, setThemeId] = useState<string>(
        () => localStorage.getItem(LS.themeId) || "ember",
    );
    const [customThemes, setCustomThemes] = useState<ThemeDef[]>(() =>
        lsGet(LS.customThemes, []),
    );
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const [gridWidth, setGridWidth] = useState(900);
    const now = useClock();

    const allThemes: Record<string, ThemeDef> = {
        ...BUILT_IN_THEMES,
        ...Object.fromEntries(customThemes.map((t) => [t.id, t])),
    };
    const activeTheme = allThemes[themeId] || BUILT_IN_THEMES.ember;

    useEffect(() => {
        applyTheme(activeTheme);
        localStorage.setItem(LS.themeId, themeId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [themeId, customThemes]);

    useEffect(() => {
        if (!gridContainerRef.current) return;
        const ro = new ResizeObserver((entries) => {
            const w = entries[0].contentRect.width;
            if (w > 0) setGridWidth(w - 2);
        });
        ro.observe(gridContainerRef.current);
        return () => ro.disconnect();
    }, []);

    const startEdit = () => {
        setWorkingLayout(savedLayout);
        setEditMode(true);
    };
    const saveEdit = () => {
        setSavedLayout(workingLayout);
        lsSet(LS.layout, workingLayout);
        setEditMode(false);
    };
    const cancelEdit = () => {
        setWorkingLayout(savedLayout);
        setEditMode(false);
    };

    const handleThemeChange = (id: string) => setThemeId(id);
    const handleAddCustomTheme = (theme: ThemeDef) => {
        const updated = [
            ...customThemes.filter((t) => t.id !== theme.id),
            theme,
        ];
        setCustomThemes(updated);
        lsSet(LS.customThemes, updated);
        setThemeId(theme.id);
    };
    const handleDeleteCustomTheme = (id: string) => {
        const updated = customThemes.filter((t) => t.id !== id);
        setCustomThemes(updated);
        lsSet(LS.customThemes, updated);
        if (themeId === id) setThemeId("ember");
    };

    const dateStr = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <div className="app-shell">
            {/* TOP BAR */}
            <header className="top-bar">
                <div className="top-left">
                    <span className="top-date">{dateStr}</span>
                    <span className="top-sep">·</span>
                    <span className="top-time">{timeStr}</span>
                    <span className="top-sep">·</span>
                    <span className="top-weather">🌤 72°F</span>
                </div>
                <div className="top-center">
                    <span className="top-greeting">
                        {getGreeting(now)}, <strong>Username</strong>
                    </span>
                </div>
                <div className="top-right">
                    {page === "dashboard" && !editMode && (
                        <button className="top-btn" onClick={startEdit}>
                            <EditIcon /> Edit Dashboard
                        </button>
                    )}
                    {editMode && (
                        <>
                            <button
                                className="top-btn accent"
                                onClick={saveEdit}
                            >
                                ✓ Save Layout
                            </button>
                            <button
                                className="top-btn ghost"
                                onClick={cancelEdit}
                            >
                                ✕ Cancel
                            </button>
                        </>
                    )}
                    <div className="profile-avatar">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="body-row">
                {/* HAMBURGER */}
                <button
                    className={`hamburger-btn ${sidebarOpen ? "open" : ""}`}
                    onClick={() => setSidebarOpen((o) => !o)}
                    aria-label="Toggle sidebar"
                >
                    <span />
                    <span />
                    <span />
                </button>

                {/* SIDEBAR */}
                <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
                    <div className="sidebar-brand">StudyOS</div>
                    <nav className="sidebar-nav">
                        {(
                            [
                                ["dashboard", "🏠", "Home"],
                                ["notes", "📝", "Notes"],
                                ["grades", "📊", "Grades"],
                                ["calendar", "📅", "Calendar"],
                                ["settings", "⚙️", "Settings"],
                            ] as const
                        ).map(([id, icon, label]) => (
                            <button
                                key={id}
                                className={`sidebar-link ${page === id ? "active" : ""}`}
                                onClick={() => {
                                    setPage(id);
                                    setEditMode(false);
                                }}
                            >
                                <span className="sl-icon">{icon}</span>
                                <span className="sl-label">{label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* MAIN */}
                <main className="main-content" ref={gridContainerRef}>
                    {page === "dashboard" && (
                        <DashboardView
                            editMode={editMode}
                            layout={editMode ? workingLayout : savedLayout}
                            onLayoutChange={
                                editMode ? setWorkingLayout : undefined
                            }
                            gridWidth={gridWidth}
                        />
                    )}
                    {page === "settings" && (
                        <SettingsView
                            allThemes={allThemes}
                            activeThemeId={themeId}
                            customThemeIds={customThemes.map((t) => t.id)}
                            onThemeChange={handleThemeChange}
                            onAddTheme={handleAddCustomTheme}
                            onDeleteTheme={handleDeleteCustomTheme}
                        />
                    )}
                    {(page === "notes" ||
                        page === "grades" ||
                        page === "calendar") && (
                        <div className="placeholder-page">
                            <span className="placeholder-emoji">🚧</span>
                            <p>This page is coming soon.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* BOTTOM NAV */}
            <nav className="bottom-nav">
                {(
                    [
                        ["dashboard", "🏠", "Home"],
                        ["notes", "📝", "Notes"],
                        ["grades", "📊", "Grades"],
                        ["calendar", "📅", "Calendar"],
                    ] as const
                ).map(([id, icon, label]) => (
                    <button
                        key={id}
                        className={`bnav-item ${page === id ? "active" : ""}`}
                        onClick={() => {
                            setPage(id);
                            setEditMode(false);
                        }}
                    >
                        <span className="bnav-icon">{icon}</span>
                        <span className="bnav-label">{label}</span>
                    </button>
                ))}
                <button
                    className="bnav-item"
                    onClick={() => setPage("settings")}
                >
                    <span className="bnav-icon">⚙️</span>
                    <span className="bnav-label">Settings</span>
                </button>
                <button className="bnav-plus">+</button>
            </nav>
        </div>
    );
}

// ── DASHBOARD VIEW ────────────────────────────────────────────────────────────
function DashboardView({
    editMode,
    layout,
    onLayoutChange,
    gridWidth,
}: {
    editMode: boolean;
    layout: LayoutItem[]; // FIX: was Layout[] (array-of-arrays)
    onLayoutChange?: (l: LayoutItem[]) => void;
    gridWidth: number;
}) {
    return (
        <div className={`grid-wrap ${editMode ? "is-editing" : ""}`}>
            {editMode && (
                <div className="edit-banner">
                    ✦ Edit Mode — drag to rearrange · resize from corners · hit
                    Save when done
                </div>
            )}
            {/* GridLayout is cast above — no type errors for cols, rowHeight, etc. */}
            <GridLayout
                layout={layout}
                cols={10}
                rowHeight={46}
                width={Math.max(gridWidth, 320)}
                onLayoutChange={onLayoutChange}
                isDraggable={editMode}
                isResizable={editMode}
                draggableHandle=".drag-handle"
                margin={[14, 14]}
                containerPadding={[0, 0]}
                useCSSTransforms
            >
                <div key="grades" className="widget">
                    <div className="drag-handle">
                        <span>📊</span>Grades
                    </div>
                    <div className="widget-body">
                        <GradesWidget />
                    </div>
                </div>
                <div key="todo" className="widget">
                    <div className="drag-handle">
                        <span>✅</span>To-Do
                    </div>
                    <div className="widget-body">
                        <TodoWidget />
                    </div>
                </div>
                <div key="reminders" className="widget">
                    <div className="drag-handle">
                        <span>🔔</span>Reminders
                    </div>
                    <div className="widget-body">
                        <RemindersWidget />
                    </div>
                </div>
                <div key="schedule" className="widget">
                    <div className="drag-handle">
                        <span>📅</span>Weekly Schedule
                    </div>
                    <div className="widget-body">
                        <ScheduleWidget />
                    </div>
                </div>
            </GridLayout>
        </div>
    );
}

// ── GRADES ────────────────────────────────────────────────────────────────────
function GradesWidget() {
    const grades = [
        { s: "Calculus", g: "A", p: 100 },
        { s: "Physics", g: "B", p: 79 },
        { s: "Gym", g: "C", p: 67 },
        { s: "English", g: "A-", p: 92 },
    ];
    const col = (p: number) =>
        p >= 90
            ? "#4caf78"
            : p >= 80
              ? "#de8900"
              : p >= 70
                ? "#e0a030"
                : "#e05555";
    return (
        <ul className="grade-list">
            {grades.map(({ s, g, p }) => (
                <li key={s} className="grade-item">
                    <div className="grade-row">
                        <span className="g-sub">{s}</span>
                        <span className="g-badge" style={{ color: col(p) }}>
                            {g}
                        </span>
                    </div>
                    <div className="grade-track">
                        <div
                            className="grade-fill"
                            style={{ width: `${p}%`, background: col(p) }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
}

// ── TODO ──────────────────────────────────────────────────────────────────────
function TodoWidget() {
    const [items, setItems] = useState([
        { id: 1, text: "Finish React dashboard", done: false },
        { id: 2, text: "Study for Calculus quiz", done: false },
        { id: 3, text: "Read Chapter 7", done: true },
        { id: 4, text: "Email professor", done: false },
    ]);
    const [val, setVal] = useState("");
    const toggle = (id: number) =>
        setItems((p) =>
            p.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
        );
    const add = () => {
        const t = val.trim();
        if (!t) return;
        setItems((p) => [...p, { id: Date.now(), text: t, done: false }]);
        setVal("");
    };
    return (
        <div className="todo-wrap">
            <ul className="todo-list">
                {items.map(({ id, text, done }) => (
                    <li
                        key={id}
                        className={`todo-item ${done ? "done" : ""}`}
                        onClick={() => toggle(id)}
                    >
                        <span className="todo-chk">{done ? "☑" : "☐"}</span>
                        <span className="todo-txt">{text}</span>
                    </li>
                ))}
            </ul>
            <div className="todo-add">
                <input
                    className="todo-input"
                    placeholder="Add task…"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && add()}
                />
                <button className="todo-btn" onClick={add}>
                    +
                </button>
            </div>
        </div>
    );
}

// ── REMINDERS ─────────────────────────────────────────────────────────────────
function RemindersWidget() {
    const items = [
        "Call mom 📞",
        "Submit lab report — Friday",
        "Group project @ 3 PM Tue",
        "Pay tuition deposit",
    ];
    return (
        <ul className="reminder-list">
            {items.map((r) => (
                <li key={r} className="reminder-item">
                    {r}
                </li>
            ))}
        </ul>
    );
}

// ── SCHEDULE ──────────────────────────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM"];
type SchEvent = { day: number; hour: number; label: string; color: string };
const EVT_COLORS = [
    "#de8900",
    "#5b8dee",
    "#4caf78",
    "#a78bfa",
    "#e05555",
    "#e0a030",
];

function ScheduleWidget() {
    const [events, setEvents] = useState<SchEvent[]>([
        { day: 0, hour: 0, label: "Calculus", color: "#de8900" },
        { day: 1, hour: 1, label: "Physics Lab", color: "#5b8dee" },
        { day: 2, hour: 2, label: "Study Group", color: "#4caf78" },
        { day: 3, hour: 0, label: "Calc. Again", color: "#de8900" },
        { day: 4, hour: 3, label: "English", color: "#a78bfa" },
    ]);
    const [adding, setAdding] = useState<{
        day: number;
        hour: number;
    } | null>(null);
    const [inputVal, setInputVal] = useState("");

    const evMap = Object.fromEntries(
        events.map((e) => [`${e.day}-${e.hour}`, e]),
    );

    const commitAdd = () => {
        if (!adding) return;
        const t = inputVal.trim();
        if (t) {
            const color =
                EVT_COLORS[Math.floor(Math.random() * EVT_COLORS.length)];
            setEvents((p) => [
                ...p.filter(
                    (e) => !(e.day === adding.day && e.hour === adding.hour),
                ),
                { ...adding, label: t, color },
            ]);
        }
        setAdding(null);
        setInputVal("");
    };

    return (
        <div className="sch-outer">
            <div
                className="sch-grid"
                style={{
                    gridTemplateColumns: `56px repeat(${DAYS.length}, 1fr)`,
                }}
            >
                <div className="sch-corner" />
                {DAYS.map((d) => (
                    <div key={d} className="sch-day">
                        {d}
                    </div>
                ))}
                {HOURS.map((h, hi) => (
                    <>
                        <div key={`h${hi}`} className="sch-hour">
                            {h}
                        </div>
                        {DAYS.map((_, di) => {
                            const ev = evMap[`${di}-${hi}`];
                            const isAdd =
                                adding?.day === di && adding?.hour === hi;
                            return (
                                <div
                                    key={`c${di}-${hi}`}
                                    className={`sch-cell ${ev ? "has-ev" : ""}`}
                                    onClick={() => {
                                        if (!ev && !isAdd) {
                                            setAdding({ day: di, hour: hi });
                                            setInputVal("");
                                        }
                                    }}
                                >
                                    {ev && (
                                        <div
                                            className="sch-ev"
                                            style={{
                                                background: ev.color + "22",
                                                borderLeftColor: ev.color,
                                                color: ev.color,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEvents((p) =>
                                                    p.filter(
                                                        (x) =>
                                                            !(
                                                                x.day === di &&
                                                                x.hour === hi
                                                            ),
                                                    ),
                                                );
                                            }}
                                            title="Click to remove"
                                        >
                                            {ev.label}
                                        </div>
                                    )}
                                    {isAdd && (
                                        <input
                                            autoFocus
                                            className="sch-input"
                                            placeholder="Event…"
                                            value={inputVal}
                                            onChange={(e) =>
                                                setInputVal(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                    commitAdd();
                                                if (e.key === "Escape")
                                                    setAdding(null);
                                            }}
                                            onBlur={commitAdd}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </>
                ))}
            </div>
            <p className="sch-hint">
                Click empty cell to add event · click event to remove
            </p>
        </div>
    );
}

// ── SETTINGS VIEW ─────────────────────────────────────────────────────────────
function SettingsView({
    allThemes,
    activeThemeId,
    customThemeIds,
    onThemeChange,
    onAddTheme,
    onDeleteTheme,
}: {
    allThemes: Record<string, ThemeDef>;
    activeThemeId: string;
    customThemeIds: string[];
    onThemeChange: (id: string) => void;
    onAddTheme: (t: ThemeDef) => void;
    onDeleteTheme: (id: string) => void;
}) {
    const [creating, setCreating] = useState(false);
    const [draft, setDraft] = useState({
        name: "",
        label: "🎨",
        bgPage: "#16120e",
        bgWidget: "#1e1810",
        accent: "#dfd0b8",
        accentWarm: "#de8900",
        textPrimary: "#f0e8d8",
    });
    const set = (k: string, v: string) => setDraft((p) => ({ ...p, [k]: v }));

    const handleCreate = () => {
        const id = `custom_${Date.now()}`;
        onAddTheme({
            id,
            name: draft.name || "Custom",
            label: draft.label || "🎨",
            vars: {
                "--bg-page": draft.bgPage,
                "--bg-widget": draft.bgWidget + "ee",
                "--bg-handle": draft.bgWidget,
                "--accent": draft.accent,
                "--accent-warm": draft.accentWarm,
                "--accent-glow": draft.accentWarm + "38",
                "--text-primary": draft.textPrimary,
                "--text-muted": draft.textPrimary + "70",
                "--border": draft.accent + "1a",
                "--border-hover": draft.accent + "40",
            },
        });
        setCreating(false);
    };

    return (
        <div className="settings-page">
            <section className="settings-sec">
                <h2 className="settings-h2">Appearance</h2>
                <p className="settings-p">
                    Select a theme for your dashboard. Your choice is saved
                    automatically.
                </p>

                <div className="theme-grid">
                    {Object.values(allThemes).map((t) => (
                        <button
                            key={t.id}
                            className={`theme-card ${activeThemeId === t.id ? "active" : ""}`}
                            onClick={() => onThemeChange(t.id)}
                        >
                            <ThemePreview theme={t} />
                            <div className="tc-footer">
                                <span className="tc-emoji">{t.label}</span>
                                <span className="tc-name">{t.name}</span>
                                {customThemeIds.includes(t.id) && (
                                    <span
                                        className="tc-del"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteTheme(t.id);
                                        }}
                                        title="Delete"
                                    >
                                        ✕
                                    </span>
                                )}
                            </div>
                            {activeThemeId === t.id && (
                                <span className="tc-check">✓</span>
                            )}
                        </button>
                    ))}

                    <button
                        className="theme-card theme-add"
                        onClick={() => setCreating((c) => !c)}
                    >
                        <div className="tc-add-icon">+</div>
                        <div className="tc-footer">
                            <span className="tc-name">New Theme</span>
                        </div>
                    </button>
                </div>

                {creating && (
                    <div className="theme-builder">
                        <h3 className="builder-h3">Create Custom Theme</h3>
                        <div className="builder-fields">
                            {(
                                [
                                    {
                                        key: "name",
                                        label: "Name",
                                        type: "text",
                                        placeholder: "My Theme",
                                    },
                                    {
                                        key: "label",
                                        label: "Emoji",
                                        type: "text",
                                        placeholder: "🎨",
                                    },
                                    {
                                        key: "bgPage",
                                        label: "Page BG",
                                        type: "color",
                                        placeholder: "",
                                    },
                                    {
                                        key: "bgWidget",
                                        label: "Widget BG",
                                        type: "color",
                                        placeholder: "",
                                    },
                                    {
                                        key: "accent",
                                        label: "Accent",
                                        type: "color",
                                        placeholder: "",
                                    },
                                    {
                                        key: "accentWarm",
                                        label: "Highlight",
                                        type: "color",
                                        placeholder: "",
                                    },
                                    {
                                        key: "textPrimary",
                                        label: "Text",
                                        type: "color",
                                        placeholder: "",
                                    },
                                ] as const
                            ).map(({ key, label, type, placeholder }) => (
                                <label key={key} className="builder-field">
                                    <span>{label}</span>
                                    <div className="builder-input-row">
                                        {type === "color" && (
                                            <input
                                                type="color"
                                                className="color-swatch"
                                                value={draft[key]}
                                                onChange={(e) =>
                                                    set(key, e.target.value)
                                                }
                                            />
                                        )}
                                        <input
                                            className="builder-input"
                                            type="text"
                                            placeholder={placeholder}
                                            value={draft[key]}
                                            onChange={(e) =>
                                                set(key, e.target.value)
                                            }
                                        />
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className="builder-btns">
                            <button
                                className="bld-btn primary"
                                onClick={handleCreate}
                            >
                                Create Theme
                            </button>
                            <button
                                className="bld-btn ghost"
                                onClick={() => setCreating(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </section>

            <section className="settings-sec">
                <h2 className="settings-h2">Dashboard Layout</h2>
                <p className="settings-p">
                    Click{" "}
                    <strong style={{ color: "var(--accent-warm)" }}>
                        Edit Dashboard
                    </strong>{" "}
                    in the top bar to drag, resize, and rearrange widgets. Your
                    layout is saved automatically when you click Save Layout.
                </p>
            </section>
        </div>
    );
}

// ── THEME PREVIEW ─────────────────────────────────────────────────────────────
function ThemePreview({ theme }: { theme: ThemeDef }) {
    const bg = theme.vars["--bg-page"];
    const wig = theme.vars["--bg-widget"];
    const acc = theme.vars["--accent-warm"];
    return (
        <div className="tp-canvas" style={{ background: bg }}>
            <div
                className="tp-widget"
                style={{ background: wig, borderColor: acc + "40" }}
            >
                <div className="tp-bar" style={{ background: acc }} />
                <div className="tp-line" style={{ background: acc + "50" }} />
                <div
                    className="tp-line"
                    style={{ background: acc + "28", width: "55%" }}
                />
            </div>
            <div
                className="tp-widget small"
                style={{ background: wig, borderColor: acc + "40" }}
            >
                <div
                    className="tp-bar"
                    style={{ background: acc, width: "60%" }}
                />
                <div className="tp-line" style={{ background: acc + "50" }} />
            </div>
        </div>
    );
}

// ── EDIT ICON ─────────────────────────────────────────────────────────────────
function EditIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                display: "inline",
                verticalAlign: "middle",
                marginRight: 5,
            }}
        >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}
