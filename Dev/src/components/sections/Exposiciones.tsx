"use client";

import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { MediaDisplay } from "@/components/MediaDisplay";

export function Exposiciones() {
  const { exposiciones } = useContent();

  return (
    <main className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <h2 className="text-3xl font-medium tracking-tight text-neutral-900">
        Exposiciones
      </h2>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {exposiciones.map((expo) => (
          <Link
            key={expo.id}
            href={`/exposiciones/${expo.id}`}
            className="group text-left"
          >
            <MediaDisplay
              src={expo.media[0]?.url}
              tipo={expo.media[0]?.tipo}
              alt={expo.titulo}
              className="aspect-[4/3] rounded-sm"
            />
            <h3 className="mt-4 text-lg text-neutral-900 transition-colors group-hover:text-[#c2185b]">
              {expo.titulo}
            </h3>
            <p className="mt-1 text-sm text-neutral-500">{expo.descripcion}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
