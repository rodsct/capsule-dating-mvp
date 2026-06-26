"use client";

import { useCallback, useEffect, useState } from "react";
import type { AuthUser, MatchRecord } from "@/lib/types";

const USERS_KEY = "capsule-dating:users";
const SESSION_KEY = "capsule-dating:session";
const MATCHES_KEY = "capsule-dating:matches";
const DEMO_FLAG_KEY = "capsule-dating:demo-seeded";
const STARTING_CREDITS = 3;
const DEMO_CREDITS = 10;
const DEMO_USERNAME = "demo_capsuler";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  return safeParse<AuthUser[]>(localStorage.getItem(USERS_KEY), []);
}

function writeUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Get the logged-in user id (string) or null. */
function readSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

function writeSessionId(id: string | null) {
  if (id === null) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, id);
}

/** Seed a demo user with 10 credits and a few pre-opened matches on first visit. */
function ensureDemoUser() {
  if (typeof window === "undefined") return;
  const alreadySeeded = localStorage.getItem(DEMO_FLAG_KEY) === "1";
  if (alreadySeeded) return;

  const users = readUsers();
  let demo = users.find((u) => u.username === DEMO_USERNAME);
  if (!demo) {
    demo = {
      id: `u-demo-${Math.random().toString(36).slice(2, 8)}`,
      username: DEMO_USERNAME,
      credits: DEMO_CREDITS,
      createdAt: Date.now(),
    };
    users.push(demo);
    writeUsers(users);
  }
  // Pre-seed a few matches for the demo account so /profile/me feels alive.
  const seededPeople = ["p-otaku-1", "p-rock-2", "p-art-1"];
  const existing = safeParse<MatchRecord[]>(localStorage.getItem(MATCHES_KEY), []);
  const now = Date.now();
  const additions: MatchRecord[] = seededPeople
    .filter((pid) => !existing.some((m) => m.personId === pid))
    .map((pid, i) => ({ personId: pid, openedAt: now - (i + 1) * 60_000 }));
  if (additions.length) {
    localStorage.setItem(MATCHES_KEY, JSON.stringify([...additions, ...existing]));
  }
  // auto-create session for the demo user
  writeSessionId(demo.id);
  localStorage.setItem(DEMO_FLAG_KEY, "1");
}

export interface Auth {
  user: AuthUser | null;
  ready: boolean;
  register: (username: string) => AuthUser;
  login: (username: string) => AuthUser | null;
  logout: () => void;
  addCredits: (amount: number) => void;
  spendCredit: () => boolean;
  recordMatch: (personId: string) => void;
  matches: MatchRecord[];
}

export function useAuth(): Auth {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [matches, setMatches] = useState<MatchRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    ensureDemoUser();
    const id = readSessionId();
    const found = id ? readUsers().find((u) => u.id === id) ?? null : null;
    if (!found && id) writeSessionId(null);
    const savedMatches = safeParse<MatchRecord[]>(
      localStorage.getItem(MATCHES_KEY),
      [],
    );
    if (!cancelled) {
      setUser(found);
      setMatches(savedMatches);
      setReady(true);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const persistUser = useCallback((next: AuthUser | null) => {
    if (!next) {
      setUser(null);
      return;
    }
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === next.id);
    if (idx >= 0) users[idx] = next;
    else users.push(next);
    writeUsers(users);
    setUser(next);
  }, []);

  const register = useCallback(
    (username: string) => {
      const trimmed = username.trim();
      const users = readUsers();
      const existing = users.find((u) => u.username === trimmed);
      if (existing) {
        writeSessionId(existing.id);
        persistUser(existing);
        return existing;
      }
      const newUser: AuthUser = {
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        username: trimmed,
        credits: STARTING_CREDITS,
        createdAt: Date.now(),
      };
      users.push(newUser);
      writeUsers(users);
      writeSessionId(newUser.id);
      setUser(newUser);
      return newUser;
    },
    [persistUser],
  );

  const login = useCallback((username: string) => {
    const trimmed = username.trim();
    const found = readUsers().find((u) => u.username === trimmed) ?? null;
    if (!found) return null;
    writeSessionId(found.id);
    setUser(found);
    return found;
  }, []);

  const logout = useCallback(() => {
    writeSessionId(null);
    setUser(null);
  }, []);

  const addCredits = useCallback(
    (amount: number) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, credits: prev.credits + amount };
        persistUser(next);
        return next;
      });
    },
    [persistUser],
  );

  const spendCredit = useCallback(() => {
    let ok = false;
    setUser((prev) => {
      if (!prev) return prev;
      if (prev.credits <= 0) return prev;
      ok = true;
      const next = { ...prev, credits: prev.credits - 1 };
      persistUser(next);
      return next;
    });
    return ok;
  }, [persistUser]);

  const recordMatch = useCallback((personId: string) => {
    setMatches((prev) => {
      const record: MatchRecord = { personId, openedAt: Date.now() };
      const next = [record, ...prev];
      localStorage.setItem(MATCHES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    user,
    ready,
    register,
    login,
    logout,
    addCredits,
    spendCredit,
    recordMatch,
    matches,
  };
}