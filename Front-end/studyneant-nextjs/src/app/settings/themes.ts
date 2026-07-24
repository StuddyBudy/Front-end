import type { ThemeDef } from "@/app/dashboard/types";

// variable documentation:

/*

// main background color
            "--dash-bg-page": 

            //background for widgets, pfp, content containers
            "--dash-bg-widget": 

            //selected btns, widget header
            "--dash-bg-handle": 

            //slide-out side drawer background
            "--dash-bg-sidebar":

            //top navigation bar background
            "--dash-topbar-bg": 

            //bottom navigation bar background
            "--dash-bottomnav-bg":

            //hover highlight on nav items + ghost btns
            "--dash-nav-hover-bg":

            //secondary text + decorative accents
            "--dash-accent": 

            //main highlight / action color
            "--dash-accent-warm": 

            //glow/shadow tint around active ui
            "--dash-accent-glow": 

            //text on filled accent btns (save, +, badges)
            "--dash-btn-text":

            //main readable text color
            "--dash-text-primary": 

            //dimmed secondary text, labels
            "--dash-text-muted": 

            //default border on cards/inputs
            "--dash-border": 

            //border color on hover/focus
            "--dash-border-hover": 

            //radient circle bg glow
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.15), transparent 44%), radial-gradient(circle at 82% 8%, rgba(0,0,0,0.5), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.42) 100%)",
       

*/

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
            "--dash-bg-sidebar": "rgba(255,255,255,0.92)",
            "--dash-topbar-bg": "rgba(255,255,255,0.68)",
            "--dash-bottomnav-bg": "rgba(255,255,255,0.68)",
            "--dash-nav-hover-bg": "rgba(0,0,0,0.06)",
            "--dash-accent": "#2f2619",
            "--dash-accent-warm": "#c46a00",
            "--dash-accent-glow": "rgba(196,106,0,0.18)",
            "--dash-btn-text": "#111111",
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
            "--dash-bg-page": "#000000",
            "--dash-bg-widget": "rgba(16,18,24,0.94)",
            "--dash-bg-handle": "rgba(22,26,34,0.98)",
            "--dash-bg-sidebar": "rgba(16,18,24,0.94)",
            "--dash-topbar-bg": "rgba(0,0,0,0.28)",
            "--dash-bottomnav-bg": "rgba(0,0,0,0.28)",
            "--dash-nav-hover-bg": "rgba(255,255,255,0.09)",
            "--dash-accent": "#b8c5df",
            "--dash-accent-warm": "#93BAF3",
            "--dash-accent-glow": "rgba(147,186,243,0.22)",
            "--dash-btn-text": "#111111",
            "--dash-text-primary": "#e2e8f0",
            "--dash-text-muted": "rgba(226,232,240,0.52)",
            "--dash-border": "rgba(226,232,240,0.12)",
            "--dash-border-hover": "rgba(226,232,240,0.28)",
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(109,157,255,0.20), transparent 44%), radial-gradient(circle at 82% 8%, rgba(0,0,0,0.50), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.42) 100%)",
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
            "--dash-bg-sidebar": "rgba(24,18,14,0.94)",
            "--dash-topbar-bg": "rgba(0,0,0,0.28)",
            "--dash-bottomnav-bg": "rgba(0,0,0,0.28)",
            "--dash-nav-hover-bg": "rgba(255,255,255,0.09)",
            "--dash-accent": "#dfd0b8",
            "--dash-accent-warm": "#de8900",
            "--dash-accent-glow": "rgba(126,122,116,0.22)",
            "--dash-btn-text": "#111111",
            "--dash-text-primary": "#f2eadc",
            "--dash-text-muted": "rgba(242,234,220,0.52)",
            "--dash-border": "rgba(223,208,184,0.12)",
            "--dash-border-hover": "rgba(223,208,184,0.28)",
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(222,137,0,0.2), transparent 44%), radial-gradient(circle at 82% 8%, rgba(0,0,0,0.5), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.42) 100%)",
        },
    },
    starry: {
        id: "starry",
        name: "Starry",
        label: "✨",
        vars: {
            "--dash-bg-page": "#130623",
            "--dash-bg-widget": "rgba(16,13,28,0.94)",
            "--dash-bg-handle": "rgba(24,19,40,0.98)",
            "--dash-bg-sidebar": "rgba(16,13,28,0.94)",
            //-------------

            //slightly transparent for now
            "--dash-topbar-bg": "ffe600, rgba(0, 0, 0, 0.28)",
            "--dash-bottomnav-bg": "ffe600, rgba(0, 0, 0, 0.28)",

            //---------------
            "--dash-nav-hover-bg": "rgba(255,255,255,0.09)",
            "--dash-accent": "#d4d0f5",
            "--dash-accent-warm": "#d9c782",
            "--dash-accent-glow": "rgba(255,215,0,0.22)",
            "--dash-btn-text": "#111111",
            "--dash-text-primary": "#eae7f5",
            "--dash-text-muted": "rgba(242,240,252,0.52)",
            "--dash-border": "rgba(212,208,245,0.12)",
            "--dash-border-hover": "rgba(212,208,245,0.28)",
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.15), transparent 44%), radial-gradient(circle at 82% 8%, rgba(0,0,0,0.5), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.42) 100%)",
        },
    },
    /*
    midnight: {
        id: "midnight",
        name: "Midnight",
        label: "🌙",
        vars: {
            "--dash-bg-page": "#050b14",
            "--dash-bg-widget": "rgba(10,18,38,0.95)",
            "--dash-bg-handle": "rgba(15,25,48,0.98)",
            "--dash-bg-sidebar": "rgba(10,18,38,0.95)",
            "--dash-topbar-bg": "rgba(2,6,18,0.34)",
            "--dash-bottomnav-bg": "rgba(2,6,18,0.34)",
            "--dash-nav-hover-bg": "rgba(255,255,255,0.09)",
            "--dash-accent": "#a8b8d8",
            "--dash-accent-warm": "#6d9dff",
            "--dash-accent-glow": "rgba(109,157,255,0.24)",
            "--dash-btn-text": "#111111",
            "--dash-text-primary": "#dce6f5",
            "--dash-text-muted": "rgba(220,230,245,0.45)",
            "--dash-border": "rgba(168,184,216,0.10)",
            "--dash-border-hover": "rgba(168,184,216,0.26)",
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(109,157,255,0.20), transparent 44%), radial-gradient(circle at 82% 8%, rgba(0,0,0,0.50), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.42) 100%)",
        },
    },
    */
    emerald: {
        id: "emerald",
        name: "Emerald",
        label: "🌿",
        vars: {
            "--dash-bg-page": "#0c120e",
            "--dash-bg-widget": "rgba(20,30,22,0.95)",
            "--dash-bg-handle": "rgba(24,36,26,0.97)",
            "--dash-bg-sidebar": "rgba(20,30,22,0.95)",
            "--dash-topbar-bg": "rgba(2,12,6,0.32)",
            "--dash-bottomnav-bg": "rgba(2,12,6,0.32)",
            "--dash-nav-hover-bg": "rgba(255,255,255,0.09)",
            "--dash-accent": "#a8cbb0",
            "--dash-accent-warm": "#4caf78",
            "--dash-accent-glow": "rgba(76,175,120,0.22)",
            "--dash-btn-text": "#111111",
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
            "--dash-bg-sidebar": "rgba(26,12,12,0.93)",
            "--dash-topbar-bg": "rgba(20,0,0,0.32)",
            "--dash-bottomnav-bg": "rgba(20,0,0,0.32)",
            "--dash-nav-hover-bg": "rgba(255,255,255,0.09)",
            "--dash-accent": "#d4a0a0",
            "--dash-accent-warm": "#e05555",
            "--dash-accent-glow": "rgba(224,85,85,0.22)",
            "--dash-btn-text": "#111111",
            "--dash-text-primary": "#f5dada",
            "--dash-text-muted": "rgba(245,218,218,0.45)",
            "--dash-border": "rgba(212,160,160,0.10)",
            "--dash-border-hover": "rgba(212,160,160,0.26)",
            "--dash-bg-image":
                "radial-gradient(circle at 50% 50%, rgba(224,85,85,0.2), transparent 44%), radial-gradient(circle at 82% 8%, rgba(0,0,0,0.5), transparent 40%), radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.42) 100%)",
        },
    },
}; // ── APPLY THEME ───────────────────────────────────────────────────────────────
// Writes CSS variables onto :root — safe to call only client-side.
// Uses --dash-* prefix to avoid colliding with the landing page tokens.
export function applyTheme(theme: ThemeDef): void {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) =>
        root.style.setProperty(k, v),
    );
}
