"use client";

import { useRef, useState } from "react";
import { tieneFicha, type FichaObra, type MediaItem } from "@/data/media";
import { MediaDisplay } from "@/components/MediaDisplay";
import { useContent } from "@/context/ContentContext";
import { toLightweightBlob } from "@/lib/image";
import { uploadImagen } from "@/lib/storage";
import { parseVideoUrl } from "@/lib/video";

const inputCls =
  "w-full border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#c2185b]";

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaGalleryField({
  label,
  value,
  onChange,
  allowVideo,
  carpeta,
  conFicha,
}: {
  label: string;
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  allowVideo?: boolean;
  /** Carpeta dentro del bucket de Storage donde se guardan las fotos subidas. */
  carpeta: string;
  /** Muestra la ficha de obra (título, artista, técnica…) en cada foto. */
  conFicha?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [status, setStatus] = useState<{ text: string; warn: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  function patchAt(i: number, patch: Partial<MediaItem>) {
    onChange(value.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function move(i: number, delta: number) {
    const j = i + delta;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  async function handleFiles(files: File[]) {
    setStatus(null);
    const imagenes = files.filter((f) => f.type.startsWith("image/"));
    if (imagenes.length < files.length) {
      setStatus({
        text: "Los videos no se suben como archivo: súbelos a YouTube o Vimeo y pega el link.",
        warn: true,
      });
    }
    if (imagenes.length === 0) return;

    setLoading(true);
    const nuevos: MediaItem[] = [];
    let bytes = 0;
    try {
      for (const file of imagenes) {
        setStatus({ text: `Subiendo ${nuevos.length + 1} de ${imagenes.length}…`, warn: false });
        const blob = await toLightweightBlob(file);
        bytes += blob.size;
        nuevos.push({ url: await uploadImagen(blob, carpeta), tipo: "imagen" });
      }
      setStatus({
        text: `${nuevos.length === 1 ? "Imagen subida" : `${nuevos.length} imágenes subidas`} (${formatBytes(bytes)}). Agrega su descripción y recuerda guardar.`,
        warn: false,
      });
    } catch (e) {
      setStatus({ text: e instanceof Error ? e.message : "No se pudo subir la imagen.", warn: true });
    } finally {
      if (nuevos.length > 0) onChange([...value, ...nuevos]);
      setLoading(false);
    }
  }

  function handleAddUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    const esVideo = parseVideoUrl(url) !== null;
    if (esVideo && !allowVideo) {
      setStatus({ text: "Aquí solo se pueden agregar imágenes.", warn: true });
      return;
    }
    onChange([...value, { url, tipo: esVideo ? "video" : "imagen" }]);
    setUrlDraft("");
    setStatus(null);
  }

  return (
    <div>
      <label className="block text-sm text-neutral-600">{label}</label>

      {value.length > 0 && (
        <ul className="mt-2 divide-y divide-black/5 border border-black/10">
          {value.map((item, i) => (
            <li key={item.url + i} className="space-y-3 p-3">
              <div className="flex items-center gap-3">
                <MediaDisplay
                  src={item.url}
                  tipo={item.tipo}
                  alt={item.descripcion || `${label} ${i + 1}`}
                  className="h-20 w-20 shrink-0 rounded-sm"
                />
                <span className="flex-1 text-xs text-neutral-400">
                  {item.tipo === "video" ? "Video" : "Foto"} {i + 1}
                  {i === 0 ? " · portada" : ""}
                </span>
                <div className="flex items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="p-1 text-neutral-400 hover:text-[#c2185b] disabled:opacity-30"
                    aria-label="Mover antes"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    className="p-1 text-neutral-400 hover:text-[#c2185b] disabled:opacity-30"
                    aria-label="Mover después"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="text-xs text-neutral-400 hover:text-[#c2185b]"
                  >
                    Quitar
                  </button>
                </div>
              </div>

              <textarea
                rows={2}
                value={item.descripcion ?? ""}
                onChange={(e) => patchAt(i, { descripcion: e.target.value })}
                placeholder="Descripción o pie de foto (opcional)"
                className={inputCls}
              />

              {conFicha && (
                <FichaObraFields
                  value={item.obra}
                  onChange={(obra) => patchAt(i, { obra: tieneFicha(obra) ? obra : undefined })}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 space-y-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full border border-dashed border-neutral-400 px-3 py-4 text-sm text-neutral-700 transition-colors hover:border-[#c2185b] hover:text-[#c2185b] disabled:opacity-50"
        >
          {loading ? "Subiendo…" : "+ Subir fotos (puedes elegir varias)"}
        </button>

        <div className="flex gap-2">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            placeholder={allowVideo ? "O pega un link de YouTube / Vimeo…" : "O pega la URL de una imagen…"}
            className={`flex-1 ${inputCls}`}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="border border-neutral-900 px-3 py-1.5 text-xs text-neutral-900 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
          >
            Agregar
          </button>
        </div>

        {status && (
          <p className={`text-xs ${status.warn ? "text-[#c2185b]" : "text-neutral-400"}`}>
            {status.text}
          </p>
        )}
        {!status && (
          <p className="text-xs text-neutral-400">
            La primera de la lista es la portada; usa las flechas para reordenar. Las fotos se optimizan al subirlas.
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) void handleFiles(files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

function FichaObraFields({
  value,
  onChange,
}: {
  value?: FichaObra;
  onChange: (obra: FichaObra) => void;
}) {
  const { artistas } = useContent();
  const obra = value ?? {};

  function set<K extends keyof FichaObra>(key: K, v: FichaObra[K]) {
    onChange({ ...obra, [key]: v === "" ? undefined : v });
  }

  return (
    <details open={tieneFicha(value)} className="text-sm">
      <summary className="cursor-pointer text-xs text-neutral-500 hover:text-[#c2185b]">
        Ficha de la obra (opcional)
      </summary>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <input
          value={obra.titulo ?? ""}
          onChange={(e) => set("titulo", e.target.value)}
          placeholder="Título de la obra"
          className={inputCls}
        />
        <select
          value={obra.artistaId ?? ""}
          onChange={(e) => set("artistaId", e.target.value)}
          className={inputCls}
        >
          <option value="">Artista…</option>
          {artistas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>
        <input
          value={obra.tecnica ?? ""}
          onChange={(e) => set("tecnica", e.target.value)}
          placeholder="Técnica"
          className={inputCls}
        />
        <input
          value={obra.medidas ?? ""}
          onChange={(e) => set("medidas", e.target.value)}
          placeholder="Medidas"
          className={inputCls}
        />
        <input
          type="number"
          value={obra.ano ?? ""}
          onChange={(e) => set("ano", e.target.value ? Number(e.target.value) : undefined)}
          placeholder="Año"
          className={inputCls}
        />
      </div>
    </details>
  );
}
