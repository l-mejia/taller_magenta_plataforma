import type { Metadata } from "next";
import { QuienesSomos } from "@/components/sections/QuienesSomos";

export const metadata: Metadata = {
  title: "Quiénes somos — Magenta",
};

export default function QuienesSomosPage() {
  return <QuienesSomos />;
}
