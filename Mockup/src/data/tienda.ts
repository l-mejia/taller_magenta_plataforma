import { slugify } from "@/lib/id";
import type { MediaItem } from "@/data/media";

export type CategoriaTienda = "obras" | "utilitario" | "editorial";

export const categoriasTienda: { key: CategoriaTienda; label: string }[] = [
  { key: "obras", label: "Obras de arte" },
  { key: "utilitario", label: "Arte utilitario" },
  { key: "editorial", label: "Arte editorial" },
];

export interface ItemTienda {
  id: string;
  categoria: CategoriaTienda;
  tipo: string;
  media: MediaItem[];
  titulo: string;
  autor: string;
  precio: string;
  descripcion: string;
  medidas: string;
  tecnica: string;
  ano: number;
  stock: number;
}

function formatPrecio(monto: number): string {
  return `S/ ${monto.toLocaleString("es-PE")}`;
}

function descripcionGenerica(tipo: string, tecnica: string, ano: number): string {
  return `${tipo} realizado en ${tecnica.toLowerCase()}, ${ano}.`;
}

const obrasAutores = [
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
];

const obrasCategorias = [
  { tipo: "Cuadro", tecnica: "Óleo sobre lienzo", medidas: "60 x 80 cm", precioBase: 2800 },
  { tipo: "Escultura", tecnica: "Madera y metal", medidas: "30 x 20 x 15 cm", precioBase: 4200 },
  { tipo: "Grabado", tecnica: "Xilografía sobre papel", medidas: "35 x 25 cm", precioBase: 1500 },
  { tipo: "Fotografía", tecnica: "Impresión fine art", medidas: "40 x 60 cm", precioBase: 1800 },
  { tipo: "Cerámica", tecnica: "Gres esmaltado", medidas: "25 x 18 cm", precioBase: 2100 },
  { tipo: "Instalación", tecnica: "Técnica mixta", medidas: "Dimensiones variables", precioBase: 6500 },
  { tipo: "Dibujo", tecnica: "Carboncillo sobre papel", medidas: "29 x 21 cm", precioBase: 1200 },
];

const obrasNombres = [
  "Memoria expandida",
  "Aire en fuga",
  "Cuerpo de agua",
  "Silencio útil",
  "Paisaje interior",
  "Fragmento 09",
  "Herida luminosa",
  "Doble exposición",
  "Materia oscura",
  "Después del ruido",
  "Campo abierto",
  "Retrato ausente",
  "Línea de fuga",
  "Vestigio",
  "Suspensión",
  "Piel de la ciudad",
  "Eco doméstico",
  "Umbral segundo",
  "Peso específico",
  "Deriva continua",
];

const obras: ItemTienda[] = obrasNombres.map((nombre, i) => {
  const categoria = obrasCategorias[i % obrasCategorias.length];
  const autor = obrasAutores[i % obrasAutores.length];
  const ano = 2022 + (i % 3);
  const precio = categoria.precioBase + i * 120;
  return {
    id: slugify(`${categoria.tipo}-${nombre}-${i}`),
    categoria: "obras",
    autor,
    medidas: categoria.medidas,
    titulo: nombre,
    tecnica: categoria.tecnica,
    ano,
    precio: formatPrecio(precio),
    tipo: categoria.tipo,
    media: [],
    descripcion: descripcionGenerica(categoria.tipo, categoria.tecnica, ano),
    stock: 1 + (i % 3),
  };
});

const utilitarioAutores = [
  "Taller Magenta",
  "Nuria Cano",
  "Renata Salazar",
  "Diego Farfán",
  "Lucía Ibarra",
  "Andrés Quiroz",
  "Camila Ruiz",
  "Mateo Salinas",
  "Valeria Núñez",
  "Ignacio Prado",
];

const utilitarioCategorias = [
  { tipo: "Llavero", tecnica: "Acrílico y metal", medidas: "5 x 3 cm", precioBase: 40 },
  { tipo: "Bolsa", tecnica: "Serigrafía textil", medidas: "40 x 35 cm", precioBase: 90 },
  { tipo: "Taza", tecnica: "Cerámica esmaltada", medidas: "9 x 8 cm", precioBase: 55 },
  { tipo: "Cuaderno", tecnica: "Papel reciclado, tapa serigrafiada", medidas: "21 x 15 cm", precioBase: 35 },
  { tipo: "Aretes", tecnica: "Resina y metal", medidas: "4 x 1.5 cm", precioBase: 60 },
  { tipo: "Pin", tecnica: "Esmalte sobre metal", medidas: "3 x 3 cm", precioBase: 25 },
  { tipo: "Póster", tecnica: "Impresión offset", medidas: "50 x 70 cm", precioBase: 65 },
  { tipo: "Camiseta", tecnica: "Serigrafía textil", medidas: "Talla única", precioBase: 80 },
];

const utilitarioNombres = [
  "Magenta",
  "Barranco",
  "Ola",
  "Sol de tarde",
  "Quebrada",
  "Malecón",
  "Constelación",
  "Raíz",
  "Vuelo",
  "Bruma",
  "Litoral",
  "Umbral chico",
  "Semilla",
  "Trazo mínimo",
  "Deriva",
  "Marejada",
  "Ceniza",
  "Follaje",
  "Puente",
  "Horizonte corto",
];

const utilitario: ItemTienda[] = utilitarioNombres.map((nombre, i) => {
  const categoria = utilitarioCategorias[i % utilitarioCategorias.length];
  const autor = utilitarioAutores[i % utilitarioAutores.length];
  const ano = 2022 + (i % 3);
  const precio = categoria.precioBase + i * 4;
  return {
    id: slugify(`${categoria.tipo}-${nombre}-${i}`),
    categoria: "utilitario",
    autor,
    medidas: categoria.medidas,
    titulo: nombre,
    tecnica: categoria.tecnica,
    ano,
    precio: formatPrecio(precio),
    tipo: categoria.tipo,
    media: [],
    descripcion: descripcionGenerica(categoria.tipo, categoria.tecnica, ano),
    stock: 4 + (i % 8),
  };
});

const editorialAutores = [
  "Taller Magenta",
  "María Rojas",
  "Diego Farfán",
  "Lucía Ibarra",
  "Fernanda Solís",
  "Joaquín Vega",
  "Antonella Vidal",
  "Mateo Salinas",
];

const editorialCategorias = [
  { tipo: "Libro", tecnica: "Edición de autor, tapa dura", medidas: "21 x 14 cm", precioBase: 85 },
  { tipo: "Zine", tecnica: "Fotocopia grapada", medidas: "21 x 15 cm", precioBase: 25 },
  { tipo: "Edición limitada", tecnica: "Serigrafía en tiraje corto", medidas: "30 x 40 cm", precioBase: 180 },
  { tipo: "Cuaderno de artista", tecnica: "Encuadernado a mano", medidas: "18 x 13 cm", precioBase: 60 },
  { tipo: "Postal", tecnica: "Impresión offset, set de 5", medidas: "10 x 15 cm", precioBase: 20 },
];

const editorialNombres = [
  "Bitácora de taller",
  "Apuntes de Barranco",
  "Correspondencias",
  "Archivo mínimo",
  "Postales del ruido",
  "Diario de proceso",
  "Cuadernos del litoral",
  "Ediciones de bolsillo",
  "Notas de estudio",
  "Registro breve",
  "Papeles sueltos",
  "Crónica menor",
];

const editorial: ItemTienda[] = editorialNombres.map((nombre, i) => {
  const categoria = editorialCategorias[i % editorialCategorias.length];
  const autor = editorialAutores[i % editorialAutores.length];
  const ano = 2022 + (i % 3);
  const precio = categoria.precioBase + i * 6;
  return {
    id: slugify(`${categoria.tipo}-${nombre}-${i}`),
    categoria: "editorial",
    autor,
    medidas: categoria.medidas,
    titulo: nombre,
    tecnica: categoria.tecnica,
    ano,
    precio: formatPrecio(precio),
    tipo: categoria.tipo,
    media: [],
    descripcion: descripcionGenerica(categoria.tipo, categoria.tecnica, ano),
    stock: 3 + (i % 6),
  };
});

export const tienda: ItemTienda[] = [...obras, ...utilitario, ...editorial];
