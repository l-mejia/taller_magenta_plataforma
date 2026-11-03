"use client";

import { useRef, useState } from "react";
import type { MediaItem } from "@/data/media";
import { MediaDisplay } from "@/components/MediaDisplay";
import { toLightweightBlob } from "@/lib/image";
import { uploadImagen } from "@/lib/storage";
import { parseVideoUrl } from "@/lib/video";

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaGalleryField({
  label,
  value,
  onChange,
  allowVideo,
  carpeta,
}: {
  label: string;
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  allowVideo?: boolean;
  /** Carpeta dentro del bucket de Storage donde se guardan las fotos subidas. */
  carpeta: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [status, setStatus] = useState<{ text: string; warn: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

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
        const blob = await toLightweightBlob(file);
        bytes += blob.size;
        nuevos.push({ url: await uploadImagen(blob, carpeta), tipo: "imagen" });
      }
      setStatus({
        text: `${nuevos.length === 1 ? "Imagen subida" : `${nuevos.length} imágenes subidas`} (${formatBytes(bytes)}). Recuerda guardar.`,
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
        <ul className="mt-2 space-y-2">
          {value.map((item, i) => (
            <li key={item.url + i} className="flex items-center gap-3">
              <MediaDisplay
                src={item.url}
                tipo={item.tipo}
                alt={`${label} ${i + 1}`}
                className="h-16 w-16 shrink-0 rounded-sm"
              />
              <span className="flex-1 truncate text-xs text-neutral-400">
                {item.tipo === "video" ? "Video" : "Imagen"} {i + 1}
                {i === 0 ? " · portada" : ""}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-neutral-400 hover:text-[#c2185b] disabled:opacity-30"
                  aria-label="Mover antes"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  className="text-neutral-400 hover:text-[#c2185b] disabled:opacity-30"
                  aria-label="Mover después"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="text-neutral-400 hover:text-[#c2185b]"
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 space-y-2">
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
            placeholder={
              allowVideo ? "Pega un link de YouTube, Vimeo o de una imagen…" : "Pega una URL de imagen…"
            }
            className="flex-1 border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="border border-neutral-900 px-3 py-1.5 text-xs text-neutral-900 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
          >
            Agregar link
          </button>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="border border-neutral-900 px-3 py-1.5 text-xs text-neutral-900 transition-colors hover:border-[#c2185b] hover:text-[#c2185b] disabled:opacity-50"
        >
          {loading ? "Subiendo…" : "Subir fotos"}
        </button>

        {status && (
          <p className={`text-xs ${status.warn ? "text-[#c2185b]" : "text-neutral-400"}`}>
            {status.text}
          </p>
        )}
        {!status && (
          <p className="text-xs text-neutral-400">
            La primera de la lista es la portada. Las fotos se optimizan al subirlas
            {allowVideo ? "; los videos se agregan pegando su link de YouTube o Vimeo" : ""}.
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
