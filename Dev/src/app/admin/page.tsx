"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useContent } from "@/context/ContentContext";

function Tarjeta({ href, titulo, detalle }: { href: string; titulo: string; detalle: string }) {
  return (
    <Link
      href={href}
      className="block border border-black/10 p-6 transition-colors hover:border-[#c2185b]"
    >
      <h2 className="text-lg text-neutral-900">{titulo}</h2>
      <p className="mt-1 text-sm text-neutral-500">{detalle}</p>
    </Link>
  );
}

function AdminHome() {
  const { artistas, exposiciones, tienda, cargarContenidoDeEjemplo, error } = useContent();
  const [cargando, setCargando] = useState(false);

  const borradores = exposiciones.filter((e) => !e.publicado).length;
  const ocultos = tienda.filter((t) => !t.visible).length;

  async function handleCargarEjemplo() {
    if (!window.confirm("¿Reemplazar TODO el contenido por el de ejemplo? Se borrarán los artistas, exposiciones, productos y fotos actuales.")) return;
    setCargando(true);
    try {
      await cargarContenidoDeEjemplo();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "No se pudo cargar el contenido de ejemplo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32">
      <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
        Panel de administración
      </h1>
      <p className="mt-2 text-neutral-500">
        Carga y edita el contenido de Magenta desde aquí.
      </p>

      {error && <p className="mt-4 text-sm text-[#c2185b]">{error}</p>}

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Tarjeta
          href="/admin/exposiciones"
          titulo="Exposiciones"
          detalle={`${exposiciones.length} en total${borradores ? ` · ${borradores} en borrador` : ""}`}
        />
        <Tarjeta
          href="/admin/tienda"
          titulo="Tienda"
          detalle={`${tienda.length} productos${ocultos ? ` · ${ocultos} ocultos` : ""}`}
        />
        <Tarjeta
          href="/admin/artistas"
          titulo="Artistas"
          detalle={`${artistas.length} en el catálogo`}
        />
      </div>

      <div className="mt-12 border-t border-black/5 pt-6">
        <button
          type="button"
          onClick={handleCargarEjemplo}
          disabled={cargando}
          className="text-xs text-neutral-400 hover:text-[#c2185b] disabled:opacity-50"
        >
          {cargando ? "Cargando contenido de ejemplo…" : "Cargar contenido de ejemplo"}
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
