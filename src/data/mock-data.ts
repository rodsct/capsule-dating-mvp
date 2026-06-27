import type { CapsuleProfile, VendingMachine, MachineId } from "@/lib/types";

/** Each action (buy + place) costs the same amount of MXN. */
export const ACTION_PRICE = 29;

export const MACHINES: VendingMachine[] = [
  {
    id: "romance",
    name: "Algo serio",
    kanji: "恋",
    tagline: "Para los que buscan una pareja de verdad",
    description:
      "Cápsulas de personas que buscan una relación estable, con planes compartidos y una conexión que dure más que el verano.",
    emoji: "❤️",
    gradient: ["#ff5e8a", "#7a1f5a"],
    signColor: "#ff5e8a",
    price: ACTION_PRICE,
  },
  {
    id: "amistad",
    name: "Amistad primero",
    kanji: "友",
    tagline: "Conoce gente sin presión ni etiquetas",
    description:
      "Para los que prefieren que la relación nazca como amistad. Café, planes caseros y conversar sin miedo a interpretar señales.",
    emoji: "🤝",
    gradient: ["#28c8e6", "#154a78"],
    signColor: "#28c8e6",
    price: ACTION_PRICE,
  },
  {
    id: "aventura",
    name: "Aventura & salidas",
    kanji: "冒",
    tagline: "Compañeros para planes, viajes y taco tours",
    description:
      "Cápsulas de personas activas: senderismo al Ajusco, food tours por la CDMX, viajes improvisados y planes al aire libre.",
    emoji: "🧭",
    gradient: ["#b6ff3a", "#0a6b3d"],
    signColor: "#b6ff3a",
    price: ACTION_PRICE,
  },
  {
    id: "conversacion",
    name: "Conversación profunda",
    kanji: "話",
    tagline: "Mente abierta, cafés largos y debate sano",
    description:
      "Para enamorarse discurso a discurso: cine, filosofía de sobremesa, libros sin fin y charlas que se van hasta las 3am.",
    emoji: "💬",
    gradient: ["#9d4edd", "#311578"],
    signColor: "#9d4edd",
    price: ACTION_PRICE,
  },
  {
    id: "networking",
    name: "Networking social",
    kanji: "繋",
    tagline: "Conecta con gente con drive y proyectos",
    description:
      "Profesionales y emprendedores de la CDMX que buscan relaciones con personas ambiciosas: cenas, eventos y planes que suman.",
    emoji: "✨",
    gradient: ["#ffd166", "#1b3aff"],
    signColor: "#ffd166",
    price: ACTION_PRICE,
  },
];

type Raw = Omit<CapsuleProfile, "id" | "machineId" | "photoGradient"> & {
  g: [string, string];
};

function build(id: MachineId, raws: Raw[]): CapsuleProfile[] {
  return raws.map((r, i) => {
    const { g, ...rest } = r;
    return {
      id: `demo-${id}-${i + 1}`,
      machineId: id,
      photoGradient: g,
      ...rest,
    } as CapsuleProfile;
  });
}

const RAW: Record<MachineId, Raw[]> = {
  romance: [
    {
      firstName: "Valeria",
      age: 27,
      emoji: "🌷",
      hobbies: ["Cine indie", "Cocina", "Pasear perro", "Yoga"],
      fullName: "Valeria Soto",
      bio: "Busco algo serio con alguien que disfrute el domingo tranquilo, el café de mañana y los planes en casa. No me late el small talk.",
      loveLanguage: "Tiempo de calidad y detalles sencillos",
      lookingFor: "Una pareja para construir planes a largo plazo",
      song: "Hallelujah — Jeff Buckley",
      g: ["#ff5e8a", "#7a1f5a"],
    },
    {
      firstName: "Mateo",
      age: 31,
      emoji: "🍷",
      hobbies: ["Vino natural", "Cocina italiana", "Caminatas", "Lectura"],
      fullName: "Mateo Rivas",
      bio: "Ya bailé suficiente. Quiero planes de domingo, charlas serias y a alguien con quien proyectar más allá del próximo fin de semana.",
      loveLanguage: "Actos de servicio y conversación honesta",
      lookingFor: "Una relación seria y calmada",
      song: "Lover — Taylor Swift",
      g: ["#ff7ad9", "#9d4edd"],
    },
    {
      firstName: "Renata",
      age: 25,
      emoji: "📖",
      hobbies: ["Librerías", "Café", "Plantas", "Bordado"],
      fullName: "Renata Lara",
      bio: "Tranquila, casera, observadora. Busco a alguien estable emocionalmente, que sepa escuchar y disfrute los domingos sin prisa.",
      loveLanguage: "Palabras de afirmación",
      lookingFor: "Una pareja con la que crecer juntos",
      song: "Skinny Love — Bon Iver",
      g: ["#f9a8d4", "#7c3aed"],
    },
    {
      firstName: "Bruno",
      age: 29,
      emoji: "🪴",
      hobbies: ["Senderismo", "Cafés", "Cocina", "Perros"],
      fullName: "Bruno Medina",
      bio: "Buscando algo serio, sin drama. Me gustan los planes sencillos: caminar, cocinar, platicar. Si te late, empecemos por un café.",
      loveLanguage: "Tiempo de calidad",
      lookingFor: "Una relación estable y honesta",
      song: "Easy — Commodores",
      g: ["#fb7185", "#4c1d95"],
    },
    {
      firstName: "Camila",
      age: 28,
      emoji: "🫖",
      hobbies: ["Té", "Jardinería", "Cine", "Viajes lentos"],
      fullName: "Camila Núñez",
      bio: "Tomo las relaciones en serio. No me late jugar. Busco una pareja que quiera planes a futuro y domingos en pijama sin culpa.",
      loveLanguage: "Tiempo de calidad y regalos pensados",
      lookingFor: "Una relación con intención de pareja",
      song: "At Last — Etta James",
      g: ["#fda4af", "#6d28d9"],
    },
    {
      firstName: "Diego",
      age: 33,
      emoji: "🚲",
      hobbies: ["Bici", "Café", "Arquitectura", "Caminar la ciudad"],
      fullName: "Diego Fuentes",
      bio: "Listo para algo serio. Disfruto la ciudad a pie, los cafés largos y los planes sin prisa. Busco complicidad y honestidad.",
      loveLanguage: "Actos de servicio",
      lookingFor: "Pareja para planes de largo plazo",
      song: "Thinking Out Loud — Ed Sheeran",
      g: ["#fb7185", "#5b21b6"],
    },
  ],
  amistad: [
    {
      firstName: "Ari",
      age: 22,
      emoji: "🐾",
      hobbies: ["Gatos", "Series", "Boba", "Cafés"],
      fullName: "Ari Trejo",
      bio: "Amistad primero, sin etiquetas. Me late conocer gente para cafés, series y planes caseros. Si luego hay química, bienvenido.",
      loveLanguage: "Tiempo de calidad en planes sin presión",
      lookingFor: "Una amistad que crezca sin etiquetas",
      song: "good 4 u — Olivia Rodrigo",
      g: ["#28c8e6", "#154a78"],
    },
    {
      firstName: "Sebas",
      age: 24,
      emoji: "🎮",
      hobbies: ["Videojuegos", "Board games", "Tacos", "Boba"],
      fullName: "Sebastián Cruz",
      bio: "Busco amigos primero. Si las vibra dan para más, lo vemos. Me late la gente relajada que no le huye a un plan casual.",
      loveLanguage: "Tiempo de calidad y humor compartido",
      lookingFor: "Amistad sin presión",
      song: "Pumped Up Kicks — Foster the People",
      g: ["#5eead4", "#1e3a8a"],
    },
    {
      firstName: "Lola",
      age: 26,
      emoji: "🎒",
      hobbies: ["Museos", "Cafés", "Bicis", "Cine"],
      fullName: "Lola Paredes",
      bio: "Primero amigos. Me gustan los planes tranquilos: museos, cafés, charlas largas sin etiquetas. Busco conocer gente real.",
      loveLanguage: "Conversación honesta",
      lookingFor: "Amistad y quizá algo más",
      song: "Cherry-coloured Funk — Cocteau Twins",
      g: ["#22d3ee", "#0e7490"],
    },
    {
      firstName: "Tomás",
      age: 30,
      emoji: "☕",
      hobbies: ["Café de especialidad", "Fotografía", "Bici", "Caminar"],
      fullName: "Tomás Díaz",
      bio: "Amistad primero siempre. Me late la ciudad a pie, los cafés largos y los sinplanes. Vamos viendo qué se da.",
      loveLanguage: "Tiempo sin agenda",
      lookingFor: "Gente para planes cotidianos",
      song: "Lisztomania — Phoenix",
      g: ["#67e8f9", "#155e75"],
    },
    {
      firstName: "Itzel",
      age: 23,
      emoji: "🎧",
      hobbies: ["Indie", "Vinilo", "Cafés", "Conciertos chicos"],
      fullName: "Itzel Ramírez",
      bio: "Busco amistades antes que rollo. Conciertos chiquitos, vinilos, cafés raros. Si hay onda, lo descubrimos en el camino.",
      loveLanguage: "Compartir música y planes sin fecha",
      lookingFor: "Amistad sincera",
      song: "Sweater Weather — The Neighbourhood",
      g: ["#2dd4bf", "#1e40af"],
    },
  ],
  aventura: [
    {
      firstName: "Sam",
      age: 25,
      emoji: "🧗",
      hobbies: ["Escalada", "Senderismo", "Parque", "Tacos de canasta"],
      fullName: "Sam Paredes",
      bio: "Planes al aire libre: escalada, Ajusco, food tours. Busco compañero de aventuras para no salir sola los fines de semana.",
      loveLanguage: "Experiencias compartidas",
      lookingFor: "Compañero de aventuras y planes",
      song: "Lone Digger — Caravan Palace",
      g: ["#b6ff3a", "#0a6b3d"],
    },
    {
      firstName: "Maya",
      age: 28,
      emoji: "🏃",
      hobbies: ["Trail running", "Yoga", "Baño de hielo", "Chapultepec"],
      fullName: "Maya Rivera",
      bio: "Madruguista, activa, adicta al Chapultepec. Busco a alguien para correr, escalar y planear viajes improvisados.",
      loveLanguage: "Acompañarte en tus metas",
      lookingFor: "Compañero activo para retas y viajes",
      song: "Stronger — Kanye",
      g: ["#a3e635", "#065f46"],
    },
    {
      firstName: "Rafa",
      age: 27,
      emoji: "🚵",
      hobbies: ["MTB", "Camping", "Comida callejera", "Fotografía"],
      fullName: "Rafa Ortega",
      bio: "Bici de montaña, camping y tacos callejeros en cualquier punto de la ciudad. Busco gente que se anime a lo improvisado.",
      loveLanguage: "Experiencias y aventuras compartidas",
      lookingFor: "Compañera de planes y viajes",
      song: "Everlong — Foo Fighters",
      g: ["#84cc16", "#15803d"],
    },
    {
      firstName: "Dana",
      age: 24,
      emoji: "🌊",
      hobbies: ["Surf", "Yoga", "Viajes", "Ceviche"],
      fullName: "Dana Salinas",
      bio: "Voy a Acapulco cada chance que tengo. Busco a alguien para viajes improvisados, surf y desayunos frente al mar.",
      loveLanguage: "Planes nuevos juntos",
      lookingFor: "Compañera de viajes y aventuras",
      song: "Walking on a Dream — Empire of the Sun",
      g: ["#bef264", "#166534"],
    },
    {
      firstName: "Iván",
      age: 30,
      emoji: "⛺",
      hobbies: ["Camping", "Astrofotografía", "Senderismo", "Café"],
      fullName: "Iván Galván",
      bio: "Acampador empedernido. Busco compañía para escapadas al Desierto de los Leones y noches de estrellas lejos de la city.",
      loveLanguage: "Compartir lo que te emociona",
      lookingFor: "Compañera para escapadas al aire libre",
      song: "The Night We Met — Lord Huron",
      g: ["#a3e635", "#14532d"],
    },
  ],
  conversacion: [
    {
      firstName: "Paz",
      age: 24,
      emoji: "✍️",
      hobbies: ["Poesía", "Librerías", "Mezcal", "Caminatas largas"],
      fullName: "Paz Ortega",
      bio: "Me late hablar de todo un poco: libros, cine, política, filosofía de sobremesa. Busco charlas que se alarguen hasta las 3am.",
      loveLanguage: "Palabras profundas y presencia",
      lookingFor: "Alguien que disfrute debatir y pensar en voz alta",
      song: "Hallelujah — Jeff Buckley",
      g: ["#9d4edd", "#311578"],
    },
    {
      firstName: "Noah",
      age: 33,
      emoji: "🎞️",
      hobbies: ["Cine arte", "Fotografía análoga", "Tarot", "Cold brew"],
      fullName: "Noah Fierro",
      bio: "Cineasta indie, conversador interminable. Me late analizar una película durante el postre. Busco a alguien curioso y elocuente.",
      loveLanguage: "Conversaciones largas y atención plena",
      lookingFor: "Una musa y cómplice intelectual",
      song: "Lover, You Should've Come Over — Jeff Buckley",
      g: ["#c084fc", "#4c1d95"],
    },
    {
      firstName: "Iris",
      age: 27,
      emoji: "🎨",
      hobbies: ["Arte", "Vino natural", "Inauguraciones", "Pulque curado"],
      fullName: "Iris Lozano",
      bio: "Salto de galerías y conversadora incansable. Busco a alguien que disfrute una sobremesa eterna y opinionated sobre arte.",
      loveLanguage: "Escucha profunda",
      lookingFor: "Cita en museo que se vuelve café que se vuelve para siempre",
      song: "Cherry-coloured Funk — Cocteau Twins",
      g: ["#a78bfa", "#5b21b6"],
    },
    {
      firstName: "Emiliano",
      age: 30,
      emoji: "📚",
      hobbies: ["Filosofía", "Café", "Pódcasts", "Jazz"],
      fullName: "Emiliano Vargas",
      bio: "Lector obsesivo, conversador incómodo en el buen sentido. Me late quién no le tema a una discusión larga y cordial.",
      loveLanguage: "Conversación honesta",
      lookingFor: "Alguien que disfrute pensar en voz alta",
      song: "So What — Miles Davis",
      g: ["#8b5cf6", "#312e81"],
    },
    {
      firstName: "Luna",
      age: 26,
      emoji: "🌙",
      hobbies: ["Astrología", "Ciencia", "Café", "Documentales"],
      fullName: "Luna Méndez",
      bio: "Curiosa por naturaleza: de la astrología a la ciencia sin escalas. Busco a alguien que aguante charlas humanas e interminables.",
      loveLanguage: "Intercambio de ideas",
      lookingFor: "Una conexión mental por encima de todo",
      song: "To Build a Home — The Cinematic Orchestra",
      g: ["#c4b5fd", "#4338ca"],
    },
  ],
  networking: [
    {
      firstName: "Aria",
      age: 29,
      emoji: "🚀",
      hobbies: ["Startups", "Café-caminata", "Cenas de founders", "Notion"],
      fullName: "Aria Sandoval",
      bio: "Bootstrapper. Busco connectar con gente con drive. Cenas, cafés y eventos en Polanco. La ambición bien acompañada es sexy.",
      loveLanguage: "Atención y tiempo planificado",
      lookingFor: "Energía de cofundador que también sea espontánea",
      song: "Lose Yourself — Eminem",
      g: ["#ffd166", "#1b3aff"],
    },
    {
      firstName: "Mariano",
      age: 35,
      emoji: "📈",
      hobbies: ["Dev tools", "Angel investing", "Peloton", "Notas de libros"],
      fullName: "Mariano Bautista",
      bio: "Founder dos veces, ahora armo dev tools. Busco compañía con su propia estrella del norte. Las mañanas son sagradas.",
      loveLanguage: "Tiempo bloqueado y bien planeado",
      lookingFor: "Una pareja con su propia ambición",
      song: "The Score — Big Sean",
      g: ["#fcd34d", "#1e3a8a"],
    },
    {
      firstName: "Lena",
      age: 26,
      emoji: "⚡",
      hobbies: ["Climate tech", "Trail runs", "Club de lectura", "Mercados"],
      fullName: "Lena Olvera",
      bio: "Armo una startup climática. Me late connectar con gente que también construye. Cenas de founders y paseos entre plantas.",
      loveLanguage: "Conversaciones estructuradas y planes",
      lookingFor: "Una pareja con responsabilidad y ambición",
      song: "Work — Rihanna",
      g: ["#fbbf24", "#2563eb"],
    },
    {
      firstName: "Sofía",
      age: 28,
      emoji: "💼",
      hobbies: ["Diseño", "Eventos", "Café", "Networking"],
      fullName: "Sofía Calderón",
      bio: "Diseñadora y event-maker. Conecto perfiles para sumar. Busco gente que se mueva, que le guste asistir a eventos y crecer.",
      loveLanguage: "Introducirte a quién debas conocer",
      lookingFor: "Relaciones con gente con proyectos",
      song: "Ambition — Wale",
      g: ["#facc15", "#1d4ed8"],
    },
    {
      firstName: "Andrés",
      age: 32,
      emoji: "🤵",
      hobbies: ["Finanzas", "Running", "Cenas", "Lectura"],
      fullName: "Andrés Peña",
      bio: "Finance guy con gusto por las buenas cenas. Busco conectar con gente que tenga drive y planes. Conversa con estructura.",
      loveLanguage: "Tiempo de calidad bien planificado",
      lookingFor: "Pareja ambiciosa con quien crecer",
      song: "Hustler — Apt.",
      g: ["#fde68a", "#1e40af"],
    },
  ],
};

const ALL: CapsuleProfile[] = (
  Object.keys(RAW) as MachineId[]
).flatMap((id) => build(id, RAW[id]));

export const PROFILES: CapsuleProfile[] = ALL;

/** The slot index that each demo profile occupies on its machine (seeding). */
export function seedPlacements(): import("@/lib/types").SlotPlacement[] {
  const out: import("@/lib/types").SlotPlacement[] = [];
  for (const p of PROFILES) {
    const slot = PROFILES.filter((q) => q.machineId === p.machineId).indexOf(p);
    out.push({ machineId: p.machineId, slot, profileId: p.id });
  }
  return out;
}

export function getMachine(id: MachineId): VendingMachine | undefined {
  return MACHINES.find((m) => m.id === id);
}

export function getProfile(id: string): CapsuleProfile | undefined {
  return PROFILES.find((p) => p.id === id);
}

export function getProfilesForMachine(id: MachineId): CapsuleProfile[] {
  return PROFILES.filter((p) => p.machineId === id);
}