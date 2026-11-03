type Listener = () => void;
type StorageArea = "local" | "session";

function getStorage(area: StorageArea): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return area === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Small external store synced with local/session storage, read via
 * useSyncExternalStore so the server snapshot (seed) matches hydration
 * and the real value swaps in on the client without a setState-in-effect.
 */
export function createSyncedStore<T>(key: string, seed: T, area: StorageArea = "local") {
  let data: T = seed;
  let hydrated = false;
  const listeners = new Set<Listener>();

  function hydrate() {
    if (hydrated) return;
    hydrated = true;
    const storage = getStorage(area);
    if (!storage) return;
    try {
      const raw = storage.getItem(key);
      if (raw !== null) data = JSON.parse(raw) as T;
    } catch {
      // valor inválido o storage no disponible: se mantiene el seed
    }
  }

  function getSnapshot(): T {
    hydrate();
    return data;
  }

  function getServerSnapshot(): T {
    return seed;
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function set(next: T) {
    data = next;
    hydrated = true;
    const storage = getStorage(area);
    try {
      storage?.setItem(key, JSON.stringify(next));
    } catch {
      // almacenamiento lleno o no disponible: se ignora en este mockup
    }
    listeners.forEach((listener) => listener());
  }

  return { getSnapshot, getServerSnapshot, subscribe, set };
}
