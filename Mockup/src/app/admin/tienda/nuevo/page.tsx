"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ItemTiendaForm } from "@/components/admin/ItemTiendaForm";
import { useContent } from "@/context/ContentContext";

function NuevoItem() {
  const { addItemTienda } = useContent();
  const router = useRouter();

  return (
    <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
      <Link href="/admin/tienda" className="text-sm text-neutral-500 hover:text-[#c2185b]">
        ← Tienda
      </Link>
      <h1 className="mt-2 text-2xl font-medium text-neutral-900">Nuevo producto</h1>

      <div className="mt-8">
        <ItemTiendaForm
          submitLabel="Crear producto"
          onSubmit={(data) => {
            addItemTienda(data);
            router.push("/admin/tienda");
          }}
        />
      </div>
    </main>
  );
}

export default function NuevoItemPage() {
  return (
    <AdminGuard>
      <NuevoItem />
    </AdminGuard>
  );
}
