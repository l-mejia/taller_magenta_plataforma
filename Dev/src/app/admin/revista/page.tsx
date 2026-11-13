"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { MediaDisplay } from "@/components/MediaDisplay";
import { FiltrosRevista, contarPorTipo, type FiltroTipo } from "@/components/FiltrosRevista";
import { useContent } from "@/context/ContentContext";
import { filtrarRevista, formatFecha, labelTipo } from "@/data/revista";

function RevistaAdmin() {
  const { revista, deletePublicacion, artistaPorId, loading } = useContent();
  const [tipo, setTipo] = useState<FiltroTipo>("todos");
  const [busqueda, setBusqueda] = useState("");

  const lista = filtrarRevista(revista, tipo, busqueda, (id) => artistaPorId(id)?.nombre);

  async function handleDelete(id: string, titulo: string) {
    if (!window.confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deletePublicacion(id);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "No se pudo eliminar.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-neutral-500 hover:text-[#c2185b]">
            ← Panel
          </Link>
          <h1 className="mt-2 text-3xl font-medium tracking-tight text-neutral-900">Revista</h1>
        </div>
        <Link
          href="/admin/revista/nueva"
          className="border border-neutral-900 px-4 py-2 text-sm text-neutral-900 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
        >
          + Nueva publicación
        </Link>
      </div>

      <div className="mt-8">
        <FiltrosRevista
          tipo={tipo}
          onTipo={setTipo}
          busqueda={busqueda}
          onBusqueda={setBusqueda}
          conteo={contarPorTipo(revista)}
        />
      </div>

      <ul className="mt-6 divide-y divide-black/5">
        {lista.map((p) => (
          <li key={p.id} className="flex items-center gap-4 py-4">
            <MediaDisplay
              src={p.media[0]?.url}
              tipo={p.media[0]?.tipo}
              alt={p.titulo}
              className="h-16 w-16 shrink-0 rounded-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-neutral-900">
                {p.titulo}
                {!p.publicado && (
                  <span className="ml-2 border border-[#c2185b] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[#c2185b]">
                    Borrador
                  </span>
                )}
              </p>
              <p className="truncate text-sm text-neutral-500">
                {labelTipo(p.tipo)} · {formatFecha(p.fecha)}
                {p.autor && ` · ${p.autor}`}
              </p>
            </div>
            <Link href={`/admin/revista/${p.id}`} className="text-sm text-neutral-600 hover:text-[#c2185b]">
              Editar
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(p.id, p.titulo)}
              className="text-sm text-neutral-400 hover:text-[#c2185b]"
            >
              Eliminar
            </button>
          </li>
        ))}
        {!loading && lista.length === 0 && (
          <li className="py-8 text-center text-sm text-neutral-400">
            {revista.length === 0 ? "No hay publicaciones todavía." : "Nada coincide con el filtro."}
          </li>
        )}
      </ul>
    </main>
  );
}

export default function AdminRevistaPage() {
  return (
    <AdminGuard>
      <RevistaAdmin />
    </AdminGuard>
  );
}
