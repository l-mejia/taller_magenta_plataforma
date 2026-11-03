"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ExposicionForm } from "@/components/admin/ExposicionForm";
import { useContent } from "@/context/ContentContext";

function NuevaExposicion() {
  const { addExposicion } = useContent();
  const router = useRouter();

  return (
    <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
      <Link href="/admin/exposiciones" className="text-sm text-neutral-500 hover:text-[#c2185b]">
        ← Exposiciones
      </Link>
      <h1 className="mt-2 text-2xl font-medium text-neutral-900">Nueva exposición</h1>

      <div className="mt-8">
        <ExposicionForm
          submitLabel="Crear exposición"
          onSubmit={async (data) => {
            await addExposicion(data);
            router.push("/admin/exposiciones");
          }}
        />
      </div>
    </main>
  );
}

export default function NuevaExposicionPage() {
  return (
    <AdminGuard>
      <NuevaExposicion />
    </AdminGuard>
  );
}
