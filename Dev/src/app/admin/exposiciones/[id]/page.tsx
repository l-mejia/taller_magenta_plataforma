"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ExposicionForm } from "@/components/admin/ExposicionForm";
import { useContent } from "@/context/ContentContext";

function EditarExposicion() {
  const { id } = useParams<{ id: string }>();
  const { exposiciones, updateExposicion, loading } = useContent();
  const router = useRouter();
  const expo = exposiciones.find((e) => e.id === id);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 pb-28 pt-32 text-sm text-neutral-400">Cargando…</main>
    );
  }

  if (!expo) {
    return (
      <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
        <p className="text-neutral-600">Exposición no encontrada.</p>
        <Link href="/admin/exposiciones" className="mt-4 inline-block text-sm text-neutral-500 hover:text-[#c2185b]">
          ← Exposiciones
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
      <Link href="/admin/exposiciones" className="text-sm text-neutral-500 hover:text-[#c2185b]">
        ← Exposiciones
      </Link>
      <h1 className="mt-2 text-2xl font-medium text-neutral-900">Editar exposición</h1>

      <div className="mt-8">
        <ExposicionForm
          initial={expo}
          submitLabel="Guardar cambios"
          onSubmit={async (data) => {
            await updateExposicion(expo.id, data);
            router.push("/admin/exposiciones");
          }}
        />
      </div>
    </main>
  );
}

export default function EditarExposicionPage() {
  return (
    <AdminGuard>
      <EditarExposicion />
    </AdminGuard>
  );
}
