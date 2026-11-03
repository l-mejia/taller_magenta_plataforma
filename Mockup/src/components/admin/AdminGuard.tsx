"use client";

import type { ReactNode } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin } = useAdminAuth();

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-md px-6 pb-28 pt-32 text-center">
        <h1 className="text-2xl font-medium text-neutral-900">Acceso restringido</h1>
        <p className="mt-3 text-neutral-600">
          Esta sección es solo para el administrador de Magenta.
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
