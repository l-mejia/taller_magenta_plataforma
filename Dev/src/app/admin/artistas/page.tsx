"use client";

import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useContent } from "@/context/ContentContext";
import { MediaDisplay } from "@/components/MediaDisplay";

function ArtistasAdmin() {
  const { artistas, exposiciones, tienda, deleteArtista, loading } = useContent();

  function usos(id: string) {
    const expos = exposiciones.filter((e) => e.artistaIds.includes(id)).length;
    const items = tienda.filter((t) => t.artistaId === id).length;
    return { expos, items };
  }

  async function handleDelete(id: string, nombre: string) {
    const { expos, items } = usos(id);
    const aviso =
      expos + items > 0
        ? `\n\nAparece en ${expos} exposición(es) y ${items} producto(s): se quitará de ellos.`
        : "";
    if (!window.confirm(`¿Eliminar a "${nombre}"?${aviso}`)) return;
    try {
      await deleteArtista(id);
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
          <h1 className="mt-2 text-3xl font-medium tracking-tight text-neutral-900">Artistas</h1>
        </div>
        <Link
          href="/admin/artistas/nuevo"
          className="border border-neutral-900 px-4 py-2 text-sm text-neutral-900 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
        >
          + Nuevo artista
        </Link>
      </div>

      <ul className="mt-10 divide-y divide-black/5">
        {artistas.map((a) => {
          const { expos, items } = usos(a.id);
          return (
            <li key={a.id} className="flex items-center gap-4 py-4">
              <MediaDisplay
                src={a.fotoUrl ?? undefined}
                alt={a.nombre}
                className="h-14 w-14 shrink-0 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <p className="text-neutral-900">{a.nombre}</p>
                <p className="text-sm text-neutral-500">
                  {[a.region, `${expos} expo.`, `${items} prod.`].filter(Boolean).join(" · ")}
                  {!a.bio && <span className="text-[#c2185b]"> · falta bio</span>}
                </p>
              </div>
              <Link
                href={`/admin/artistas/${a.id}`}
                className="text-sm text-neutral-600 hover:text-[#c2185b]"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(a.id, a.nombre)}
                className="text-sm text-neutral-400 hover:text-[#c2185b]"
              >
                Eliminar
              </button>
            </li>
          );
        })}
        {!loading && artistas.length === 0 && (
          <li className="py-8 text-center text-sm text-neutral-400">No hay artistas todavía.</li>
        )}
      </ul>
    </main>
  );
}

export default function AdminArtistasPage() {
  return (
    <AdminGuard>
      <ArtistasAdmin />
    </AdminGuard>
  );
}
