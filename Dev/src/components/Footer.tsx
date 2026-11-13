import { contacto } from "@/data/contacto";

export function Footer() {
  return (
    <footer className="space-y-1 border-t border-black/5 py-8 text-center text-sm text-neutral-500">
      <p>
        © {new Date().getFullYear()}, {contacto.direccion.replace(", Barranco", " - Barranco")}
      </p>
      <p>{contacto.horario}</p>
    </footer>
  );
}
