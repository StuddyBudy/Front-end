"use client";

import { useState, useEffect } from "react";

// ── useClock ──────────────────────────────────────────────────────────────────
// Returns a live Date that ticks every second, or null before the first
// client-side effect runs. The null initial value is deliberate: it is
// identical on the server prerender and the client's hydration render, so
// the clock can never cause a hydration mismatch. Callers render a
// placeholder until it resolves.
export function useClock(): Date | null {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
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
