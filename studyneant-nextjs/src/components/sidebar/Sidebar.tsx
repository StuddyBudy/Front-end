"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import s from "./Sidebar.module.css";

// ── NAV STRUCTURE ─────────────────────────────────────────────────────────────
// This is the single source of truth for all navigation in StudyOS.
// Every page top bar imports this component — no page defines its own nav.
const MAIN_NAV = [
    { href: "/dashboard", icon: "🏠", label: "Dashboard" },
    { href: "/notes", icon: "📝", label: "Notes" },
    { href: "/calendar", icon: "📅", label: "Calendar" },
    { href: "/toDo", icon: "✅", label: "To-Do" },
    { href: "/gpaCalc", icon: "📊", label: "GPA Calc" },
] as const;

const SECONDARY_NAV = [
    { href: "/settings", icon: "⚙️", label: "Settings" },
] as const;

// ── PROPS ─────────────────────────────────────────────────────────────────────
type Props = {
    onClose: () => void;
    /** Optional extra quick-action buttons rendered below main nav */
    quickActions?: React.ReactNode;
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function AppDrawer({ onClose, quickActions }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const navigate = (href: string) => {
        router.push(href);
        onClose();
    };

    // A path is "active" if the current pathname starts with it
    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    if (typeof document === "undefined") return null;

    return createPortal(
        <>
            {/* Dimmed backdrop — click to close */}
            <div className={s.overlay} onClick={onClose} />

            {/* Drawer panel */}
            <div
                className={s.panel}
                role="navigation"
                aria-label="App navigation"
            >
                {/* Header */}
                <div className={s.header}>
                    <span className={s.brand}>
                        <span className={s.brandDot}>◈</span>StudyNeant
                    </span>
                    <button
                        className={s.closeBtn}
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                {/* Main navigation */}
                <div className={s.sectionLabel}>Navigate</div>
                <nav className={s.nav}>
                    {MAIN_NAV.map(({ href, icon, label }) => (
                        <button
                            key={href}
                            className={`${s.link} ${isActive(href) ? s.linkActive : ""}`}
                            onClick={() => navigate(href)}
                        >
                            <span className={s.icon}>{icon}</span>
                            <span className={s.label}>{label}</span>
                            {isActive(href) && (
                                <span className={s.badge}>here</span>
                            )}
                        </button>
                    ))}

                    <div className={s.divider} />

                    {SECONDARY_NAV.map(({ href, icon, label }) => (
                        <button
                            key={href}
                            className={`${s.link} ${isActive(href) ? s.linkActive : ""}`}
                            onClick={() => navigate(href)}
                        >
                            <span className={s.icon}>{icon}</span>
                            <span className={s.label}>{label}</span>
                        </button>
                    ))}

                    {/* Optional page-specific quick actions (e.g. "GPA Setup") */}
                    {quickActions && (
                        <>
                            <div className={s.divider} />
                            <div
                                className={s.sectionLabel}
                                style={{ padding: "8px 2px 4px" }}
                            >
                                Quick Actions
                            </div>
                            {quickActions}
                        </>
                    )}
                </nav>

                {/* Footer */}
                <div className={s.footer}>
                    <span className={s.footerText}>StudyNeant</span>
                    <span className={s.footerVersion}>
                        © {new Date().getFullYear()}
                    </span>
                </div>
            </div>
        </>,
        document.body,
    );
}

// ── HAMBURGER BUTTON ──────────────────────────────────────────────────────────
// Each top bar renders its own button; this exported component keeps the
// animation and style consistent without duplicating CSS.
type HamburgerProps = {
    open: boolean;
    onClick: () => void;
    label?: string;
};

export function HamburgerBtn({
    open,
    onClick,
    label = "Open navigation",
}: HamburgerProps) {
    return (
        <button
            className={`${s.hamburger} ${open ? s.hamburgerOpen : ""}`}
            onClick={onClick}
            aria-label={label}
            aria-expanded={open}
        >
            <span />
            <span />
            <span />
        </button>
    );
}
