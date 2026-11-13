"use client";

import { tiposPublicacion, type TipoPublicacion } from "@/data/revista";

export type FiltroTipo = TipoPublicacion | "todos";

/** Pestañas Todos / Artículos / Noticias / Entrevistas + buscador por palabra clave. */
export function FiltrosRevista({
  tipo,
  onTipo,
  busqueda,
  onBusqueda,
  conteo,
}: {
  tipo: FiltroTipo;
  onTipo: (t: FiltroTipo) => void;
  busqueda: string;
  onBusqueda: (q: string) => void;
  conteo: Record<FiltroTipo, number>;
}) {
  const pestanas: { key: FiltroTipo; label: string }[] = [
    { key: "todos", label: "Todos" },
    ...tiposPublicacion.map((t) => ({ key: t.key, label: t.plural })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-6 overflow-x-auto overflow-y-hidden border-b border-black/5 text-sm">
        {pestanas.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onTipo(p.key)}
            className={`-mb-px shrink-0 border-b-2 pb-3 transition-colors ${
              tipo === p.key
                ? "border-[#c2185b] text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {p.label} <span className="text-xs text-neutral-400">{conteo[p.key]}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          placeholder="Buscar por palabra clave, artista o autor…"
          aria-label="Buscar en la revista"
          className="w-full border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-[#c2185b]"
        />
      </div>
    </div>
  );
}

export function contarPorTipo<T extends { tipo: TipoPublicacion }>(lista: T[]): Record<FiltroTipo, number> {
  const conteo: Record<FiltroTipo, number> = { todos: lista.length, articulo: 0, noticia: 0, entrevista: 0 };
  for (const p of lista) conteo[p.tipo] += 1;
  return conteo;
}
