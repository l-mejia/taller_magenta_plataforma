"use client";

import { useState } from "react";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { MediaDisplay } from "@/components/MediaDisplay";
import { FiltrosRevista, contarPorTipo, type FiltroTipo } from "@/components/FiltrosRevista";
import { filtrarRevista, formatFecha, labelTipo } from "@/data/revista";

export function Revista() {
  const { revista, artistaPorId, loading } = useContent();
  const [tipo, setTipo] = useState<FiltroTipo>("todos");
  const [busqueda, setBusqueda] = useState("");

  // el admin también recibe borradores; aquí solo se listan las publicadas (ya vienen por fecha, más reciente primero)
  const publicadas = revista.filter((p) => p.publicado);
  const lista = filtrarRevista(publicadas, tipo, busqueda, (id) => artistaPorId(id)?.nombre);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <h2 className="text-3xl font-medium tracking-tight text-neutral-900">Revista</h2>
      <p className="mt-2 text-neutral-500">Artículos, noticias y entrevistas.</p>

      <div className="mt-8">
        <FiltrosRevista
          tipo={tipo}
          onTipo={setTipo}
          busqueda={busqueda}
          onBusqueda={setBusqueda}
          conteo={contarPorTipo(publicadas)}
        />
      </div>

      <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((p) => (
          <Link key={p.id} href={`/revista/${p.id}`} className="group text-left">
            <MediaDisplay
              src={p.media[0]?.url}
              tipo={p.media[0]?.tipo}
              alt={p.media[0]?.descripcion || p.titulo}
              className="aspect-[4/3] rounded-sm"
            />
            <p className="mt-4 text-xs uppercase tracking-wide text-neutral-400">
              <span className="text-[#c2185b]">{labelTipo(p.tipo)}</span> · {formatFecha(p.fecha)}
            </p>
            <h3 className="mt-2 text-lg text-neutral-900 transition-colors group-hover:text-[#c2185b]">
              {p.titulo}
            </h3>
            <p className="mt-2 text-sm text-neutral-500">{p.resumen}</p>
            {p.autor && <p className="mt-2 text-xs text-neutral-400">Por {p.autor}</p>}
          </Link>
        ))}
      </div>

      {!loading && lista.length === 0 && (
        <p className="mt-10 text-sm text-neutral-400">
          {publicadas.length === 0
            ? "Pronto publicaremos los primeros textos."
            : busqueda
              ? `No encontramos publicaciones con “${busqueda}”.`
              : "No hay publicaciones de este tipo todavía."}
        </p>
      )}
    </main>
  );
}
