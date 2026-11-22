/**
 * Tiny localStorage persistence layer.
 *
 * This keeps the app fully self-contained (no backend required). Everything a
 * user logs lives in their own browser. To move to a real backend later,
 * replace the functions here with API calls — nothing else needs to change.
 */

export const STORE = {
  users: "lunara:users",
  session: "lunara:session",
  data: (userId: string) => `lunara:data:${userId}`,
};

const isBrowser = (): boolean => typeof window !== "undefined";

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function removeKey(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
