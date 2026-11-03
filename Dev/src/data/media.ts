/** Ficha de la obra que aparece en una foto (opcional, sobre todo en exposiciones). */
export interface FichaObra {
  titulo?: string;
  artistaId?: string;
  tecnica?: string;
  medidas?: string;
  ano?: number;
}

export interface MediaItem {
  url: string;
  tipo: "imagen" | "video";
  /** Pie de foto. */
  descripcion?: string;
  obra?: FichaObra;
}

export function tieneFicha(obra?: FichaObra): obra is FichaObra {
  return !!obra && Object.values(obra).some((v) => v !== undefined && v !== "");
}
