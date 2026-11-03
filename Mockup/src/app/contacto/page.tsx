import type { Metadata } from "next";
import { Contacto } from "@/components/sections/Contacto";

export const metadata: Metadata = {
  title: "Contacto — Magenta",
};

export default function ContactoPage() {
  return <Contacto />;
}
