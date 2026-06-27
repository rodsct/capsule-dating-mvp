import type {
  CapsulePreset,
  CapsuleProfile,
  GenderCodeInfo,
  MachineId,
  VendingMachine,
} from "@/lib/types";

/** Each action (buy + place) costs the same amount of MXN. */
export const ACTION_PRICE = 29;

/** Price in MXN of a single crédito. 1 crédito = $29 MXN. */
export const CREDIT_PRICE = 29;

/** Cost in créditos of a single action (buy or place). */
export const ACTION_COST_CREDITS = 1;

export interface CreditPack {
  /** number of créditos in the pack */
  credits: number;
  /** price in MXN */
  price: number;
  /** savings vs buying créditos one-by-one, in MXN */
  savings: number;
  /** human label, e.g. "5 créditos" */
  label: string;
}

/**
 * Volume packs for créditos. Better price per crédito as quantity grows.
 * 1 crédito = $29 MXN baseline.
 */
export const CREDIT_PACKS: CreditPack[] = [
  { credits: 1, price: 29, savings: 0, label: "1 crédito" },
  { credits: 5, price: 125, savings: 20, label: "5 créditos" },
  { credits: 10, price: 220, savings: 70, label: "10 créditos" },
  { credits: 20, price: 400, savings: 180, label: "20 créditos" },
];

/** Total slots on the single CDMX machine. */
export const SLOTS_COUNT = 12;

/** The one and only vending machine of the app. */
export const MACHINE: VendingMachine = {
  id: "cdmx",
  name: "Cápsulas de la CDMX",
  subtitle: "Una máquina, muchas personas",
  description:
    "Una sola máquina de cápsulas para toda la Ciudad de México. Coloca la tuya o abre la de alguien más por 1 crédito ($29 MXN).",
  price: ACTION_PRICE,
  slots: SLOTS_COUNT,
};

/** Color code by gender / orientation / what they seek. */
export const GENDER_CODES: GenderCodeInfo[] = [
  { code: "mujer-busca-hombre", label: "Mujer busca hombre", color: "#ff5e8a" },
  { code: "hombre-busca-mujer", label: "Hombre busca mujer", color: "#3b82f6" },
  { code: "amistad", label: "Busca amistad / amigos", color: "#22c55e" },
  { code: "no-binario", label: "No binario / género no definido", color: "#facc15" },
  { code: "lgbtq", label: "LGBTQ+ / comunidad", color: "#9d4edd" },
  { code: "mujer-busca-mujer", label: "Mujer busca mujer", color: "#f97316" },
  { code: "hombre-busca-hombre", label: "Hombre busca hombre", color: "#06b6d4" },
];

export function genderInfo(code: string): GenderCodeInfo | undefined {
  return GENDER_CODES.find((g) => g.code === code);
}

/** CDMX alcaldías available in the dropdown. */
export const ALCALDIAS: string[] = [
  "Álvaro Obregón",
  "Azcapotzalco",
  "Benito Juárez",
  "Coyoacán",
  "Cuajimalpa",
  "Cuauhtémoc",
  "Gustavo A. Madero",
  "Iztacalco",
  "Iztapalapa",
  "La Magdalena Contreras",
  "Milpa Alta",
  "Miguel Hidalgo",
  "Tláhuac",
  "Tlalpan",
  "Venustiano Carranza",
  "Xochimilco",
];

/** Preset gradient combos for the capsule orb body. */
export const CAPSULE_PRESETS: CapsulePreset[] = [
  { id: "fresa", name: "Fresa", gradient: ["#ff9a9e", "#fad0c4"] },
  { id: "mango", name: "Mango", gradient: ["#ffd166", "#ff7b00"] },
  { id: "jamaica", name: "Jamaica", gradient: ["#ff5e8a", "#7a1f5a"] },
  { id: "lavanda", name: "Lavanda", gradient: ["#a78bfa", "#6d28d9"] },
  { id: "neón", name: "Neón", gradient: ["#ff2bd6", "#9d4edd"] },
  { id: "caribe", name: "Caribe", gradient: ["#00f0ff", "#0e7490"] },
  { id: "menta", name: "Menta", gradient: ["#b6ff3a", "#0a6b3d"] },
  { id: "ocaso", name: "Ocaso", gradient: ["#ff9966", "#ff5e62"] },
  { id: "noche", name: "Noche", gradient: ["#5b21b6", "#1e1b4b"] },
  { id: "tropical", name: "Tropical", gradient: ["#f72585", "#7209b7"] },
  { id: "limón", name: "Limón", gradient: ["#d9f99d", "#65a30d"] },
  { id: "cobalto", name: "Cobalto", gradient: ["#60a5fa", "#1e3a8a"] },
];

const UNSPLASH = [
  "https://images.unsplash.com/photo-1529139574466-19de8de0fca3?w=900&q=80",
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c3712969?w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80",
  "https://images.unsplash.com/photo-1490649415897-3b2c0c8e2f81?w=900&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
  "https://images.unsplash.com/photo-1469474968028-5669f6b5476f?w=900&q=80",
];

interface RawProfile {
  firstName: string;
  age: number;
  emoji: string;
  alcaldia: string;
  hobbies: string[];
  genderCode: CapsuleProfile["genderCode"];
  capsuleGradient: [string, string];
  fullName: string;
  bio: string;
  loveLanguage: string;
  lookingFor: string;
  song: string;
  photoUrl: string;
}

const RAW_DEMOS: RawProfile[] = [
  {
    firstName: "Valeria",
    age: 27,
    emoji: "🌷",
    alcaldia: "Coyoacán",
    hobbies: ["Cine indie", "Café", "Yoga", "Perros"],
    genderCode: "mujer-busca-hombre",
    capsuleGradient: ["#ff9a9e", "#fad0c4"],
    fullName: "Valeria Soto",
    bio: "Busco algo serio con alguien que disfrute el domingo tranquilo, el café de mañana y los planes en casa. No me late el small talk.",
    loveLanguage: "Tiempo de calidad y detalles sencillos",
    lookingFor: "Una pareja para construir planes a largo plazo",
    song: "Hallelujah — Jeff Buckley",
    photoUrl: UNSPLASH[0],
  },
  {
    firstName: "Mateo",
    age: 31,
    emoji: "🍷",
    alcaldia: "Benito Juárez",
    hobbies: ["Vino natural", "Cocina", "Caminatas", "Lectura"],
    genderCode: "hombre-busca-mujer",
    capsuleGradient: ["#60a5fa", "#1e3a8a"],
    fullName: "Mateo Rivas",
    bio: "Ya bailé suficiente. Quiero planes de domingo, charlas serias y a alguien con quien proyectar más allá del próximo fin de semana.",
    loveLanguage: "Actos de servicio y conversación honesta",
    lookingFor: "Una relación seria y calmada",
    song: "Lover — Taylor Swift",
    photoUrl: UNSPLASH[1],
  },
  {
    firstName: "Ari",
    age: 22,
    emoji: "🐾",
    alcaldia: "Cuauhtémoc",
    hobbies: ["Gatos", "Series", "Boba", "Cafés"],
    genderCode: "amistad",
    capsuleGradient: ["#b6ff3a", "#0a6b3d"],
    fullName: "Ari Trejo",
    bio: "Amistad primero, sin etiquetas. Me late conocer gente para cafés, series y planes caseros. Si luego hay química, bienvenido.",
    loveLanguage: "Tiempo de calidad en planes sin presión",
    lookingFor: "Una amistad que crezca sin etiquetas",
    song: "good 4 u — Olivia Rodrigo",
    photoUrl: UNSPLASH[2],
  },
  {
    firstName: "Paz",
    age: 24,
    emoji: "✍️",
    alcaldia: "Miguel Hidalgo",
    hobbies: ["Poesía", "Librerías", "Mezcal", "Caminatas largas"],
    genderCode: "no-binario",
    capsuleGradient: ["#ffd166", "#ff7b00"],
    fullName: "Paz Ortega",
    bio: "Me late hablar de todo un poco: libros, cine, política, filosofía de sobremesa. Busco charlas que se alarguen hasta las 3am.",
    loveLanguage: "Palabras profundas y presencia",
    lookingFor: "Alguien que disfrute debatir y pensar en voz alta",
    song: "Hallelujah — Jeff Buckley",
    photoUrl: UNSPLASH[3],
  },
  {
    firstName: "Iris",
    age: 27,
    emoji: "🎨",
    alcaldia: "Cuauhtémoc",
    hobbies: ["Arte", "Vino natural", "Galerías", "Pulque curado"],
    genderCode: "lgbtq",
    capsuleGradient: ["#a78bfa", "#6d28d9"],
    fullName: "Iris Lozano",
    bio: "Salto de galerías y conversadora incansable. Busco a alguien que disfrute una sobremesa eterna y opinionated sobre arte.",
    loveLanguage: "Escucha profunda",
    lookingFor: "Una cita en museo que se vuelve café que se vuelve para siempre",
    song: "Cherry-coloured Funk — Cocteau Twins",
    photoUrl: UNSPLASH[4],
  },
  {
    firstName: "Dana",
    age: 24,
    emoji: "🌊",
    alcaldia: "Iztapalapa",
    hobbies: ["Surf", "Yoga", "Viajes", "Ceviche"],
    genderCode: "mujer-busca-mujer",
    capsuleGradient: ["#ff9966", "#ff5e62"],
    fullName: "Dana Salinas",
    bio: "Voy a Acapulco cada chance que tengo. Busco a alguien para viajes improvisados, surf y desayunos frente al mar.",
    loveLanguage: "Planes nuevos juntos",
    lookingFor: "Compañera de viajes y aventuras",
    song: "Walking on a Dream — Empire of the Sun",
    photoUrl: UNSPLASH[5],
  },
  {
    firstName: "Sebas",
    age: 24,
    emoji: "🎮",
    alcaldia: "Tlalpan",
    hobbies: ["Videojuegos", "Board games", "Tacos", "Boba"],
    genderCode: "hombre-busca-hombre",
    capsuleGradient: ["#00f0ff", "#0e7490"],
    fullName: "Sebastián Cruz",
    bio: "Busco amigos primero. Si las vibra dan para más, lo vemos. Me late la gente relajada que no le huye a un plan casual.",
    loveLanguage: "Tiempo de calidad y humor compartido",
    lookingFor: "Amistad / algo más si hay onda",
    song: "Pumped Up Kicks — Foster the People",
    photoUrl: UNSPLASH[6] ?? UNSPLASH[0],
  },
];

const DEMO_PROFILES: CapsuleProfile[] = RAW_DEMOS.map((r, i) => ({
  id: `demo-cdmx-${i + 1}`,
  machineId: "cdmx" as MachineId,
  ...r,
}));

export const PROFILES: CapsuleProfile[] = DEMO_PROFILES;

/**
 * Seed placements for the single CDMX machine. Demo capsules occupy a
 * scattered set of slots so the machine never looks empty and never looks
 * full (there are always free slots inviting new users to place theirs).
 */
export function seedPlacements(): import("@/lib/types").SlotPlacement[] {
  // Deterministic but spread-out slot indices so first-time users see a
  // lively machine with visible empty slots.
  const chosen = [1, 2, 4, 5, 7, 9, 10];
  return chosen.map((slot, i) => ({
    machineId: "cdmx" as MachineId,
    slot,
    profileId: DEMO_PROFILES[i % DEMO_PROFILES.length].id,
  }));
}

export function getMachine(id: MachineId): VendingMachine | undefined {
  return id === "cdmx" ? MACHINE : undefined;
}

export function getProfile(id: string): CapsuleProfile | undefined {
  return PROFILES.find((p) => p.id === id);
}

export function getMachineProfiles(): CapsuleProfile[] {
  return PROFILES;
}