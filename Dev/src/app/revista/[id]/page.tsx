"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useContent } from "@/context/ContentContext";
import { MediaDisplay } from "@/components/MediaDisplay";
import { PieDeFoto } from "@/components/PieDeFoto";
import { FichaArtista } from "@/components/FichaArtista";
import { formatFecha, labelTipo, type Publicacion } from "@/data/revista";
import type { Artista } from "@/data/artistas";

/** Párrafos separados por línea en blanco; en entrevistas, los que terminan en "?" van como pregunta. */
function Cuerpo({ pub }: { pub: Publicacion }) {
  const parrafos = pub.cuerpo
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mt-10 space-y-5 leading-relaxed text-neutral-700">
      {parrafos.map((p, i) =>
        pub.tipo === "entrevista" && p.endsWith("?") ? (
          <p key={i} className="whitespace-pre-line pt-2 font-medium text-neutral-900">
            {p}
          </p>
        ) : (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        ),
      )}
    </div>
  );
}

export default function PublicacionPage() {
  const { id } = useParams<{ id: string }>();
  const { revista, artistaPorId, loading } = useContent();
  const pub = revista.find((p) => p.id === id);

  if (loading) {
    return (
      <main className="mx-auto max-w-md px-6 pb-28 pt-32 text-center text-sm text-neutral-400">
        Cargando…
      </main>
    );
  }

  if (!pub) {
    return (
      <main className="mx-auto max-w-md px-6 pb-28 pt-32 text-center">
        <h1 className="text-2xl font-medium text-neutral-900">Publicación no encontrada</h1>
        <Link
          href="/revista"
          className="mt-6 inline-block border-b border-transparent pb-0.5 text-sm text-neutral-700 transition-colors hover:border-[#c2185b] hover:text-[#c2185b]"
        >
          ← Revista
        </Link>
      </main>
    );
  }

  const artistas = pub.artistaIds
    .map((aid) => artistaPorId(aid))
    .filter((a): a is Artista => a !== undefined);
  const [portada, ...resto] = pub.media;

  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32">
      <Link href="/revista" className="text-sm text-neutral-500 transition-colors hover:text-[#c2185b]">
        ← Revista
      </Link>

      {!pub.publicado && (
        <p className="mt-6 border border-[#c2185b] px-3 py-2 text-xs text-[#c2185b]">
          Borrador: solo tú puedes ver esta publicación. Publícala desde el panel para que aparezca en la revista.
        </p>
      )}

      <p className="mt-6 text-xs uppercase tracking-wide text-neutral-400">
        <span className="text-[#c2185b]">{labelTipo(pub.tipo)}</span> · {formatFecha(pub.fecha)}
      </p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight text-neutral-900">{pub.titulo}</h1>
      {pub.resumen && <p className="mt-3 text-lg text-neutral-500">{pub.resumen}</p>}
      {pub.autor && <p className="mt-4 text-sm text-neutral-700">Por {pub.autor}</p>}

      {portada && (
        <figure className="mt-10">
          <MediaDisplay
            src={portada.url}
            tipo={portada.tipo}
            alt={portada.descripcion || pub.titulo}
            modoVideo="reproductor"
            className={portada.tipo === "video" ? "aspect-video rounded-sm" : "aspect-[3/2] rounded-sm"}
          />
          <PieDeFoto item={portada} />
        </figure>
      )}

      <Cuerpo pub={pub} />

      {resto.length > 0 && (
        <div className="mt-12 space-y-12">
          {resto.map((item, i) => (
            <figure key={item.url + i}>
              <MediaDisplay
                src={item.url}
                tipo={item.tipo}
                alt={item.descripcion || `${pub.titulo} — foto ${i + 2}`}
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
            {artistas.length === 1 ? "Artista" : "Artistas"}
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
