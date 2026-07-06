"use client";

import { useSyncExternalStore } from "react";

// ── useClock ──────────────────────────────────────────────────────────────────
// Returns a live Date that ticks every second, or null on the server prerender
// and the client's hydration render (identical on both, so the clock can never
// cause a hydration mismatch — callers render a placeholder until it resolves).
// Implemented as a module-level external store: one shared interval drives all
// subscribers, and useSyncExternalStore swaps null → real Date after hydration.
const listeners = new Set<() => void>();
let now: Date | null = null;
let timer: ReturnType<typeof setInterval> | null = null;

function tick() {
    now = new Date();
    listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    if (!timer) {
        now = new Date(); // refresh in case the cache went stale while idle
        timer = setInterval(tick, 1000);
    }
    return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && timer) {
            clearInterval(timer);
            timer = null;
        }
    };
}

// Cached between ticks — getSnapshot must return a stable reference.
function getSnapshot(): Date | null {
    if (!now) now = new Date();
    return now;
}

const getServerSnapshot = () => null;

export function useClock(): Date | null {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ── getGreeting ───────────────────────────────────────────────────────────────
export function getGreeting(d: Date): string {
    const h = d.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}
