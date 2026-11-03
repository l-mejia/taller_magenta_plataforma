"use client";

import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useContent } from "@/context/ContentContext";

function AdminHome() {
  const { exposiciones, tienda, restaurarDatosOriginales } = useContent();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32">
      <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
        Panel de administración
      </h1>
      <p className="mt-2 text-neutral-500">
        Edita el contenido de Magenta desde aquí.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/exposiciones"
          className="block border border-black/10 p-6 transition-colors hover:border-[#c2185b]"
        >
          <h2 className="text-lg text-neutral-900">Exposiciones</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {exposiciones.length} exposiciones publicadas
          </p>
        </Link>
        <Link
          href="/admin/tienda"
          className="block border border-black/10 p-6 transition-colors hover:border-[#c2185b]"
        >
          <h2 className="text-lg text-neutral-900">Tienda</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {tienda.length} productos publicados
          </p>
        </Link>
      </div>

      <div className="mt-12 border-t border-black/5 pt-6">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("¿Restaurar el contenido original? Se perderán los cambios guardados.")) {
              restaurarDatosOriginales();
            }
          }}
          className="text-xs text-neutral-400 hover:text-[#c2185b]"
        >
          Restaurar contenido original
        </button>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminHome />
    </AdminGuard>
  );
}
