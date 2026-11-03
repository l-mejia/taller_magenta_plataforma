"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { MediaCarousel } from "@/components/MediaCarousel";

export default function ExposicionPage() {
  const { id } = useParams<{ id: string }>();
  const { exposiciones } = useContent();
  const expo = exposiciones.find((e) => e.id === id);

  if (!expo) {
    return (
      <main className="mx-auto max-w-md px-6 pb-28 pt-32 text-center">
        <h1 className="text-2xl font-medium text-neutral-900">
          Exposición no encontrada
        </h1>
        <Link
          href="/exposiciones"
          className="mt-6 inline-block border-b border-transparent pb-0.5 text-sm text-neutral-700 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
        >
          ← Exposiciones
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32">
      <Link
        href="/exposiciones"
        className="text-sm text-neutral-500 transition-colors hover:text-[#c2185b]"
      >
        ← Exposiciones
      </Link>

      <h1 className="mt-6 text-3xl font-medium tracking-tight text-neutral-900">
        {expo.titulo}
      </h1>
      <p className="mt-2 text-neutral-500">{expo.descripcion}</p>

      <MediaCarousel
        items={expo.media}
        alt={expo.titulo}
        className="mt-8 aspect-[3/2] rounded-sm"
      />

      <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
        {expo.parrafoExplicativo}
      </p>

      <div className="mt-12 border-t border-black/5 pt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-400">
          Sobre el artista
        </h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
          {expo.bioArtista}
        </p>
      </div>
    </main>
  );
}
