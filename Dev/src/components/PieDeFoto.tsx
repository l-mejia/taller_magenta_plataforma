"use client";

import { useContent } from "@/context/ContentContext";
import { tieneFicha, type MediaItem } from "@/data/media";

/** Ficha de obra (artista — título, técnica · medidas · año) y pie de foto. */
export function PieDeFoto({ item }: { item: MediaItem }) {
  const { artistaPorId } = useContent();
  const obra = tieneFicha(item.obra) ? item.obra : null;
  if (!item.descripcion && !obra) return null;

  const artista = obra?.artistaId ? artistaPorId(obra.artistaId)?.nombre : undefined;
  const detalles = [obra?.tecnica, obra?.medidas, obra?.ano].filter(Boolean).join(" · ");

  return (
    <figcaption className="mt-3 space-y-1 text-sm">
      {obra && (obra.titulo || artista) && (
        <p className="text-neutral-900">
          {artista && <span>{artista}</span>}
          {artista && obra.titulo && <span className="text-neutral-400"> — </span>}
          {obra.titulo && <em>{obra.titulo}</em>}
        </p>
      )}
      {detalles && <p className="text-neutral-500">{detalles}</p>}
      {item.descripcion && (
        <p className="whitespace-pre-line text-neutral-600">{item.descripcion}</p>
      )}
    </figcaption>
  );
}
