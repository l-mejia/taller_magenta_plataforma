"use client";

import { useState } from "react";

/** Botón de borrado definitivo al pie de una página de edición, con confirmación. */
export function BotonEliminar({
  label,
  confirmacion,
  onEliminar,
}: {
  label: string;
  confirmacion: string;
  onEliminar: () => Promise<void>;
}) {
  const [eliminando, setEliminando] = useState(false);

  async function handleClick() {
    if (!window.confirm(confirmacion)) return;
    setEliminando(true);
    try {
      await onEliminar();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "No se pudo eliminar.");
      setEliminando(false);
    }
  }

  return (
    <div className="mt-16 border-t border-black/10 pt-6">
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={eliminando}
        className="w-full border border-[#c2185b] py-3 text-sm text-[#c2185b] transition-colors hover:bg-[#c2185b] hover:text-white disabled:opacity-60"
      >
        {eliminando ? "Eliminando…" : label}
      </button>
      <p className="mt-2 text-xs text-neutral-400">
        Se borra de la base de datos y de la web. Si solo quieres sacarlo de la web, guárdalo como
        borrador u oculto.
      </p>
    </div>
  );
}
