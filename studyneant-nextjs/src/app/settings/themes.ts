import type { ThemeDef } from "../dashboard/types";

// ── BUILT-IN THEMES ───────────────────────────────────────────────────────────
export const BUILT_IN_THEMES: Record<string, ThemeDef> = {
    light: {
        id: "light",
        name: "Light",
        label: "⚪",
        vars: {
            "--dash-bg-page": "#f8f7f4",
            "--dash-bg-widget": "rgba(255,255,255,0.92)",
            "--dash-bg-handle": "rgba(240,236,228,0.98)",
            "--dash-accent": "#2f2619",
            "--dash-accent-warm": "#c46a00",
            "--dash-accent-glow": "rgba(196,106,0,0.18)",
            "--dash-text-primary": "#2b241a",
            "--dash-text-muted": "rgba(43,36,26,0.6)",
            "--dash-border": "rgba(0,0,0,0.08)",
            "--dash-border-hover": "rgba(0,0,0,0.14)",
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(120,120,120,0.24), transparent 44%), radial-gradient(circle at 82% 8%, rgba(120,120,120,0.18), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(90,90,90,0.14) 100%)",
        },
    },
    dark: {
        id: "dark",
        name: "Dark",
        label: "⚫",
        vars: {
            "--dash-bg-page": "#0f0c0a",
            "--dash-bg-widget": "rgba(24,18,14,0.94)",
            "--dash-bg-handle": "rgba(36,26,18,0.98)",
            "--dash-accent": "#dfd0b8",
            "--dash-accent-warm": "#de8900",
            "--dash-accent-glow": "rgba(126, 122, 116, 0.22)",
            "--dash-text-primary": "#f2eadc",
            "--dash-text-muted": "rgba(242,234,220,0.52)",
            "--dash-border": "rgba(223,208,184,0.12)",
            "--dash-border-hover": "rgba(223,208,184,0.28)",
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(222,137,0,0.2), transparent 44%), radial-gradient(circle at 82% 8%, rgba(0,0,0,0.5), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.42) 100%)",
        },
    },
    ember: {
        id: "ember",
        name: "Ember",
        label: "🔥",
        vars: {
            "--dash-bg-page": "#16120e",
            "--dash-bg-widget": "rgba(24,18,14,0.94)",
            "--dash-bg-handle": "rgba(36,26,18,0.98)",
            "--dash-accent": "#dfd0b8",
            "--dash-accent-warm": "#de8900",
            "--dash-accent-glow": "rgba(126,122,116,0.22)",
            "--dash-text-primary": "#f2eadc",
            "--dash-text-muted": "rgba(242,234,220,0.52)",
            "--dash-border": "rgba(223,208,184,0.12)",
            "--dash-border-hover": "rgba(223,208,184,0.28)",
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(222,137,0,0.2), transparent 44%), radial-gradient(circle at 82% 8%, rgba(0,0,0,0.5), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.42) 100%)",
        },
    },
    midnight: {
        id: "midnight",
        name: "Midnight",
        label: "🌙",
        vars: {
            "--dash-bg-page": "#0a0f1a",
            "--dash-bg-widget": "rgba(13,19,34,0.95)",
            "--dash-bg-handle": "rgba(19,27,45,0.98)",
            "--dash-accent": "#a8b8d8",
            "--dash-accent-warm": "#6d9dff",
            "--dash-accent-glow": "rgba(109,157,255,0.24)",
            "--dash-text-primary": "#dce6f5",
            "--dash-text-muted": "rgba(220,230,245,0.45)",
            "--dash-border": "rgba(168,184,216,0.10)",
            "--dash-border-hover": "rgba(168,184,216,0.26)",
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(109,157,255,0.20), transparent 44%), radial-gradient(circle at 82% 8%, rgba(0,0,0,0.50), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.42) 100%)",
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
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(76,175,120,0.2), transparent 44%), radial-gradient(circle at 82% 8%, rgba(0,0,0,0.5), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.42) 100%)",
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
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(224,85,85,0.2), transparent 44%), radial-gradient(circle at 82% 8%, rgba(0,0,0,0.5), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.42) 100%)",
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
