import { contacto } from "@/data/contacto";
import { MailIcon, MapPinIcon, PhoneIcon, InstagramIcon } from "@/components/icons";

export function Contacto() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32">
      <h2 className="text-3xl font-medium tracking-tight text-neutral-900">
        Contacto
      </h2>
      <p className="mt-2 text-neutral-500">{contacto.nombre}</p>

      <ul className="mt-10 space-y-5">
        <li className="flex items-center gap-4">
          <MailIcon className="h-5 w-5 shrink-0 text-[#c2185b]" />
          <a
            href={`mailto:${contacto.email}`}
            className="text-neutral-700 hover:text-[#c2185b]"
          >
            {contacto.email}
          </a>
        </li>
        <li className="flex items-center gap-4">
          <PhoneIcon className="h-5 w-5 shrink-0 text-[#c2185b]" />
          <a
            href={`tel:+51${contacto.telefono}`}
            className="text-neutral-700 hover:text-[#c2185b]"
          >
            {contacto.telefono}
          </a>
        </li>
        <li className="flex items-center gap-4">
          <InstagramIcon className="h-5 w-5 shrink-0 text-[#c2185b]" />
          <a
            href={contacto.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-700 hover:text-[#c2185b]"
          >
            {contacto.instagram}
          </a>
        </li>
        <li className="flex items-center gap-4">
          <MapPinIcon className="h-5 w-5 shrink-0 text-[#c2185b]" />
          <a
            href={contacto.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-700 hover:text-[#c2185b]"
          >
            Barranco, Lima — ver en Google Maps
          </a>
        </li>
      </ul>
    </main>
  );
}
