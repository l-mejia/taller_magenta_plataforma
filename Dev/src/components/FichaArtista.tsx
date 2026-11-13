import { MediaDisplay } from "@/components/MediaDisplay";
import type { Artista } from "@/data/artistas";

/** Foto, nombre, región · Instagram y bio de un artista. */
export function FichaArtista({ artista }: { artista: Artista }) {
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
