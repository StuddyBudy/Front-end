"use client";

import { useState, useEffect } from "react";

// ── useClock ──────────────────────────────────────────────────────────────────
// Returns a live Date that ticks every second.
// Safe for Next.js — initialises from new Date() on the client only.
export function useClock(): Date {
    const [now, setNow] = useState<Date>(() => new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return now;
}

// ── getGreeting ───────────────────────────────────────────────────────────────
export function getGreeting(d: Date): string {
    const h = d.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}
