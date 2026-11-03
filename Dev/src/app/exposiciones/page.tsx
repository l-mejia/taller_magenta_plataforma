import type { Metadata } from "next";
import { Exposiciones } from "@/components/sections/Exposiciones";

export const metadata: Metadata = {
  title: "Exposiciones — Magenta",
};

export default function ExposicionesPage() {
  return <Exposiciones />;
}
