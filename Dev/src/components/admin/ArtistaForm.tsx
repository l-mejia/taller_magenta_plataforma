"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Artista } from "@/data/artistas";
import { MediaDisplay } from "@/components/MediaDisplay";
import { toLightweightBlob } from "@/lib/image";
import { uploadImagen } from "@/lib/storage";

type ArtistaData = Omit<Artista, "id">;

const vacio: ArtistaData = { nombre: "", region: "", bio: "", instagram: "", fotoUrl: null };

const inputCls =
  "mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]";

export function ArtistaForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Artista;
  submitLabel: string;
  onSubmit: (data: ArtistaData) => Promise<void>;
}) {
  const [data, setData] = useState<ArtistaData>(initial ?? vacio);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof ArtistaData>(key: K, value: ArtistaData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function subirFoto(file: File) {
    setSubiendo(true);
    setError(null);
    try {
      set("fotoUrl", await uploadImagen(await toLightweightBlob(file), "artistas"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la foto.");
    } finally {
      setSubiendo(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <MediaDisplay
          src={data.fotoUrl ?? undefined}
          alt={data.nombre || "Foto del artista"}
          className="h-24 w-24 shrink-0 rounded-full"
        />
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={subiendo}
            className="border border-neutral-900 px-3 py-1.5 text-xs text-neutral-900 transition-colors hover:border-[#c2185b] hover:text-[#c2185b] disabled:opacity-50"
          >
            {subiendo ? "Subiendo…" : data.fotoUrl ? "Cambiar foto" : "Subir foto"}
          </button>
          {data.fotoUrl && (
            <button
              type="button"
              onClick={() => set("fotoUrl", null)}
              className="block text-xs text-neutral-400 hover:text-[#c2185b]"
            >
              Quitar foto
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void subirFoto(file);
            e.target.value = "";
          }}
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-600" htmlFor="artista-nombre">
          Nombre
        </label>
        <input
          id="artista-nombre"
          required
          value={data.nombre}
          onChange={(e) => set("nombre", e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="artista-region">
            Región de origen
          </label>
          <input
            id="artista-region"
            value={data.region}
            onChange={(e) => set("region", e.target.value)}
            placeholder="Ej. Cusco"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="artista-instagram">
            Instagram
          </label>
          <input
            id="artista-instagram"
            value={data.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            placeholder="usuario, sin @"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-600" htmlFor="artista-bio">
          Bio
        </label>
        <textarea
          id="artista-bio"
          rows={6}
          value={data.bio}
          onChange={(e) => set("bio", e.target.value)}
          className={inputCls}
        />
        <p className="mt-1 text-xs text-neutral-400">
          Se muestra en cada exposición donde participa.
        </p>
      </div>

      {error && <p className="text-sm text-[#c2185b]">{error}</p>}

      <button
        type="submit"
        disabled={guardando || subiendo}
        className="w-full bg-neutral-900 py-3 text-sm text-white transition-colors hover:bg-[#c2185b] disabled:opacity-60"
      >
        {guardando ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}
