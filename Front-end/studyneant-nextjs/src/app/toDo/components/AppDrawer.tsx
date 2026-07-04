"use client";
import { useRouter, usePathname } from "next/navigation";
import s from "../ToDo.module.css";
const NAV = [
    { href: "/dashboard", icon: "🏠", label: "Dashboard" },
    { href: "/notes", icon: "📝", label: "Notes" },
    { href: "/calendar", icon: "📅", label: "Calendar" },
    { href: "/toDo", icon: "✅", label: "To-Do" },
    { href: "/gpaCalc", icon: "📊", label: "GPA Calc" },
    { href: "/settings", icon: "⚙️", label: "Settings" },
] as const;
export default function AppDrawer({ onClose }: { onClose: () => void }) {
    const router = useRouter(),
        pathname = usePathname();
    return (
        <>
            <div className={s.drawerOverlay} onClick={onClose} />
            <div className={s.drawer}>
                <div className={s.drawerHeader}>
                    <span className={s.drawerBrand}>◈ StudyOS</span>
                    <button className={s.drawerClose} onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className={s.drawerSectionLabel}>Navigate</div>
                <nav className={s.drawerNav}>
                    {NAV.map(({ href, icon, label }) => {
                        const active =
                            pathname === href ||
                            pathname.startsWith(href + "/");
                        return (
                            <button
                                key={href}
                                className={`${s.drawerLink} ${active ? s.drawerLinkActive : ""}`}
                                onClick={() => {
                                    router.push(href);
                                    onClose();
                                }}
                            >
                                <span className={s.drawerLinkIcon}>{icon}</span>
                                <span className={s.drawerLinkText}>
                                    {label}
                                </span>
                                {active && (
                                    <span className={s.drawerLinkBadge}>
                                        here
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
                <div className={s.drawerFooter}>
                    StudyOS © {new Date().getFullYear()}
                </div>
            </div>
        </>
    );
}
