"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { addDays, fromKey, toKey } from "./date";
import { STORE, readJSON, removeKey, writeJSON } from "./storage";
import type { DayLog, Profile, User, UserData } from "./types";

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  ready: boolean;
  user: User | null;
  data: UserData | null;
  signup: (name: string, email: string, password: string) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  saveLog: (date: string, patch: Partial<DayLog>) => void;
  logPeriod: (startKey: string, length: number) => void;
  deleteLog: (date: string) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  clearData: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Demo-only password scramble. NOT real security — use a server in production. */
function hashPassword(password: string): string {
  let hash = 5381;
  for (let i = 0; i < password.length; i += 1) {
    hash = ((hash << 5) + hash) ^ password.charCodeAt(i);
  }
  return `${(hash >>> 0).toString(36)}-${password.length}`;
}

function emptyData(name: string): UserData {
  return {
    profile: { name, cycleLength: 28, periodLength: 5, reminders: true },
    logs: {},
  };
}

function isBlank(log: DayLog): boolean {
  return !log.flow && log.symptoms.length === 0 && log.moods.length === 0 && !log.notes?.trim();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<UserData | null>(null);
  const userIdRef = useRef<string | null>(null);

  // Hydrate from localStorage after mount so server and client markup match.
  useEffect(() => {
    const sessionId = readJSON<string | null>(STORE.session, null);
    if (sessionId) {
      const users = readJSON<User[]>(STORE.users, []);
      const found = users.find((u) => u.id === sessionId) ?? null;
      if (found) {
        userIdRef.current = found.id;
        setUser(found);
        setData(readJSON<UserData>(STORE.data(found.id), emptyData(found.name)));
      } else {
        removeKey(STORE.session);
      }
    }
    setReady(true);
  }, []);

  /** Apply an update against the freshest state, then persist it. */
  const persist = useCallback((updater: (prev: UserData) => UserData) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      if (userIdRef.current) writeJSON(STORE.data(userIdRef.current), next);
      return next;
    });
  }, []);

  const signup = useCallback((name: string, email: string, password: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim()) return { ok: false, error: "Please enter your name." };
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return { ok: false, error: "That email doesn't look right." };
    if (password.length < 6) return { ok: false, error: "Password needs at least 6 characters." };

    const users = readJSON<User[]>(STORE.users, []);
    if (users.some((u) => u.email === cleanEmail)) {
      return { ok: false, error: "An account with that email already exists." };
    }

    const newUser: User = {
      id: `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    const fresh = emptyData(newUser.name);
    writeJSON(STORE.users, [...users, newUser]);
    writeJSON(STORE.data(newUser.id), fresh);
    writeJSON(STORE.session, newUser.id);
    userIdRef.current = newUser.id;
    setUser(newUser);
    setData(fresh);
    return { ok: true };
  }, []);

  const login = useCallback((email: string, password: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    const users = readJSON<User[]>(STORE.users, []);
    const found = users.find((u) => u.email === cleanEmail);
    if (!found) return { ok: false, error: "No account found with that email." };
    if (found.passwordHash !== hashPassword(password)) {
      return { ok: false, error: "Incorrect password. Try again." };
    }
    writeJSON(STORE.session, found.id);
    userIdRef.current = found.id;
    setUser(found);
    setData(readJSON<UserData>(STORE.data(found.id), emptyData(found.name)));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    removeKey(STORE.session);
    userIdRef.current = null;
    setUser(null);
    setData(null);
  }, []);

  const saveLog = useCallback(
    (date: string, patch: Partial<DayLog>) => {
      persist((prev) => {
        const previous: DayLog = prev.logs[date] ?? { date, symptoms: [], moods: [] };
        const merged: DayLog = {
          ...previous,
          ...patch,
          date,
          symptoms: patch.symptoms ?? previous.symptoms ?? [],
          moods: patch.moods ?? previous.moods ?? [],
        };

        const logs = { ...prev.logs };
        if (isBlank(merged)) delete logs[date];
        else logs[date] = merged;

        return { ...prev, logs };
      });
    },
    [persist]
  );

  const logPeriod = useCallback(
    (startKey: string, length: number) => {
      persist((prev) => {
        const logs = { ...prev.logs };
        const start = fromKey(startKey);
        for (let i = 0; i < Math.max(1, length); i += 1) {
          const key = toKey(addDays(start, i));
          const existing = logs[key] ?? { date: key, symptoms: [], moods: [] };
          logs[key] = {
            ...existing,
            date: key,
            flow: i === 0 ? "heavy" : i === length - 1 ? "light" : "medium",
          };
        }
        return { ...prev, logs };
      });
    },
    [persist]
  );

  const deleteLog = useCallback(
    (date: string) => {
      persist((prev) => {
        const logs = { ...prev.logs };
        delete logs[date];
        return { ...prev, logs };
      });
    },
    [persist]
  );

  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      persist((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
    },
    [persist]
  );

  const clearData = useCallback(() => {
    persist((prev) => ({ ...emptyData(prev.profile.name), profile: prev.profile }));
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      user,
      data,
      signup,
      login,
      logout,
      saveLog,
      logPeriod,
      deleteLog,
      updateProfile,
      clearData,
    }),
    [ready, user, data, signup, login, logout, saveLog, logPeriod, deleteLog, updateProfile, clearData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
