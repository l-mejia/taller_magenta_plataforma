"use client";

import { useRef, useState } from "react";
import type { MediaItem } from "@/data/media";
import { MediaDisplay } from "@/components/MediaDisplay";
import { toLightweightDataUrl, dataUrlBytes } from "@/lib/image";

const VIDEO_WARN_BYTES = 5 * 1024 * 1024;
const VIDEO_MAX_BYTES = 15 * 1024 * 1024;

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaGalleryField({
  label,
  value,
  onChange,
  allowVideo,
}: {
  label: string;
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  allowVideo?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [status, setStatus] = useState<{ text: string; warn: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  function addItem(item: MediaItem) {
    onChange([...value, item]);
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

  async function handleFile(file: File) {
    setStatus(null);

    if (file.type.startsWith("video")) {
      if (file.size > VIDEO_MAX_BYTES) {
        setStatus({
          text: `El video pesa ${formatBytes(file.size)}. Usa uno más liviano (menos de ${formatBytes(VIDEO_MAX_BYTES)}).`,
          warn: true,
        });
        return;
      }
      setLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        addItem({ url: String(reader.result), tipo: "video" });
        setLoading(false);
        setStatus(
          file.size > VIDEO_WARN_BYTES
            ? { text: `Video agregado (${formatBytes(file.size)}). Es bastante pesado, si puedes usa uno más corto.`, warn: true }
            : { text: `Video agregado (${formatBytes(file.size)}).`, warn: false },
        );
      };
      reader.readAsDataURL(file);
      return;
    }

    setLoading(true);
    try {
      const dataUrl = await toLightweightDataUrl(file);
      addItem({ url: dataUrl, tipo: "imagen" });
      const bytes = dataUrlBytes(dataUrl);
      setStatus({ text: `Imagen agregada (${formatBytes(bytes)}).`, warn: bytes > 1.5 * 1024 * 1024 });
    } catch {
      setStatus({ text: "No se pudo procesar la imagen.", warn: true });
    } finally {
      setLoading(false);
    }
  }

  function handleAddUrl() {
    if (!urlDraft.trim()) return;
    addItem({ url: urlDraft.trim(), tipo: "imagen" });
    setUrlDraft("");
  }

  return (
    <div>
      <label className="block text-sm text-neutral-600">{label}</label>

      {value.length > 0 && (
        <ul className="mt-2 space-y-2">
          {value.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
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
            placeholder="Pega una URL de imagen…"
            className="flex-1 border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="border border-neutral-900 px-3 py-1.5 text-xs text-neutral-900 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
          >
            Agregar URL
          </button>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="border border-neutral-900 px-3 py-1.5 text-xs text-neutral-900 transition-colors hover:border-[#c2185b] hover:text-[#c2185b] disabled:opacity-50"
        >
          {loading ? "Procesando…" : "Subir archivo"}
        </button>

        {status && (
          <p className={`text-xs ${status.warn ? "text-[#c2185b]" : "text-neutral-400"}`}>
            {status.text}
          </p>
        )}
        {!status && (
          <p className="text-xs text-neutral-400">
            La primera foto o video de la lista es la portada. Puedes agregar varias; se optimizan automáticamente al subirlas.
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={allowVideo ? "image/*,video/*" : "image/*"}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
