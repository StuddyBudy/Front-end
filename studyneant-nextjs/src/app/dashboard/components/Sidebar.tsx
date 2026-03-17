"use client";

import type { Page } from "../types";
import s from "../Dashboard.module.css";

const NAV_LINKS: { id: Page; icon: string; label: string }[] = [
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "notes", icon: "📝", label: "Notes" },
    { id: "grades", icon: "📊", label: "Grades" },
    { id: "calendar", icon: "📅", label: "Calendar" },
    { id: "settings", icon: "⚙️", label: "Settings" },
];

type Props = {
    open: boolean;
    page: Page;
    onToggle: () => void;
    onNavigate: (page: Page) => void;
};

export default function Sidebar({ open, page, onToggle, onNavigate }: Props) {
    return (
        <>
            <button
                className={`${s.hamburgerBtn} ${open ? s.hamburgerOpen : ""}`}
                onClick={onToggle}
                aria-label="Toggle sidebar"
                aria-expanded={open}
            >
                <span />
                <span />
                <span />
            </button>

            <aside className={`${s.sidebar} ${open ? "" : s.sidebarClosed}`}>
                <div className={s.sidebarBrand}>StudyOS</div>
                <nav className={s.sidebarNav}>
                    {NAV_LINKS.map(({ id, icon, label }) => (
                        <button
                            key={id}
                            className={`${s.sidebarLink} ${page === id ? s.sidebarLinkActive : ""}`}
                            onClick={() => onNavigate(id)}
                        >
                            <span className={s.slIcon}>{icon}</span>
                            <span className={s.slLabel}>{label}</span>
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
}
