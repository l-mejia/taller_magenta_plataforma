"use client";

import { useRef, useState, type FormEvent } from "react";
import { hoyIso, tiposPublicacion, type Publicacion } from "@/data/revista";
import { ArtistaPicker } from "@/components/admin/ArtistaPicker";
import { MediaGalleryField } from "@/components/admin/MediaGalleryField";
import { Seccion } from "@/components/admin/ExposicionForm";

type PublicacionData = Omit<Publicacion, "id">;

const inputCls =
  "mt-1 w-full border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#c2185b]";

function vacio(): PublicacionData {
  return {
    tipo: "articulo",
    titulo: "",
    resumen: "",
    cuerpo: "",
    autor: "",
    fecha: hoyIso(),
    artistaIds: [],
    media: [],
    publicado: false,
  };
}

export function PublicacionForm({
  initial,
  onSubmit,
}: {
  initial?: Publicacion;
  onSubmit: (data: PublicacionData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [data, setData] = useState<PublicacionData>(initial ?? vacio);
  const [guardando, setGuardando] = useState<"borrador" | "publicar" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof PublicacionData>(key: K, value: PublicacionData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function guardar(publicar: boolean) {
    if (!formRef.current?.reportValidity()) return;
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
      <Seccion titulo="1 · Datos">
        <div>
          <span className="block text-sm text-neutral-600">Tipo</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {tiposPublicacion.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => set("tipo", t.key)}
                aria-pressed={data.tipo === t.key}
                className={`border px-4 py-2 text-sm transition-colors ${
                  data.tipo === t.key
                    ? "border-[#c2185b] bg-[#c2185b] text-white"
                    : "border-black/10 text-neutral-700 hover:border-[#c2185b]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-neutral-600" htmlFor="pub-titulo">
            Título
          </label>
          <input
            id="pub-titulo"
            required
            value={data.titulo}
            onChange={(e) => set("titulo", e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-neutral-600" htmlFor="pub-fecha">
              Fecha
            </label>
            <input
              id="pub-fecha"
              type="date"
              required
              value={data.fecha}
              onChange={(e) => set("fecha", e.target.value)}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-neutral-400">La revista se ordena por esta fecha.</p>
          </div>
          <div>
            <label className="block text-sm text-neutral-600" htmlFor="pub-autor">
              Autor / firma
            </label>
            <input
              id="pub-autor"
              value={data.autor}
              onChange={(e) => set("autor", e.target.value)}
              placeholder="Ej. Nuria Cano"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-neutral-600" htmlFor="pub-resumen">
            Resumen
          </label>
          <textarea
            id="pub-resumen"
            required
            rows={2}
            value={data.resumen}
            onChange={(e) => set("resumen", e.target.value)}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-neutral-400">
            Una o dos líneas; se muestra en la lista de la revista.
          </p>
        </div>
      </Seccion>

      <Seccion titulo="2 · Texto">
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="pub-cuerpo">
            {data.tipo === "entrevista" ? "Entrevista completa" : "Texto completo"}
          </label>
          <textarea
            id="pub-cuerpo"
            required
            rows={16}
            value={data.cuerpo}
            onChange={(e) => set("cuerpo", e.target.value)}
            className={`${inputCls} leading-relaxed`}
          />
          <p className="mt-1 text-xs text-neutral-400">
            Separa los párrafos con una línea en blanco.
            {data.tipo === "entrevista" &&
              " Las líneas que terminan en signo de interrogación se muestran como preguntas, en negrita."}
          </p>
        </div>
      </Seccion>

      <Seccion titulo="3 · Artistas relacionados (opcional)">
        <ArtistaPicker
          label={data.tipo === "entrevista" ? "Artista entrevistado/a" : "Artistas mencionados"}
          multiple
          value={data.artistaIds}
          onChange={(ids) => set("artistaIds", ids)}
          hint="Se muestran al final, con un enlace a su ficha. También sirven para la búsqueda."
        />
      </Seccion>

      <Seccion titulo="4 · Fotos y videos">
        <MediaGalleryField
          label="La primera es la portada"
          value={data.media}
          allowVideo
          conFicha
          carpeta="revista"
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
        Los borradores solo los ves tú; al publicar aparece en la revista.
      </p>
    </form>
  );
}
