import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const NAV_LINKS = [
    { to: "/", label: "Home", icon: "🏠", end: true },
    { to: "/Notes", label: "Notes", icon: "📝", end: false },
    { to: "/GpaCalc", label: "Grades", icon: "📊", end: false },
    { to: "/Calendar", label: "Calendar", icon: "📅", end: false }, // FIX: was "Calandar"
    { to: "/Settings", label: "Settings", icon: "⚙️", end: false },
];
type Page = "dashboard" | "settings" | "notes" | "grades" | "calendar";

export default function Sidebar() {
    // FIX: was false — sidebar was hidden on first load
    const [isOpen, setIsOpen] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [page, setPage] = useState<Page>("dashboard");
    const [editMode, setEditMode] = useState(false);

    return (
        <>
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
            </div>
        </>
    );
}
