import type { MediaItem } from "@/data/media";

export interface Exposicion {
  id: string;
  titulo: string;
  /** Breve, se muestra en la tarjeta. */
  descripcion: string;
  /** Texto curatorial. */
  parrafoExplicativo: string;
  /** ISO "YYYY-MM-DD" o null. */
  fechaInicio: string | null;
  fechaFin: string | null;
  artistaIds: string[];
  media: MediaItem[];
  publicado: boolean;
}

export const exposiciones: Exposicion[] = [
  {
    id: "luz-y-materia",
    titulo: "Luz y materia",
    descripcion: "Una exploración de la presencia material y la luz en el taller.",
    parrafoExplicativo:
      "Una exploración de la presencia material y la luz en el taller, donde cada pieza dialoga con el espacio y el tiempo. Las obras reunidas en esta muestra invitan a detenerse en lo sutil: la sombra que cambia con las horas, la textura que solo se revela de cerca.",
    fechaInicio: "2026-03-05",
    fechaFin: "2026-04-12",
    artistaIds: ["taller-magenta", "nuria-cano"],
    media: [],
    publicado: true,
  },
  {
    id: "voces-del-sur",
    titulo: "Voces del sur",
    descripcion: "Relatos visuales de artistas del interior del país.",
    parrafoExplicativo:
      "Una muestra que reúne relatos visuales de artistas del interior del país, poniendo en primer plano perspectivas contemporáneas y contextuales. El recorrido propone un cruce entre memoria colectiva y lenguaje plástico actual.",
    fechaInicio: "2026-06-10",
    fechaFin: "2026-07-20",
    artistaIds: ["fernanda-solis", "joaquin-vega", "renata-salazar"],
    media: [],
    publicado: true,
  },
  {
    id: "trazos-contemporaneos",
    titulo: "Trazos contemporáneos",
    descripcion: "Obras que redefinen la pintura y el objeto artesanal.",
    parrafoExplicativo:
      "Obras que redefinen la pintura y el objeto, con procesos artesanales y materiales experimentales. Cada artista trabaja desde su propio taller, pero comparte una misma pregunta: qué queda de lo hecho a mano en un tiempo acelerado.",
    fechaInicio: "2026-09-02",
    fechaFin: null,
    artistaIds: ["diego-farfan", "camila-ruiz"],
    media: [],
    publicado: true,
  },
];

const formatoFecha = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "5 de marzo de 2026 — 12 de abril de 2026", o solo la de inicio. */
export function rangoFechas(expo: Pick<Exposicion, "fechaInicio" | "fechaFin">): string {
  const fmt = (iso: string) => formatoFecha.format(new Date(`${iso}T00:00:00Z`));
  if (expo.fechaInicio && expo.fechaFin) return `${fmt(expo.fechaInicio)} — ${fmt(expo.fechaFin)}`;
  if (expo.fechaInicio) return `Desde el ${fmt(expo.fechaInicio)}`;
  return "";
}

/**
 * Más reciente primero, por fecha de inicio; las que no tienen fecha van al final.
 * A igual fecha se mantiene el orden recibido (de creación).
 */
export function ordenarPorFecha(lista: Exposicion[]): Exposicion[] {
  return [...lista].sort((a, b) => {
    if (a.fechaInicio === b.fechaInicio) return 0;
    if (!a.fechaInicio) return 1;
    if (!b.fechaInicio) return -1;
    return b.fechaInicio.localeCompare(a.fechaInicio);
  });
}
