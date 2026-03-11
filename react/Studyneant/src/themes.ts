import type { ThemeDef } from "./types";

// ── BUILT-IN THEMES ───────────────────────────────────────────────────────────
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

// ── APPLY THEME ───────────────────────────────────────────────────────────────
// Writes all theme CSS variables onto :root so every component picks them up
export function applyTheme(theme: ThemeDef): void {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) =>
        root.style.setProperty(k, v),
    );
}
