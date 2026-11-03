"use client";

import { useState } from "react";
import { categoriasTienda, type ItemTienda } from "@/data/tienda";
import { useContent } from "@/context/ContentContext";
import { MediaCarousel } from "@/components/MediaCarousel";
import { useCart } from "@/context/CartContext";

function ProductCard({ item }: { item: ItemTienda }) {
  const { lines, addItem } = useCart();
  const [agregado, setAgregado] = useState(false);

  const enCarrito = lines.find((l) => l.item.id === item.id)?.cantidad ?? 0;
  const agotado = item.stock <= 0;
  const sinDisponibilidad = agotado || enCarrito >= item.stock;

  function handleAdd() {
    addItem(item);
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1200);
  }

  return (
    <div>
      <MediaCarousel
        items={item.media}
        alt={item.media[0]?.descripcion || item.titulo}
        className="aspect-square rounded-sm"
      />
      <div className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-neutral-900">{item.titulo}</h3>
          <span className="shrink-0 text-neutral-900">{item.precio}</span>
        </div>
        <p className="mt-1 text-sm text-neutral-500">{item.autor}</p>
        <p className="mt-3 text-xs uppercase tracking-wide text-neutral-400">
          {item.tipo}
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          {item.tecnica} · {item.medidas} · {item.ano}
        </p>
        {item.descripcion && (
          <p className="mt-2 text-sm text-neutral-500">{item.descripcion}</p>
        )}
        <p className="mt-2 text-xs text-neutral-400">
          {agotado ? "Agotado" : `${item.stock} disponibles`}
        </p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={sinDisponibilidad}
          className="mt-4 w-full border border-neutral-900 py-2 text-sm text-neutral-900 transition-colors hover:border-[#c2185b] hover:bg-[#c2185b] hover:text-white disabled:cursor-not-allowed disabled:border-black/10 disabled:text-neutral-300 disabled:hover:bg-transparent"
        >
          {agotado ? "Agotado" : agregado ? "Añadido ✓" : "Añadir al carrito"}
        </button>
      </div>
    </div>
  );
}

export function Tienda() {
  const { tienda } = useContent();
  const [tab, setTab] = useState<(typeof categoriasTienda)[number]["key"]>("obras");
  // el admin también recibe productos ocultos; aquí solo se muestran los visibles
  const items = tienda.filter((item) => item.visible && item.categoria === tab);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <h2 className="text-3xl font-medium tracking-tight text-neutral-900">
        Tienda
      </h2>

      <div className="mt-8 flex gap-6 border-b border-black/5 text-sm">
        {categoriasTienda.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 pb-3 transition-colors ${
              tab === t.key
                ? "border-[#c2185b] text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
