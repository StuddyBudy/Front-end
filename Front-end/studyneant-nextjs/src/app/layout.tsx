import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

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
        <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
            <body>{children}</body>
        </html>
    );
}
