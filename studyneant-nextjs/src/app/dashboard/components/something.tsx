"use client";

import { useState } from "react";
import AppDrawer, { HamburgerBtn } from "@/components/AppDrawer";

// ── DASHBOARD TOP BAR ─────────────────────────────────────────────────────────
// The dashboard already has its own sidebar, but the hamburger in the top bar
// now opens the same shared AppDrawer as every other page for consistency.
// The dashboard sidebar can remain as a supplementary widget panel.

type Props = {
    greeting: string; // e.g. "Good morning, Username"
    time: string; // e.g. "Thu, Mar 19, 2026 · 6:35 PM"
    weather?: string; // e.g. "72°F ☀"
    onEdit: () => void;
};

export default function DashboardTopBar({
    greeting,
    time,
    weather,
    onEdit,
}: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 58,
                    padding: "0 24px",
                    borderBottom:
                        "1px solid var(--dash-border, rgba(223,208,184,0.10))",
                    background: "rgba(0,0,0,0.28)",
                    backdropFilter: "blur(12px)",
                    gap: 14,
                    flexShrink: 0,
                    zIndex: 40,
                    fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                }}
            >
                {/* Left: hamburger + datetime + weather */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <HamburgerBtn
                        open={drawerOpen}
                        onClick={() => setDrawerOpen((o) => !o)}
                    />
                    <span
                        style={{
                            fontSize: "0.78rem",
                            color: "var(--dash-text-muted, rgba(240,232,216,0.45))",
                        }}
                    >
                        {time}
                        {weather && (
                            <span style={{ marginLeft: 10 }}>{weather}</span>
                        )}
                    </span>
                </div>

                {/* Centre: greeting */}
                <span
                    style={{
                        fontFamily:
                            "var(--font-display, 'Cormorant Garamond', serif)",
                        fontSize: "1.05rem",
                        color: "var(--dash-text-primary, #f0e8d8)",
                        fontWeight: 400,
                    }}
                >
                    {greeting}
                </span>

                {/* Right: edit + profile */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 14px",
                            border: "1px solid var(--dash-border, rgba(223,208,184,0.10))",
                            borderRadius: 8,
                            background: "rgba(255,255,255,0.04)",
                            color: "var(--dash-text-muted, rgba(240,232,216,0.45))",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            transition:
                                "background 0.15s, color 0.15s, border-color 0.15s",
                        }}
                        onClick={onEdit}
                    >
                        ✎ Edit Dashboard
                    </button>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background:
                                "var(--dash-bg-widget, rgba(36,28,18,0.93))",
                            border: "1px solid var(--dash-border-hover, rgba(223,208,184,0.26))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--dash-accent, #dfd0b8)",
                            cursor: "pointer",
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    </div>
                </div>
            </header>

            {/* Shared navigation drawer */}
            {drawerOpen && <AppDrawer onClose={() => setDrawerOpen(false)} />}
        </>
    );
}
