"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ItemTiendaForm } from "@/components/admin/ItemTiendaForm";
import { useContent } from "@/context/ContentContext";

function EditarItem() {
  const { id } = useParams<{ id: string }>();
  const { tienda, updateItemTienda } = useContent();
  const router = useRouter();
  const item = tienda.find((t) => t.id === id);

  if (!item) {
    return (
      <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
        <p className="text-neutral-600">Producto no encontrado.</p>
        <Link href="/admin/tienda" className="mt-4 inline-block text-sm text-neutral-500 hover:text-[#c2185b]">
          ← Tienda
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-28 pt-32">
      <Link href="/admin/tienda" className="text-sm text-neutral-500 hover:text-[#c2185b]">
        ← Tienda
      </Link>
      <h1 className="mt-2 text-2xl font-medium text-neutral-900">Editar producto</h1>

      <div className="mt-8">
        <ItemTiendaForm
          initial={item}
          submitLabel="Guardar cambios"
          onSubmit={(data) => {
            updateItemTienda(item.id, data);
            router.push("/admin/tienda");
          }}
        />
      </div>
    </main>
  );
}

export default function EditarItemPage() {
  return (
    <AdminGuard>
      <EditarItem />
    </AdminGuard>
  );
}
