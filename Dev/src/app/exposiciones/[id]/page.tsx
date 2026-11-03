"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { MediaDisplay } from "@/components/MediaDisplay";
import { rangoFechas } from "@/data/exposiciones";
import { tieneFicha, type MediaItem } from "@/data/media";
import type { Artista } from "@/data/artistas";

function PieDeFoto({ item }: { item: MediaItem }) {
  const { artistaPorId } = useContent();
  const obra = tieneFicha(item.obra) ? item.obra : null;
  if (!item.descripcion && !obra) return null;

  const artista = obra?.artistaId ? artistaPorId(obra.artistaId)?.nombre : undefined;
  const detalles = [obra?.tecnica, obra?.medidas, obra?.ano].filter(Boolean).join(" · ");

  return (
    <figcaption className="mt-3 space-y-1 text-sm">
      {obra && (obra.titulo || artista) && (
        <p className="text-neutral-900">
          {artista && <span>{artista}</span>}
          {artista && obra.titulo && <span className="text-neutral-400"> — </span>}
          {obra.titulo && <em>{obra.titulo}</em>}
        </p>
      )}
      {detalles && <p className="text-neutral-500">{detalles}</p>}
      {item.descripcion && (
        <p className="whitespace-pre-line text-neutral-600">{item.descripcion}</p>
      )}
    </figcaption>
  );
}

function FichaArtista({ artista }: { artista: Artista }) {
  return (
    <div className="flex gap-5">
      <MediaDisplay
        src={artista.fotoUrl ?? undefined}
        alt={artista.nombre}
        className="h-20 w-20 shrink-0 rounded-full"
      />
      <div>
        <h3 className="text-neutral-900">{artista.nombre}</h3>
        {(artista.region || artista.instagram) && (
          <p className="mt-0.5 text-xs text-neutral-400">
            {artista.region}
            {artista.region && artista.instagram && " · "}
            {artista.instagram && (
              <a
                href={`https://instagram.com/${artista.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#c2185b]"
              >
                @{artista.instagram}
              </a>
            )}
          </p>
        )}
        {artista.bio && (
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {artista.bio}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ExposicionPage() {
  const { id } = useParams<{ id: string }>();
  const { exposiciones, artistaPorId, loading } = useContent();
  const expo = exposiciones.find((e) => e.id === id);

  if (loading) {
    return (
      <main className="mx-auto max-w-md px-6 pb-28 pt-32 text-center text-sm text-neutral-400">
        Cargando…
      </main>
    );
  }

  if (!expo) {
    return (
      <main className="mx-auto max-w-md px-6 pb-28 pt-32 text-center">
        <h1 className="text-2xl font-medium text-neutral-900">
          Exposición no encontrada
        </h1>
        <Link
          href="/exposiciones"
          className="mt-6 inline-block border-b border-transparent pb-0.5 text-sm text-neutral-700 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
        >
          ← Exposiciones
        </Link>
      </main>
    );
  }

  const artistas = expo.artistaIds
    .map((aid) => artistaPorId(aid))
    .filter((a): a is Artista => a !== undefined);

  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32">
      <Link
        href="/exposiciones"
        className="text-sm text-neutral-500 transition-colors hover:text-[#c2185b]"
      >
        ← Exposiciones
      </Link>

      {!expo.publicado && (
        <p className="mt-6 border border-[#c2185b] px-3 py-2 text-xs text-[#c2185b]">
          Borrador: solo tú puedes ver esta exposición. Publícala desde el panel para que aparezca en la web.
        </p>
      )}

      <h1 className="mt-6 text-3xl font-medium tracking-tight text-neutral-900">
        {expo.titulo}
      </h1>
      {artistas.length > 0 && (
        <p className="mt-2 text-neutral-700">{artistas.map((a) => a.nombre).join(", ")}</p>
      )}
      {rangoFechas(expo) && (
        <p className="mt-1 text-xs uppercase tracking-wide text-neutral-400">{rangoFechas(expo)}</p>
      )}

      <p className="mt-8 whitespace-pre-line leading-relaxed text-neutral-600">
        {expo.parrafoExplicativo}
      </p>

      {expo.media.length > 0 && (
        <div className="mt-12 space-y-12">
          {expo.media.map((item, i) => (
            <figure key={item.url + i}>
              <MediaDisplay
                src={item.url}
                tipo={item.tipo}
                alt={item.obra?.titulo || item.descripcion || `${expo.titulo} — foto ${i + 1}`}
                modoVideo="reproductor"
                className={item.tipo === "video" ? "aspect-video rounded-sm" : "aspect-[3/2] rounded-sm"}
              />
              <PieDeFoto item={item} />
            </figure>
          ))}
        </div>
      )}

      {artistas.length > 0 && (
        <section className="mt-16 border-t border-black/5 pt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-400">
            {artistas.length === 1 ? "Sobre el artista" : "Sobre los artistas"}
          </h2>
          <div className="mt-6 space-y-8">
            {artistas.map((a) => (
              <FichaArtista key={a.id} artista={a} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
