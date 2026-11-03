import type { Metadata } from "next";
import { Tienda } from "@/components/sections/Tienda";

export const metadata: Metadata = {
  title: "Tienda — Magenta",
};

export default function TiendaPage() {
  return <Tienda />;
}
