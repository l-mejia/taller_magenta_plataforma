"use client";

import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { MediaDisplay } from "@/components/MediaDisplay";
import { rangoFechas } from "@/data/exposiciones";
import { EstadoExposicionBadge } from "@/components/EstadoExposicionBadge";

export function Exposiciones() {
  const { exposiciones, artistaPorId, loading } = useContent();
  // el admin también recibe borradores; aquí solo se listan los publicados
  const publicadas = exposiciones.filter((e) => e.publicado);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <h2 className="text-3xl font-medium tracking-tight text-neutral-900">
        Exposiciones
      </h2>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {publicadas.map((expo) => (
          <Link
            key={expo.id}
            href={`/exposiciones/${expo.id}`}
            className="group text-left"
          >
            <div className="relative">
              <MediaDisplay
                src={expo.media[0]?.url}
                tipo={expo.media[0]?.tipo}
                alt={expo.media[0]?.descripcion || expo.titulo}
                className="aspect-[4/3] rounded-sm"
              />
              <EstadoExposicionBadge expo={expo} className="absolute left-3 top-3" />
            </div>
            <h3 className="mt-4 text-lg text-neutral-900 transition-colors group-hover:text-[#c2185b]">
              {expo.titulo}
            </h3>
            {expo.artistaIds.length > 0 && (
              <p className="mt-1 text-sm text-neutral-700">
                {expo.artistaIds.map((id) => artistaPorId(id)?.nombre).filter(Boolean).join(", ")}
              </p>
            )}
            {rangoFechas(expo) && (
              <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">
                {rangoFechas(expo)}
              </p>
            )}
            <p className="mt-2 text-sm text-neutral-500">{expo.descripcion}</p>
          </Link>
        ))}
      </div>

      {!loading && publicadas.length === 0 && (
        <p className="mt-10 text-sm text-neutral-400">Pronto anunciaremos nuevas exposiciones.</p>
      )}
    </main>
  );
}
