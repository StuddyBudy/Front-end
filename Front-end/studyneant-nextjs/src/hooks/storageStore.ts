import { useSyncExternalStore } from "react";

// ── LOCALSTORAGE-BACKED EXTERNAL STORE ────────────────────────────────────────
// localStorage is an external system, so components read it through
// useSyncExternalStore instead of setState-in-a-mount-effect. React renders
// `server` during prerender AND the client's hydration render (so the static
// HTML always matches), then immediately re-renders with the real snapshot —
// hydration safety is built into the primitive.
//
// Rules the implementation must keep:
// - getSnapshot returns a CACHED reference; a fresh object per call would
//   make React re-render forever.
// - No localStorage writes during render: load() must only read. All writes
//   go through set(), which persists and notifies subscribers.

export type StorageStore<T> = {
    subscribe: (listener: () => void) => () => void;
    getSnapshot: () => T;
    getServerSnapshot: () => T;
    set: (next: T | ((prev: T) => T)) => void;
};

export function createStorageStore<T>(opts: {
    /** Read + parse the persisted value (client only, called lazily once). */
    load: () => T;
    /** Write the value to localStorage. */
    persist: (value: T) => void;
    /** Deterministic value for the prerender / hydration render. */
    server: T;
}): StorageStore<T> {
    const { load, persist, server } = opts;
    const listeners = new Set<() => void>();
    let cache = server;
    let hydrated = false;

    const getSnapshot = () => {
        if (!hydrated) {
            cache = load();
            hydrated = true;
        }
        return cache;
    };

    return {
        subscribe(listener) {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
        getSnapshot,
        getServerSnapshot: () => server,
        set(next) {
            const prev = getSnapshot();
            cache =
                typeof next === "function"
                    ? (next as (p: T) => T)(prev)
                    : next;
            persist(cache);
            listeners.forEach((l) => l());
        },
    };
}

/** [value, set] — drop-in shape for the useState pairs the stores replace. */
export function useStorageStore<T>(
    store: StorageStore<T>,
): [T, StorageStore<T>["set"]] {
    const value = useSyncExternalStore(
        store.subscribe,
        store.getSnapshot,
        store.getServerSnapshot,
    );
    return [value, store.set];
}
