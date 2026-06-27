"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AuthUser,
  ChatMessage,
  MachineId,
  OwnCapsule,
  PurchaseRecord,
  SlotPlacement,
} from "@/lib/types";
import { seedPlacements } from "@/data/mock-data";

const USERS_KEY = "cdx:users";
const SESSION_KEY = "cdx:session";
const PLACEMENTS_KEY = "cdx:placements";
const PURCHASES_KEY = "cdx:purchases";
const CHATS_KEY = "cdx:chats";
const OWN_CAPSULE_KEY = "cdx:own-capsule";
const SEEDED_KEY = "cdx:seeded";

const DEMO_USERNAME = "demo_chilango";
const DEMO_MONEDAS = 100;
const STARTING_MONEDAS = 29;
/** How much a "buy" or "place" action costs in monedas. */
const ACTION_COST = 29;

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
  return readJSON<AuthUser[]>([])(localStorage.getItem(USERS_KEY));
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

function readSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}
function writeSessionId(id: string | null) {
  if (id === null) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, id);
}

/** First-run seeding: demo user, auto-session, pre-occupied demo slots. */
function ensureSeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY) === "1") return;

  const users = readUsers();
  let demo = users.find((u) => u.username === DEMO_USERNAME);
  if (!demo) {
    demo = {
      id: `u-demo-${Math.random().toString(36).slice(2, 8)}`,
      username: DEMO_USERNAME,
      monedas: DEMO_MONEDAS,
      createdAt: Date.now(),
    };
    users.push(demo);
    writeUsers(users);
  }
  writeSessionId(demo.id);

  if (readPlacements().length === 0) {
    writePlacements(seedPlacements());
  }
  localStorage.setItem(SEEDED_KEY, "1");
}

export interface GameStore {
  ready: boolean;
  user: AuthUser | null;
  placements: SlotPlacement[];
  purchases: PurchaseRecord[];
  chats: Record<string, ChatMessage[]>;
  ownCapsule: OwnCapsule | null;
  /** monedas spent: returns false if not enough balance */
  buy: (machineId: MachineId, slot: number) => { ok: boolean; reason?: string };
  removePlacement: (machineId: MachineId, slot: number) => void;
  placeOwn: (machineId: MachineId, slot: number, capsule: OwnCapsule) => boolean;
  removeOwnPlacement: (machineId: MachineId, slot: number) => void;
  sendMessage: (profileId: string, text: string) => void;
  addReply: (profileId: string, text: string) => void;
  addMonedas: (amount: number) => void;
  logout: () => void;
  login: (username: string) => AuthUser | null;
  register: (username: string) => AuthUser;
}

export function useGame(): GameStore {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [placements, setPlacements] = useState<SlotPlacement[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [ownCapsule, setOwnCapsule] = useState<OwnCapsule | null>(null);

  useEffect(() => {
    ensureSeeded();
    const id = readSessionId();
    const found = id ? readUsers().find((u) => u.id === id) ?? null : null;
    if (!found && id) writeSessionId(null);
    setUser(found);
    setPlacements(readPlacements());
    setPurchases(readPurchases());
    setChats(readChats());
    setOwnCapsule(readOwnCapsule());
    setReady(true);
  }, []);

  const persistUser = useCallback((next: AuthUser) => {
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === next.id);
    if (idx >= 0) users[idx] = next;
    else users.push(next);
    writeUsers(users);
    setUser(next);
  }, []);

  const buy = useCallback<GameStore["buy"]>(
    (machineId, slot) => {
      if (!user) return { ok: false, reason: "session" };
      if (user.monedas < ACTION_COST) return { ok: false, reason: "monedas" };

      const updated: AuthUser = { ...user, monedas: user.monedas - ACTION_COST };
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

  const removePlacement = useCallback<GameStore["removePlacement"]>(
    (machineId, slot) => {
      const next = placements.filter(
        (p) => !(p.machineId === machineId && p.slot === slot),
      );
      setPlacements(next);
      writePlacements(next);
    },
    [placements],
  );

  const placeOwn = useCallback<GameStore["placeOwn"]>(
    (machineId, slot, capsule) => {
      if (!user) return false;
      if (user.monedas < ACTION_COST) return false;
      setUser((prev) => {
        if (!prev || prev.monedas < ACTION_COST) return prev;
        const next = { ...prev, monedas: prev.monedas - ACTION_COST };
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

  const addMonedas = useCallback(
    (amount: number) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, monedas: prev.monedas + amount };
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
      const found = readUsers().find((u) => u.username === username) ?? null;
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
      const users = readUsers();
      const existing = users.find((u) => u.username === trimmed);
      if (existing) {
        writeSessionId(existing.id);
        setUser(existing);
        return existing;
      }
      const newUser: AuthUser = {
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        username: trimmed,
        monedas: STARTING_MONEDAS,
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
    user,
    placements,
    purchases,
    chats,
    ownCapsule,
    buy,
    removePlacement,
    placeOwn,
    removeOwnPlacement,
    sendMessage,
    addReply,
    addMonedas,
    logout,
    login,
    register,
  };
}