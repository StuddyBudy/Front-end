import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

// ── HYDRATION FLAG ────────────────────────────────────────────────────────────
// false during prerender and the client's hydration render, true right after —
// the useSyncExternalStore equivalent of a `mounted` flag, without setState in
// an effect. Gate client-only values (e.g. `new Date()`) behind it; memoize
// anything derived so references stay stable across renders.
export function useHydrated(): boolean {
    return useSyncExternalStore(emptySubscribe, getTrue, getFalse);
}
