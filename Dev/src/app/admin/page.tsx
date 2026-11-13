"use client";

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
  const { artistas, exposiciones, tienda, revista, error } = useContent();

  const borradores = exposiciones.filter((e) => !e.publicado).length;
  const ocultos = tienda.filter((t) => !t.visible).length;
  const borradoresRevista = revista.filter((p) => !p.publicado).length;

  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32">
      <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
        Panel de administración
      </h1>
      <p className="mt-2 text-neutral-500">
        Carga y edita el contenido de Magenta desde aquí.
      </p>

      {error && <p className="mt-4 text-sm text-[#c2185b]">{error}</p>}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
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
          href="/admin/revista"
          titulo="Revista"
          detalle={`${revista.length} publicaciones${borradoresRevista ? ` · ${borradoresRevista} en borrador` : ""}`}
        />
        <Tarjeta
          href="/admin/artistas"
          titulo="Artistas"
          detalle={`${artistas.length} en el catálogo`}
        />
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
