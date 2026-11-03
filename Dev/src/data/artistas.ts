import { slugify } from "@/lib/id";

export interface Artista {
  id: string;
  nombre: string;
  region: string;
  bio: string;
  /** Usuario sin @, ej. "magenta.galeria". */
  instagram: string;
  fotoUrl: string | null;
}

const regiones = ["Lima", "Cusco", "Arequipa", "Puno", "Ayacucho", "Piura", "Loreto", "Cajamarca"];

const nombres = [
  "Taller Magenta",
  "Nuria Cano",
  "María Rojas",
  "Carlos Paredes",
  "Fernanda Solís",
  "Joaquín Vega",
  "Renata Salazar",
  "Sebastián Cruz",
  "Antonella Vidal",
  "Diego Farfán",
  "Camila Ruiz",
  "Mateo Salinas",
  "Lucía Ibarra",
  "Andrés Quiroz",
  "Valeria Núñez",
  "Ignacio Prado",
];

/** Catálogo de ejemplo: incluye a todos los autores usados en el seed de tienda. */
export const artistas: Artista[] = nombres.map((nombre, i) => ({
  id: slugify(nombre),
  nombre,
  region: regiones[i % regiones.length],
  bio:
    nombre === "Taller Magenta"
      ? "Colectivo de artistas residentes del Taller Magenta."
      : `${nombre} es artista visual. Su obra explora la memoria, el territorio y los materiales de su región.`,
  instagram: "",
  fotoUrl: null,
}));

export function artistaIdDe(nombre: string): string {
  return slugify(nombre);
}
