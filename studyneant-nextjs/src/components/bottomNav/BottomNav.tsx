"use client";

import { useRouter, usePathname } from "next/navigation";

import s from "./BottomNav.module.css";

const MAIN_NAV = [
    { href: "/dashboard", icon: "🏠", label: "Dashboard" },
    { href: "/notes", icon: "📝", label: "Notes" },
    { href: "/calendar", icon: "📅", label: "Calendar" },
    { href: "/toDo", icon: "✅", label: "To-Do" },
    { href: "/gpaCalc", icon: "📊", label: "GPA Calc" },
    { href: "/settings", icon: "⚙️", label: "Settings" },
] as const;

type Props = {
    onNavigate?: () => void;
};

export default function BottomNav({ onNavigate }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    const handleNavClick = (href: (typeof MAIN_NAV)[number]["href"]) => {
        if (href === "/dashboard") {
            onNavigate?.();
        }

        router.push(href);
    };

    return (
        <nav className={s.bottomNav}>
            {MAIN_NAV.map(({ href, icon, label }) => (
                <button
                    key={href}
                    className={`${s.bnavItem} ${isActive(href) ? s.bnavItemActive : ""}`}
                    onClick={() => handleNavClick(href)}
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
