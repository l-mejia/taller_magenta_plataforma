"use client";

import { useState, type FormEvent } from "react";
import { categoriasTienda, type ItemTienda } from "@/data/tienda";
import { formatMonto, parsePrecio } from "@/context/CartContext";
import { MediaGalleryField } from "@/components/admin/MediaGalleryField";

type ItemData = Omit<ItemTienda, "id">;

const vacio: ItemData = {
  categoria: "obras",
  tipo: "",
  media: [],
  titulo: "",
  autor: "",
  precio: "S/ 0",
  descripcion: "",
  medidas: "",
  tecnica: "",
  ano: new Date().getFullYear(),
  stock: 1,
};

export function ItemTiendaForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: ItemTienda;
  submitLabel: string;
  onSubmit: (data: ItemData) => void;
}) {
  const [data, setData] = useState<ItemData>(initial ?? vacio);
  const [precioInput, setPrecioInput] = useState(
    String(initial ? parsePrecio(initial.precio) : 0),
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ ...data, precio: formatMonto(Number(precioInput) || 0) });
  }

  function set<K extends keyof ItemData>(key: K, value: ItemData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm text-neutral-600" htmlFor="item-categoria">
          Categoría
        </label>
        <select
          id="item-categoria"
          value={data.categoria}
          onChange={(e) => set("categoria", e.target.value as ItemData["categoria"])}
          className="mt-1 w-full border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
        >
          {categoriasTienda.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <MediaGalleryField
        label="Fotos o videos"
        value={data.media}
        allowVideo
        onChange={(media) => set("media", media)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="item-titulo">
            Título
          </label>
          <input
            id="item-titulo"
            required
            value={data.titulo}
            onChange={(e) => set("titulo", e.target.value)}
            className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="item-autor">
            Autor
          </label>
          <input
            id="item-autor"
            required
            value={data.autor}
            onChange={(e) => set("autor", e.target.value)}
            className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="item-tipo">
            Tipo (ej. Cuadro, Llavero, Libro)
          </label>
          <input
            id="item-tipo"
            required
            value={data.tipo}
            onChange={(e) => set("tipo", e.target.value)}
            className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="item-tecnica">
            Técnica
          </label>
          <input
            id="item-tecnica"
            required
            value={data.tecnica}
            onChange={(e) => set("tecnica", e.target.value)}
            className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="item-medidas">
            Medidas
          </label>
          <input
            id="item-medidas"
            required
            value={data.medidas}
            onChange={(e) => set("medidas", e.target.value)}
            className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="item-ano">
            Año de producción
          </label>
          <input
            id="item-ano"
            required
            type="number"
            value={data.ano}
            onChange={(e) => set("ano", Number(e.target.value))}
            className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="item-precio">
            Precio (S/)
          </label>
          <input
            id="item-precio"
            required
            type="number"
            min={0}
            step="0.01"
            value={precioInput}
            onChange={(e) => setPrecioInput(e.target.value)}
            className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-600" htmlFor="item-stock">
            Cantidad disponible
          </label>
          <input
            id="item-stock"
            required
            type="number"
            min={0}
            value={data.stock}
            onChange={(e) => set("stock", Number(e.target.value))}
            className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
          />
          <p className="mt-1 text-xs text-neutral-400">
            En 0, el botón de compra se muestra como &ldquo;Agotado&rdquo;.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-600" htmlFor="item-descripcion">
          Descripción
        </label>
        <textarea
          id="item-descripcion"
          required
          rows={3}
          value={data.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          className="mt-1 w-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#c2185b]"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-neutral-900 py-3 text-sm text-white transition-colors hover:bg-[#c2185b]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
