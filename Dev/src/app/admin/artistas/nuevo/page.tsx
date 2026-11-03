"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ArtistaForm } from "@/components/admin/ArtistaForm";
import { useContent } from "@/context/ContentContext";

function NuevoArtista() {
  const { addArtista } = useContent();
  const router = useRouter();

  return (
    <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
      <Link href="/admin/artistas" className="text-sm text-neutral-500 hover:text-[#c2185b]">
        ← Artistas
      </Link>
      <h1 className="mt-2 text-2xl font-medium text-neutral-900">Nuevo artista</h1>

      <div className="mt-8">
        <ArtistaForm
          submitLabel="Crear artista"
          onSubmit={async (data) => {
            await addArtista(data);
            router.push("/admin/artistas");
          }}
        />
      </div>
    </main>
  );
}

export default function NuevoArtistaPage() {
  return (
    <AdminGuard>
      <NuevoArtista />
    </AdminGuard>
  );
}
