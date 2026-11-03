"use client";

import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useContent } from "@/context/ContentContext";
import { MediaDisplay } from "@/components/MediaDisplay";

function ExposicionesAdmin() {
  const { exposiciones, deleteExposicion, loading } = useContent();

  async function handleDelete(id: string, titulo: string) {
    if (!window.confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteExposicion(id);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "No se pudo eliminar.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-neutral-500 hover:text-[#c2185b]">
            ← Panel
          </Link>
          <h1 className="mt-2 text-3xl font-medium tracking-tight text-neutral-900">
            Exposiciones
          </h1>
        </div>
        <Link
          href="/admin/exposiciones/nueva"
          className="border border-neutral-900 px-4 py-2 text-sm text-neutral-900 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
        >
          + Nueva exposición
        </Link>
      </div>

      <ul className="mt-10 divide-y divide-black/5">
        {exposiciones.map((expo) => (
          <li key={expo.id} className="flex items-center gap-4 py-4">
            <MediaDisplay
              src={expo.media[0]?.url}
              tipo={expo.media[0]?.tipo}
              alt={expo.titulo}
              className="h-16 w-16 shrink-0 rounded-sm"
            />
            <div className="flex-1">
              <p className="text-neutral-900">{expo.titulo}</p>
              <p className="text-sm text-neutral-500">{expo.descripcion}</p>
            </div>
            <Link
              href={`/admin/exposiciones/${expo.id}`}
              className="text-sm text-neutral-600 hover:text-[#c2185b]"
            >
              Editar
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(expo.id, expo.titulo)}
              className="text-sm text-neutral-400 hover:text-[#c2185b]"
            >
              Eliminar
            </button>
          </li>
        ))}
        {!loading && exposiciones.length === 0 && (
          <li className="py-8 text-center text-sm text-neutral-400">
            No hay exposiciones todavía.
          </li>
        )}
      </ul>
    </main>
  );
}

export default function AdminExposicionesPage() {
  return (
    <AdminGuard>
      <ExposicionesAdmin />
    </AdminGuard>
  );
}
