import { estadoExposicion, etiquetaEstado, type Exposicion } from "@/data/exposiciones";

const estilos = {
  abierta: "border-[#c2185b] bg-[#c2185b] text-white",
  proxima: "border-[#c2185b] bg-white text-[#c2185b]",
  finalizada: "border-neutral-300 bg-white text-neutral-500",
} as const;

/** "Abierta" / "Próximamente" / "Finalizada" según las fechas de la exposición. */
export function EstadoExposicionBadge({
  expo,
  className,
}: {
  expo: Pick<Exposicion, "fechaInicio" | "fechaFin">;
  className?: string;
}) {
  const estado = estadoExposicion(expo);
  if (!estado) return null;
  return (
    <span
      className={`inline-block border px-2 py-0.5 text-[10px] uppercase tracking-wide ${estilos[estado]} ${className ?? ""}`}
    >
      {etiquetaEstado[estado]}
    </span>
  );
}
