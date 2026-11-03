"use client";

import { useState } from "react";
import { useContent } from "@/context/ContentContext";

const inputCls =
  "w-full border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#c2185b]";

/**
 * Elige artistas del catálogo. Con `multiple` admite varios (exposiciones),
 * si no, uno solo (tienda). Permite crear un artista nuevo ahí mismo solo con
 * el nombre; la bio y la foto se completan después en "Artistas".
 */
export function ArtistaPicker({
  label,
  value,
  onChange,
  multiple,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (ids: string[]) => void;
  multiple?: boolean;
  hint?: string;
}) {
  const { artistas, artistaPorId, addArtista } = useContent();
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disponibles = artistas.filter((a) => !value.includes(a.id));

  function agregar(id: string) {
    if (!id) return;
    onChange(multiple ? [...value, id] : [id]);
  }

  function quitar(id: string) {
    onChange(value.filter((v) => v !== id));
  }

  async function crear() {
    const nombre = nuevoNombre.trim();
    if (!nombre) return;
    setCreando(true);
    setError(null);
    try {
      const artista = await addArtista({ nombre, region: "", bio: "", instagram: "", fotoUrl: null });
      agregar(artista.id);
      setNuevoNombre("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el artista.");
    } finally {
      setCreando(false);
    }
  }

  return (
    <div>
      <label className="block text-sm text-neutral-600">{label}</label>

      {value.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {value.map((id) => (
            <li
              key={id}
              className="flex items-center gap-2 border border-black/10 px-3 py-1 text-sm text-neutral-800"
            >
              {artistaPorId(id)?.nombre ?? id}
              <button
                type="button"
                aria-label="Quitar artista"
                onClick={() => quitar(id)}
                className="text-neutral-400 hover:text-[#c2185b]"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {(multiple || value.length === 0) && (
        <select
          value=""
          onChange={(e) => agregar(e.target.value)}
          className={`mt-2 ${inputCls}`}
        >
          <option value="">
            {disponibles.length > 0 ? "Elegir del catálogo…" : "No hay más artistas en el catálogo"}
          </option>
          {disponibles.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
              {a.region ? ` — ${a.region}` : ""}
            </option>
          ))}
        </select>
      )}

      {(multiple || value.length === 0) && (
        <div className="mt-2 flex gap-2">
          <input
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void crear();
              }
            }}
            placeholder="¿No está? Escribe el nombre para crearlo"
            className={`flex-1 ${inputCls}`}
          />
          <button
            type="button"
            onClick={() => void crear()}
            disabled={creando || !nuevoNombre.trim()}
            className="border border-neutral-900 px-3 py-1.5 text-xs text-neutral-900 transition-colors hover:border-[#c2185b] hover:text-[#c2185b] disabled:opacity-40"
          >
            {creando ? "Creando…" : "Crear"}
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-[#c2185b]">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}
