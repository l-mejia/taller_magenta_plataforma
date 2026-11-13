"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { PublicacionForm } from "@/components/admin/PublicacionForm";
import { useContent } from "@/context/ContentContext";

function NuevaPublicacion() {
  const { addPublicacion } = useContent();
  const router = useRouter();

  return (
    <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
      <Link href="/admin/revista" className="text-sm text-neutral-500 hover:text-[#c2185b]">
        ← Revista
      </Link>
      <h1 className="mt-2 text-2xl font-medium text-neutral-900">Nueva publicación</h1>

      <div className="mt-8">
        <PublicacionForm
          onSubmit={async (data) => {
            await addPublicacion(data);
            router.push("/admin/revista");
          }}
        />
      </div>
    </main>
  );
}

export default function NuevaPublicacionPage() {
  return (
    <AdminGuard>
      <NuevaPublicacion />
    </AdminGuard>
  );
}
