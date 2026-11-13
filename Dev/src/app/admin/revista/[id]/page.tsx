"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { BotonEliminar } from "@/components/admin/BotonEliminar";
import { PublicacionForm } from "@/components/admin/PublicacionForm";
import { useContent } from "@/context/ContentContext";

function EditarPublicacion() {
  const { id } = useParams<{ id: string }>();
  const { revista, updatePublicacion, deletePublicacion, loading } = useContent();
  const router = useRouter();
  const pub = revista.find((p) => p.id === id);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 pb-28 pt-32 text-sm text-neutral-400">Cargando…</main>
    );
  }

  if (!pub) {
    return (
      <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
        <p className="text-neutral-600">Publicación no encontrada.</p>
        <Link href="/admin/revista" className="mt-4 inline-block text-sm text-neutral-500 hover:text-[#c2185b]">
          ← Revista
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
      <div className="flex items-center justify-between">
        <Link href="/admin/revista" className="text-sm text-neutral-500 hover:text-[#c2185b]">
          ← Revista
        </Link>
        <Link href={`/revista/${pub.id}`} className="text-sm text-neutral-500 hover:text-[#c2185b]">
          Ver en la web →
        </Link>
      </div>
      <h1 className="mt-2 text-2xl font-medium text-neutral-900">Editar publicación</h1>

      <div className="mt-8">
        <PublicacionForm
          initial={pub}
          onSubmit={async (data) => {
            await updatePublicacion(pub.id, data);
            router.push("/admin/revista");
          }}
        />
      </div>

      <BotonEliminar
        label="Eliminar publicación"
        confirmacion={`¿Eliminar "${pub.titulo}"? Esta acción no se puede deshacer. Se borrarán también sus fotos del almacenamiento.`}
        onEliminar={async () => {
          await deletePublicacion(pub.id);
          router.push("/admin/revista");
        }}
      />
    </main>
  );
}

export default function EditarPublicacionPage() {
  return (
    <AdminGuard>
      <EditarPublicacion />
    </AdminGuard>
  );
}
