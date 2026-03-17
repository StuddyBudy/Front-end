import type { ThemeDef } from "./types";

// ── BUILT-IN THEMES ───────────────────────────────────────────────────────────
export const BUILT_IN_THEMES: Record<string, ThemeDef> = {
    ember: {
        id: "ember",
        name: "Ember",
        label: "🔥",
        vars: {
            "--dash-bg-page": "#16120e",
            "--dash-bg-widget": "rgba(30,24,16,0.93)",
            "--dash-bg-handle": "rgba(44,35,22,0.97)",
            "--dash-accent": "#dfd0b8",
            "--dash-accent-warm": "#de8900",
            "--dash-accent-glow": "rgba(222,137,0,0.22)",
            "--dash-text-primary": "#f0e8d8",
            "--dash-text-muted": "rgba(240,232,216,0.45)",
            "--dash-border": "rgba(223,208,184,0.10)",
            "--dash-border-hover": "rgba(223,208,184,0.26)",
        },
    },
    midnight: {
        id: "midnight",
        name: "Midnight",
        label: "🌙",
        vars: {
            "--dash-bg-page": "#0d0f14",
            "--dash-bg-widget": "rgba(15,19,28,0.93)",
            "--dash-bg-handle": "rgba(20,26,40,0.97)",
            "--dash-accent": "#a8b8d8",
            "--dash-accent-warm": "#5b8dee",
            "--dash-accent-glow": "rgba(91,141,238,0.22)",
            "--dash-text-primary": "#dce6f5",
            "--dash-text-muted": "rgba(220,230,245,0.45)",
            "--dash-border": "rgba(168,184,216,0.10)",
            "--dash-border-hover": "rgba(168,184,216,0.26)",
        },
    },
    forest: {
        id: "forest",
        name: "Forest",
        label: "🌿",
        vars: {
            "--dash-bg-page": "#0c120e",
            "--dash-bg-widget": "rgba(14,22,16,0.93)",
            "--dash-bg-handle": "rgba(18,30,20,0.97)",
            "--dash-accent": "#a8cbb0",
            "--dash-accent-warm": "#4caf78",
            "--dash-accent-glow": "rgba(76,175,120,0.22)",
            "--dash-text-primary": "#d8edd8",
            "--dash-text-muted": "rgba(216,237,216,0.45)",
            "--dash-border": "rgba(168,203,176,0.10)",
            "--dash-border-hover": "rgba(168,203,176,0.26)",
        },
    },
    crimson: {
        id: "crimson",
        name: "Crimson",
        label: "🩸",
        vars: {
            "--dash-bg-page": "#140a0a",
            "--dash-bg-widget": "rgba(26,12,12,0.93)",
            "--dash-bg-handle": "rgba(38,16,16,0.97)",
            "--dash-accent": "#d4a0a0",
            "--dash-accent-warm": "#e05555",
            "--dash-accent-glow": "rgba(224,85,85,0.22)",
            "--dash-text-primary": "#f5dada",
            "--dash-text-muted": "rgba(245,218,218,0.45)",
            "--dash-border": "rgba(212,160,160,0.10)",
            "--dash-border-hover": "rgba(212,160,160,0.26)",
        },
    },
};

// ── APPLY THEME ───────────────────────────────────────────────────────────────
// Writes CSS variables onto :root — safe to call only client-side.
// Uses --dash-* prefix to avoid colliding with the landing page tokens.
export function applyTheme(theme: ThemeDef): void {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) =>
        root.style.setProperty(k, v),
    );
}
