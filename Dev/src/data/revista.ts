import type { MediaItem } from "@/data/media";

export type TipoPublicacion = "articulo" | "noticia" | "entrevista";

export const tiposPublicacion: { key: TipoPublicacion; label: string; plural: string }[] = [
  { key: "articulo", label: "Artículo", plural: "Artículos" },
  { key: "noticia", label: "Noticia", plural: "Noticias" },
  { key: "entrevista", label: "Entrevista", plural: "Entrevistas" },
];

export function labelTipo(tipo: TipoPublicacion): string {
  return tiposPublicacion.find((t) => t.key === tipo)?.label ?? tipo;
}

export interface Publicacion {
  id: string;
  tipo: TipoPublicacion;
  titulo: string;
  /** Bajada: una o dos líneas que resumen la publicación. */
  resumen: string;
  /** Texto completo; los párrafos se separan con una línea en blanco. */
  cuerpo: string;
  /** Firma, ej. "Nuria Cano". */
  autor: string;
  /** ISO "YYYY-MM-DD". */
  fecha: string;
  /** Artistas mencionados o entrevistados. */
  artistaIds: string[];
  /** La primera es la portada. */
  media: MediaItem[];
  publicado: boolean;
}

const formatoFecha = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatFecha(iso: string): string {
  return formatoFecha.format(new Date(`${iso}T00:00:00Z`));
}

export function hoyIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Minúsculas y sin tildes, para buscar "entrevista" y encontrar "Entrevísta". */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export const revista: Publicacion[] = [
  {
    id: "seis-anos-de-magenta",
    tipo: "articulo",
    titulo: "Seis años de Magenta",
    resumen: "Un recorrido por la historia del espacio, desde su apertura días antes de la pandemia.",
    cuerpo:
      "Magenta abrió sus puertas en Barranco en 2020, apenas quince días antes del inicio de la pandemia.\n\nEn un contexto adverso, el proyecto logró sostenerse y crecer gracias a una comunidad de artistas y visitantes que encontraron en el espacio un lugar de encuentro.",
    autor: "Nuria Cano",
    fecha: "2026-03-01",
    artistaIds: ["nuria-cano"],
    media: [],
    publicado: true,
  },
  {
    id: "convocatoria-residencias-2027",
    tipo: "noticia",
    titulo: "Abrimos la convocatoria de residencias 2027",
    resumen: "Artistas de todas las regiones del Perú pueden postular hasta el 15 de diciembre.",
    cuerpo:
      "Magenta abre su convocatoria anual de residencias cortas para artistas visuales de regiones.\n\nLas bases y el formulario de postulación estarán disponibles en nuestras redes.",
    autor: "Taller Magenta",
    fecha: "2026-10-20",
    artistaIds: [],
    media: [],
    publicado: true,
  },
  {
    id: "conversacion-con-fernanda-solis",
    tipo: "entrevista",
    titulo: "Conversación con Fernanda Solís",
    resumen: "Sobre la memoria, el territorio y trabajar desde Arequipa.",
    cuerpo:
      "¿Cómo empezó tu trabajo con materiales de tu región?\n\nEmpecé recogiendo piedras y tierras de los lugares donde creció mi familia. Me interesaba que la obra cargara ese territorio.\n\n¿Qué significó exponer en Magenta?\n\nFue la primera vez que mostré en Lima fuera de un circuito institucional.",
    autor: "Nuria Cano",
    fecha: "2026-07-05",
    artistaIds: ["fernanda-solis"],
    media: [],
    publicado: true,
  },
];

/**
 * Filtra por tipo (o "todos") y por palabras clave. Cada palabra tiene que
 * aparecer en el título, resumen, texto, autor o nombre de algún artista,
 * sin importar mayúsculas ni tildes.
 */
export function filtrarRevista(
  lista: Publicacion[],
  tipo: TipoPublicacion | "todos",
  busqueda: string,
  nombreArtista: (id: string) => string | undefined,
): Publicacion[] {
  const palabras = normalizar(busqueda).split(/\s+/).filter(Boolean);
  return lista.filter((p) => {
    if (tipo !== "todos" && p.tipo !== tipo) return false;
    if (palabras.length === 0) return true;
    const texto = normalizar(
      [p.titulo, p.resumen, p.cuerpo, p.autor, ...p.artistaIds.map((id) => nombreArtista(id) ?? "")].join(" "),
    );
    return palabras.every((w) => texto.includes(w));
  });
}
