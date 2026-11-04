"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BotonEliminar } from "@/components/admin/BotonEliminar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ArtistaForm } from "@/components/admin/ArtistaForm";
import { useContent } from "@/context/ContentContext";

function EditarArtista() {
  const { id } = useParams<{ id: string }>();
  const { artistaPorId, updateArtista, loading, deleteArtista } = useContent();
  const router = useRouter();
  const artista = artistaPorId(id);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 pb-28 pt-32 text-sm text-neutral-400">Cargando…</main>
    );
  }

  if (!artista) {
    return (
      <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
        <p className="text-neutral-600">Artista no encontrado.</p>
        <Link href="/admin/artistas" className="mt-4 inline-block text-sm text-neutral-500 hover:text-[#c2185b]">
          ← Artistas
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
      <Link href="/admin/artistas" className="text-sm text-neutral-500 hover:text-[#c2185b]">
        ← Artistas
      </Link>
      <h1 className="mt-2 text-2xl font-medium text-neutral-900">Editar artista</h1>

      <div className="mt-8">
        <ArtistaForm
          initial={artista}
          submitLabel="Guardar cambios"
          onSubmit={async (data) => {
            await updateArtista(artista.id, data);
            router.push("/admin/artistas");
          }}
        />
      </div>

      <BotonEliminar
        label="Eliminar artista"
        confirmacion={`¿Eliminar "${artista.nombre}"? Esta acción no se puede deshacer. Se quitará de las exposiciones y productos donde aparece.`}
        onEliminar={async () => {
          await deleteArtista(artista.id);
          router.push("/admin/artistas");
        }}
      />
    </main>
  );
}

export default function EditarArtistaPage() {
  return (
    <AdminGuard>
      <EditarArtista />
    </AdminGuard>
  );
}
