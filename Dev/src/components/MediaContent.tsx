import { embedUrl, parseVideoUrl, thumbnailUrl } from "@/lib/video";

/**
 * Cómo mostrar un video de YouTube/Vimeo:
 * - "miniatura": imagen fija con ícono de play (tarjetas y listas, liviano)
 * - "fondo": se reproduce solo, en silencio y en loop, sin controles
 * - "reproductor": reproductor completo con controles (página de detalle)
 */
export type ModoVideo = "miniatura" | "fondo" | "reproductor";

const llenar = "absolute inset-0 h-full w-full";

/** Contenido de un MediaItem, posicionado para llenar un contenedor `relative`. */
export function MediaContent({
  url,
  tipo,
  alt,
  modoVideo = "miniatura",
}: {
  url: string;
  tipo: "imagen" | "video";
  alt: string;
  modoVideo?: ModoVideo;
}) {
  if (tipo === "imagen") {
    // eslint-disable-next-line @next/next/no-img-element -- contenido dinámico subido por el admin, incompatible con la optimización de next/image
    return <img src={url} alt={alt} className={`${llenar} object-cover`} />;
  }

  const ref = parseVideoUrl(url);
  if (!ref) {
    // archivo de video directo (contenido antiguo o URL externa)
    return (
      <video
        key={url}
        src={url}
        className={`${llenar} object-cover`}
        autoPlay
        muted
        loop
        playsInline
        controls={modoVideo === "reproductor"}
      />
    );
  }

  const thumb = thumbnailUrl(ref);
  if (modoVideo === "miniatura" && thumb) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element -- miniatura externa de YouTube */}
        <img src={thumb} alt={alt} className={`${llenar} object-cover`} />
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 pl-0.5 text-sm text-neutral-800">
          ▶
        </span>
      </>
    );
  }

  const fondo = modoVideo !== "reproductor";
  return (
    <iframe
      key={url}
      src={embedUrl(ref, fondo)}
      title={alt}
      loading="lazy"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      allowFullScreen
      className={`${llenar} border-0 ${fondo ? "pointer-events-none scale-[1.35]" : ""}`}
    />
  );
}
