"use client";

import { useRouter, usePathname } from "next/navigation";

import type { Page } from "../types";
import s from "./BottomNav.module.css";

const MAIN_NAV = [
    { href: "/dashboard", icon: "🏠", label: "Dashboard" },
    { href: "/notes", icon: "📝", label: "Notes" },
    { href: "/calendar", icon: "📅", label: "Calendar" },
    { href: "/toDo", icon: "✅", label: "To-Do" },
    { href: "/gpaCalc", icon: "📊", label: "GPA Calc" },
] as const;

type Props = {
    page: Page;
    onNavigate: (page: Page) => void;
};

export default function BottomNav({ page, onNavigate }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    const handleNavClick = (href: (typeof MAIN_NAV)[number]["href"]) => {
        // Dashboard uses local page state inside /dashboard, so reset it explicitly.
        if (href === "/dashboard") {
            onNavigate("dashboard");
            if (pathname !== "/dashboard") router.push("/dashboard");
            return;
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
