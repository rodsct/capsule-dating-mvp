"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type {
  AuthUser,
  ChatMessage,
  MachineId,
  OwnCapsule,
  PurchaseRecord,
  SlotPlacement,
} from "@/lib/types";
import { seedPlacements, SLOTS_COUNT } from "@/data/mock-data";

const USERS_KEY = "cdx:users";
const SESSION_KEY = "cdx:session";
const PLACEMENTS_KEY = "cdx:placements";
const PURCHASES_KEY = "cdx:purchases";
const CHATS_KEY = "cdx:chats";
const OWN_CAPSULE_KEY = "cdx:own-capsule";
const SEEDED_KEY = "cdx:seeded";

const STARTING_CREDITS = 1;
/** How much a "buy" or "place" action costs in créditos. */
const ACTION_COST = 1;

const CDMX: MachineId = "cdmx";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type Read<T> = (raw: string | null) => T;
const readJSON =
  <T>(fallback: T): Read<T> =>
  (raw) =>
    safeParse<T>(raw, fallback);

function readUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  const users = readJSON<AuthUser[]>([])(localStorage.getItem(USERS_KEY));
  // One-time migration: old installs stored the balance as `monedas`.
  // Copy any stale `monedas` field into `credits` and drop the legacy key.
  let mutated = false;
  for (const u of users) {
    const legacy = (u as unknown as { monedas?: number }).monedas;
    if (typeof legacy === "number" && (!("credits" in u) || u.credits == null)) {
      u.credits = legacy;
      mutated = true;
    }
    if ("monedas" in (u as object)) {
      delete (u as Partial<{ monedas?: number }>).monedas;
      mutated = true;
    }
  }
  if (mutated) writeUsers(users);
  return users;
}

function writeUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readPlacements(): SlotPlacement[] {
  if (typeof window === "undefined") return [];
  return readJSON<SlotPlacement[]>([])(localStorage.getItem(PLACEMENTS_KEY));
}

function writePlacements(rows: SlotPlacement[]) {
  localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(rows));
}

function readPurchases(): PurchaseRecord[] {
  if (typeof window === "undefined") return [];
  return readJSON<PurchaseRecord[]>([])(localStorage.getItem(PURCHASES_KEY));
}

function writePurchases(rows: PurchaseRecord[]) {
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(rows));
}

function readChats(): Record<string, ChatMessage[]> {
  if (typeof window === "undefined") return {};
  return readJSON<Record<string, ChatMessage[]>>({})(
    localStorage.getItem(CHATS_KEY),
  );
}

function writeChats(chats: Record<string, ChatMessage[]>) {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

function readOwnCapsule(): OwnCapsule | null {
  if (typeof window === "undefined") return null;
  return readJSON<OwnCapsule | null>(null)(
    localStorage.getItem(OWN_CAPSULE_KEY),
  );
}

function writeOwnCapsule(c: OwnCapsule | null) {
  if (!c) localStorage.removeItem(OWN_CAPSULE_KEY);
  else localStorage.setItem(OWN_CAPSULE_KEY, JSON.stringify(c));
}

function writeSessionId(id: string | null) {
  if (id === null) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, id);
}

/**
 * First-run seeding: pre-populate the CDMX machine with demo capsules so it
 * never looks empty. No demo user and no auto-session are created anymore —
 * users must authenticate via Google (or the username fallback) to play.
 */
function ensurePlacementsSeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY) === "1") return;
  if (readPlacements().length === 0) {
    writePlacements(seedPlacements());
  }
  localStorage.setItem(SEEDED_KEY, "1");
}

/**
 * Find or create a local AuthUser tied to an authenticated NextAuth session.
 * Google users are keyed by their stable session id (the Google `sub`),
 * username-fallback users by `local:<username>`. New users start with the
 * welcome credit (1 crédito). Returns the local user (after persisting).
 */
export function syncSessionToLocalUser(
  id: string,
  name: string | null | undefined,
  email: string | null | undefined,
): AuthUser {
  const users = readUsers();
  let found = users.find((u) => u.id === id) ?? null;
  if (!found) {
    const username = (name ?? email ?? "cápsula").toString();
    found = {
      id,
      username,
      credits: STARTING_CREDITS,
      createdAt: Date.now(),
    };
    users.push(found);
    writeUsers(users);
  }
  writeSessionId(found.id);
  return found;
}

export interface GameStore {
  ready: boolean;
  /** Auth.js session status, mirrored here for convenience. */
  status: "loading" | "authenticated" | "unauthenticated";
  user: AuthUser | null;
  /** Shortcut to user.credits (0 when not signed in). */
  credits: number;
  placements: SlotPlacement[];
  purchases: PurchaseRecord[];
  chats: Record<string, ChatMessage[]>;
  ownCapsule: OwnCapsule | null;
  /** créditos spent: returns false if not enough balance */
  buy: (machineId: MachineId, slot: number) => { ok: boolean; reason?: string };
  placeOwn: (machineId: MachineId, slot: number, capsule: OwnCapsule) => boolean;
  removeOwnPlacement: (machineId: MachineId, slot: number) => void;
  sendMessage: (profileId: string, text: string) => void;
  addReply: (profileId: string, text: string) => void;
  addCredits: (amount: number) => void;
  logout: () => void;
  login: (username: string) => AuthUser | null;
  register: (username: string) => AuthUser;
  /** First empty slot index on the CDMX machine, or null if full. */
  firstFreeSlot: () => number | null;
}

export function useGame(): GameStore {
  const { data: session, status } = useSession();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [placements, setPlacements] = useState<SlotPlacement[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [ownCapsule, setOwnCapsule] = useState<OwnCapsule | null>(null);

  useEffect(() => {
    ensurePlacementsSeeded();
    setPlacements(readPlacements());
    setPurchases(readPurchases());
    setChats(readChats());
    setOwnCapsule(readOwnCapsule());

    if (status === "loading") {
      setReady(false);
      return;
    }

    if (status === "authenticated" && session?.user) {
      const id =
        session.user.id ?? session.user.email ?? `local:anon-${Date.now()}`;
      const name = session.user.name ?? session.user.email ?? null;
      const found = syncSessionToLocalUser(id, name, session.user.email);
      setUser(found);
    } else {
      // Not authenticated: clear any stale local session and stay logged out.
      // No demo user is created anymore.
      writeSessionId(null);
      setUser(null);
    }
    setReady(true);
  }, [status, session]);

  const persistUser = useCallback((next: AuthUser) => {
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === next.id);
    if (idx >= 0) users[idx] = next;
    else users.push(next);
    writeUsers(users);
    setUser(next);
  }, []);

  const firstFreeSlot = useCallback((): number | null => {
    const taken = new Set(placements.map((p) => p.slot));
    for (let i = 0; i < SLOTS_COUNT; i++) if (!taken.has(i)) return i;
    return null;
  }, [placements]);

  const buy = useCallback<GameStore["buy"]>(
    (machineId, slot) => {
      if (!user) return { ok: false, reason: "session" };
      if (user.credits < ACTION_COST) return { ok: false, reason: "credits" };

      const updated: AuthUser = { ...user, credits: user.credits - ACTION_COST };
      persistUser(updated);

      const placement = placements.find(
        (p) => p.machineId === machineId && p.slot === slot,
      );
      const profileId = placement?.profileId;
      const nextPlacements = placements.filter(
        (p) => !(p.machineId === machineId && p.slot === slot),
      );
      setPlacements(nextPlacements);
      writePlacements(nextPlacements);

      if (profileId && profileId !== "me") {
        const nextPurchases: PurchaseRecord[] = [
          {
            profileId,
            machineId,
            slot,
            boughtAt: Date.now(),
          },
          ...purchases.filter((p) => p.profileId !== profileId),
        ];
        setPurchases(nextPurchases);
        writePurchases(nextPurchases);
      }
      return { ok: true };
    },
    [user, placements, purchases, persistUser],
  );

  const placeOwn = useCallback<GameStore["placeOwn"]>(
    (machineId, slot, capsule) => {
      if (!user) return false;
      if (user.credits < ACTION_COST) return false;
      setUser((prev) => {
        if (!prev || prev.credits < ACTION_COST) return prev;
        const next = { ...prev, credits: prev.credits - ACTION_COST };
        persistUser(next);
        return next;
      });
      writeOwnCapsule(capsule);
      setOwnCapsule(capsule);
      const nextPlacements = placements.filter(
        (p) => !(p.machineId === machineId && p.slot === slot),
      );
      nextPlacements.push({ machineId, slot, profileId: "me" });
      setPlacements(nextPlacements);
      writePlacements(nextPlacements);
      return true;
    },
    [user, placements, persistUser],
  );

  const removeOwnPlacement = useCallback<GameStore["removeOwnPlacement"]>(
    (machineId, slot) => {
      const next = placements.filter(
        (p) => !(p.machineId === machineId && p.slot === slot),
      );
      setPlacements(next);
      writePlacements(next);
    },
    [placements],
  );

  const sendMessage = useCallback<GameStore["sendMessage"]>((profileId, text) => {
    setChats((prev) => {
      const list = prev[profileId] ?? [];
      const msg: ChatMessage = {
        id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        mine: true,
        text,
        at: Date.now(),
      };
      const next = { ...prev, [profileId]: [...list, msg] };
      writeChats(next);
      return next;
    });
  }, []);

  const addReply = useCallback<GameStore["addReply"]>((profileId, text) => {
    setChats((prev) => {
      const list = prev[profileId] ?? [];
      const msg: ChatMessage = {
        id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        mine: false,
        text,
        at: Date.now(),
      };
      const next = { ...prev, [profileId]: [...list, msg] };
      writeChats(next);
      return next;
    });
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

  const logout = useCallback(() => {
    writeSessionId(null);
    setUser(null);
  }, []);

  const login = useCallback(
    (username: string) => {
      const trimmed = username.trim();
      const found = readUsers().find((u) => u.username === trimmed) ?? null;
      if (!found) return null;
      writeSessionId(found.id);
      setUser(found);
      return found;
    },
    [],
  );

  const register = useCallback(
    (username: string) => {
      const trimmed = username.trim();
      const id = `local:${trimmed}`;
      const users = readUsers();
      const existing = users.find((u) => u.id === id) ?? null;
      if (existing) {
        writeSessionId(existing.id);
        setUser(existing);
        return existing;
      }
      const newUser: AuthUser = {
        id,
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
    [],
  );

  return {
    ready,
    status,
    user,
    credits: user?.credits ?? 0,
    placements,
    purchases,
    chats,
    ownCapsule,
    buy,
    placeOwn,
    removeOwnPlacement,
    sendMessage,
    addReply,
    addCredits,
    logout,
    login,
    register,
    firstFreeSlot,
  };
}

export { CDMX };