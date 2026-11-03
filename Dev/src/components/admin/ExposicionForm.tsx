"use client";

import { useState, type FormEvent } from "react";
import type { Exposicion } from "@/data/exposiciones";
import { MediaGalleryField } from "@/components/admin/MediaGalleryField";

type ExposicionData = Omit<Exposicion, "id">;

const vacio: ExposicionData = {
  titulo: "",
  descripcion: "",
  parrafoExplicativo: "",
  media: [],
  bioArtista: "",
};

export function ExposicionForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Exposicion;
  submitLabel: string;
  onSubmit: (data: ExposicionData) => Promise<void>;
}) {
  const [data, setData] = useState<ExposicionData>(initial ?? vacio);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function guardar(payload: ExposicionData) {
    setGuardando(true);
    setError(null);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
      setGuardando(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void guardar(data);
  }

  function set<K extends keyof ExposicionData>(key: K, value: ExposicionData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm text-neutral-600" htmlFor="expo-titulo">
          Título
        </label>
        <input
          id="expo-titulo"
          required
          value={data.titulo}
          onChange={(e) => set("titulo", e.target.value)}
          className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-600" htmlFor="expo-descripcion">
          Descripción breve
        </label>
        <textarea
          id="expo-descripcion"
          required
          rows={2}
          value={data.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
        />
        <p className="mt-1 text-xs text-neutral-400">
          Se muestra en la tarjeta de la lista de exposiciones.
        </p>
      </div>

      <MediaGalleryField
        label="Fotos o videos"
        value={data.media}
        allowVideo
        carpeta="exposiciones"
        onChange={(media) => set("media", media)}
      />

      <div>
        <label className="block text-sm text-neutral-600" htmlFor="expo-parrafo">
          Párrafo explicativo
        </label>
        <textarea
          id="expo-parrafo"
          required
          rows={6}
          value={data.parrafoExplicativo}
          onChange={(e) => set("parrafoExplicativo", e.target.value)}
          className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
        />
        <p className="mt-1 text-xs text-neutral-400">
          Texto curatorial que se muestra en la página de la exposición.
        </p>
      </div>

      <div>
        <label className="block text-sm text-neutral-600" htmlFor="expo-bio">
          Bio del artista
        </label>
        <textarea
          id="expo-bio"
          required
          rows={4}
          value={data.bioArtista}
          onChange={(e) => set("bioArtista", e.target.value)}
          className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
        />
      </div>

      {error && <p className="text-sm text-[#c2185b]">{error}</p>}

      <button
        type="submit"
        disabled={guardando}
        className="w-full bg-neutral-900 py-3 text-sm text-white transition-colors hover:bg-[#c2185b] disabled:opacity-60"
      >
        {guardando ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}
