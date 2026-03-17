"use client";

import type { Page } from "../types";
import s from "../Dashboard.module.css";

const NAV_ITEMS: { id: Page; icon: string; label: string }[] = [
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "notes", icon: "📝", label: "Notes" },
    { id: "grades", icon: "📊", label: "Grades" },
    { id: "calendar", icon: "📅", label: "Calendar" },
    { id: "settings", icon: "⚙️", label: "Settings" },
];

type Props = {
    page: Page;
    onNavigate: (page: Page) => void;
};

export default function BottomNav({ page, onNavigate }: Props) {
    return (
        <nav className={s.bottomNav}>
            {NAV_ITEMS.map(({ id, icon, label }) => (
                <button
                    key={id}
                    className={`${s.bnavItem} ${page === id ? s.bnavItemActive : ""}`}
                    onClick={() => onNavigate(id)}
                >
                    <span className={s.bnavIcon}>{icon}</span>
                    <span>{label}</span>
                </button>
            ))}
            <button className={s.bnavPlus} aria-label="Add page">
                +
            </button>
        </nav>
    );
}
