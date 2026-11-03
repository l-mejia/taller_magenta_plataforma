"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Exposicion } from "@/data/exposiciones";
import { ArtistaPicker } from "@/components/admin/ArtistaPicker";
import { MediaGalleryField } from "@/components/admin/MediaGalleryField";

type ExposicionData = Omit<Exposicion, "id">;

const vacio: ExposicionData = {
  titulo: "",
  descripcion: "",
  parrafoExplicativo: "",
  fechaInicio: null,
  fechaFin: null,
  artistaIds: [],
  media: [],
  publicado: false,
};

const inputCls =
  "mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]";

export function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5 border-t border-black/10 pt-6">
      <legend className="pr-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
        {titulo}
      </legend>
      {children}
    </fieldset>
  );
}

export function ExposicionForm({
  initial,
  onSubmit,
}: {
  initial?: Exposicion;
  onSubmit: (data: ExposicionData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [data, setData] = useState<ExposicionData>(initial ?? vacio);
  const [guardando, setGuardando] = useState<"borrador" | "publicar" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ExposicionData>(key: K, value: ExposicionData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function guardar(publicar: boolean) {
    if (!formRef.current?.reportValidity()) return;
    if (publicar && data.artistaIds.length === 0) {
      setError("Agrega al menos un artista antes de publicar.");
      return;
    }
    if (data.fechaInicio && data.fechaFin && data.fechaFin < data.fechaInicio) {
      setError("La fecha de cierre es anterior a la de inauguración.");
      return;
    }
    setGuardando(publicar ? "publicar" : "borrador");
    setError(null);
    try {
      await onSubmit({ ...data, publicado: publicar });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
      setGuardando(null);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void guardar(data.publicado);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
      <Seccion titulo="1 · Datos generales">
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="expo-titulo">
            Título
          </label>
          <input
            id="expo-titulo"
            required
            value={data.titulo}
            onChange={(e) => set("titulo", e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-neutral-600" htmlFor="expo-inicio">
              Inauguración
            </label>
            <input
              id="expo-inicio"
              type="date"
              value={data.fechaInicio ?? ""}
              onChange={(e) => set("fechaInicio", e.target.value || null)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-600" htmlFor="expo-fin">
              Cierre (opcional)
            </label>
            <input
              id="expo-fin"
              type="date"
              value={data.fechaFin ?? ""}
              onChange={(e) => set("fechaFin", e.target.value || null)}
              className={inputCls}
            />
          </div>
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
            className={inputCls}
          />
          <p className="mt-1 text-xs text-neutral-400">
            Una o dos líneas; se muestra en la tarjeta de la lista de exposiciones.
          </p>
        </div>

        <div>
          <label className="block text-sm text-neutral-600" htmlFor="expo-parrafo">
            Texto curatorial
          </label>
          <textarea
            id="expo-parrafo"
            required
            rows={8}
            value={data.parrafoExplicativo}
            onChange={(e) => set("parrafoExplicativo", e.target.value)}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-neutral-400">
            Describe la exposición en general. Los saltos de línea se respetan.
          </p>
        </div>
      </Seccion>

      <Seccion titulo="2 · Artistas">
        <ArtistaPicker
          label="Artistas de la exposición"
          multiple
          value={data.artistaIds}
          onChange={(ids) => set("artistaIds", ids)}
          hint="En la página de la exposición se muestran en este orden, con su bio."
        />
      </Seccion>

      <Seccion titulo="3 · Fotos y videos">
        <MediaGalleryField
          label="Cada foto puede llevar su descripción y la ficha de la obra"
          value={data.media}
          allowVideo
          conFicha
          carpeta="exposiciones"
          onChange={(media) => set("media", media)}
        />
      </Seccion>

      {error && <p className="text-sm text-[#c2185b]">{error}</p>}

      <div className="flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row">
        <button
          type="button"
          onClick={() => void guardar(false)}
          disabled={guardando !== null}
          className="flex-1 border border-neutral-900 py-3 text-sm text-neutral-900 transition-colors hover:border-[#c2185b] hover:text-[#c2185b] disabled:opacity-60"
        >
          {guardando === "borrador" ? "Guardando…" : data.publicado ? "Pasar a borrador" : "Guardar borrador"}
        </button>
        <button
          type="button"
          onClick={() => void guardar(true)}
          disabled={guardando !== null}
          className="flex-1 bg-neutral-900 py-3 text-sm text-white transition-colors hover:bg-[#c2185b] disabled:opacity-60"
        >
          {guardando === "publicar" ? "Publicando…" : data.publicado ? "Guardar y mantener publicada" : "Publicar"}
        </button>
      </div>
      <p className="-mt-6 text-xs text-neutral-400">
        Los borradores solo los ves tú; al publicar aparece en la web.
      </p>
    </form>
  );
}
