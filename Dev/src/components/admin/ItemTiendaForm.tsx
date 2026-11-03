"use client";

import { useState, type FormEvent } from "react";
import { categoriasTienda, type ItemTienda } from "@/data/tienda";
import { formatMonto, parsePrecio } from "@/context/CartContext";
import { ArtistaPicker } from "@/components/admin/ArtistaPicker";
import { MediaGalleryField } from "@/components/admin/MediaGalleryField";
import { Seccion } from "@/components/admin/ExposicionForm";

type ItemData = Omit<ItemTienda, "id">;

const vacio: ItemData = {
  categoria: "obras",
  tipo: "",
  media: [],
  titulo: "",
  artistaId: null,
  autor: "",
  precio: "S/ 0",
  descripcion: "",
  medidas: "",
  tecnica: "",
  ano: new Date().getFullYear(),
  stock: 1,
  visible: true,
};

const inputCls =
  "mt-1 w-full border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#c2185b]";

function Campo({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm text-neutral-600" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function ItemTiendaForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: ItemTienda;
  submitLabel: string;
  onSubmit: (data: ItemData) => Promise<void>;
}) {
  const [data, setData] = useState<ItemData>(initial ?? vacio);
  const [precioInput, setPrecioInput] = useState(
    String(initial ? parsePrecio(initial.precio) : 0),
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ItemData>(key: K, value: ItemData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!data.artistaId && !data.autor.trim()) {
      setError("Elige el artista del producto.");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      await onSubmit({ ...data, precio: formatMonto(Number(precioInput) || 0) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Seccion titulo="1 · Producto">
        <Campo id="item-categoria" label="Categoría">
          <select
            id="item-categoria"
            value={data.categoria}
            onChange={(e) => set("categoria", e.target.value as ItemData["categoria"])}
            className={inputCls}
          >
            {categoriasTienda.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="item-titulo" label="Título">
            <input
              id="item-titulo"
              required
              value={data.titulo}
              onChange={(e) => set("titulo", e.target.value)}
              className={inputCls}
            />
          </Campo>
          <Campo id="item-tipo" label="Tipo (ej. Cuadro, Llavero, Libro)">
            <input
              id="item-tipo"
              required
              value={data.tipo}
              onChange={(e) => set("tipo", e.target.value)}
              className={inputCls}
            />
          </Campo>
        </div>

        <ArtistaPicker
          label="Artista"
          value={data.artistaId ? [data.artistaId] : []}
          onChange={(ids) => set("artistaId", ids[0] ?? null)}
        />
      </Seccion>

      <Seccion titulo="2 · Detalles">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="item-tecnica" label="Técnica">
            <input
              id="item-tecnica"
              required
              value={data.tecnica}
              onChange={(e) => set("tecnica", e.target.value)}
              className={inputCls}
            />
          </Campo>
          <Campo id="item-medidas" label="Medidas">
            <input
              id="item-medidas"
              required
              value={data.medidas}
              onChange={(e) => set("medidas", e.target.value)}
              className={inputCls}
            />
          </Campo>
          <Campo id="item-ano" label="Año de producción">
            <input
              id="item-ano"
              required
              type="number"
              value={data.ano}
              onChange={(e) => set("ano", Number(e.target.value))}
              className={inputCls}
            />
          </Campo>
        </div>

        <Campo id="item-descripcion" label="Descripción">
          <textarea
            id="item-descripcion"
            rows={3}
            value={data.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
            className={inputCls}
          />
        </Campo>
      </Seccion>

      <Seccion titulo="3 · Precio y stock">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="item-precio" label="Precio (S/)">
            <input
              id="item-precio"
              required
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={precioInput}
              onChange={(e) => setPrecioInput(e.target.value)}
              className={inputCls}
            />
          </Campo>
          <Campo id="item-stock" label="Cantidad disponible">
            <input
              id="item-stock"
              required
              type="number"
              inputMode="numeric"
              min={0}
              value={data.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-neutral-400">En 0 se muestra como &ldquo;Agotado&rdquo;.</p>
          </Campo>
        </div>

        <label className="flex items-center gap-3 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={data.visible}
            onChange={(e) => set("visible", e.target.checked)}
            className="h-4 w-4 accent-[#c2185b]"
          />
          Visible en la tienda
          <span className="text-xs text-neutral-400">(desmarca para ocultarlo sin borrarlo)</span>
        </label>
      </Seccion>

      <Seccion titulo="4 · Fotos y videos">
        <MediaGalleryField
          label="Fotos del producto"
          value={data.media}
          allowVideo
          carpeta="tienda"
          onChange={(media) => set("media", media)}
        />
      </Seccion>

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
