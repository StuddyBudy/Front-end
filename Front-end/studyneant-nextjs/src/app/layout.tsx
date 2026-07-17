import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

import ThemeApplier from "@/components/themeApplier/ThemeApplier";

// ── PRE-PAINT THEME REPLAY ────────────────────────────────────────────────────
// Inlined into <head> so it runs before first paint on a hard refresh: replays
// the --dash-* vars that ThemeApplier cached on the last visit, so no route
// flashes the default theme. The storage key is the literal value of
// THEME_VARS_CACHE_KEY in components/themeApplier/ThemeApplier.tsx (a client
// module — its exports can't be imported into this server component).
const THEME_REPLAY_SCRIPT = `(function(){try{var s=localStorage.getItem("studyos_theme_vars");if(!s)return;var v=JSON.parse(s);for(var k in v){if(k.indexOf("--dash-")===0&&typeof v[k]==="string"){document.documentElement.style.setProperty(k,v[k]);}}}catch(e){}})();`;

// ── FONTS ─────────────────────────────────────────────────────────────────────
const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-display",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    variable: "--font-body",
    display: "swap",
});

// ── METADATA ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    title: "Studyneant",
    description:
        "Grades, notes, to-dos, and a full weekly schedule — all in one beautiful dashboard.",
};

// ── LAYOUT ────────────────────────────────────────────────────────────────────
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // suppressHydrationWarning: the replay script mutates <html>'s style
        // attribute before React hydrates (same pattern as next-themes).
        <html
            lang="en"
            className={`${cormorant.variable} ${outfit.variable}`}
            suppressHydrationWarning
        >
            <head>
                <script
                    dangerouslySetInnerHTML={{ __html: THEME_REPLAY_SCRIPT }}
                />
            </head>
            <body>
                <ThemeApplier />
                {children}
            </body>
        </html>
    );
}
