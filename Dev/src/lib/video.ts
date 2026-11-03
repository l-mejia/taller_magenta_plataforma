export type VideoProveedor = "youtube" | "vimeo";

export interface VideoRef {
  proveedor: VideoProveedor;
  id: string;
}

/** Reconoce links de YouTube (watch, youtu.be, shorts, embed) y Vimeo. */
export function parseVideoUrl(url: string): VideoRef | null {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0];
    return id ? { proveedor: "youtube", id } : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = u.searchParams.get("v");
    if (v) return { proveedor: "youtube", id: v };
    const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/);
    return m ? { proveedor: "youtube", id: m[1] } : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const m = u.pathname.match(/(\d{6,})/);
    return m ? { proveedor: "vimeo", id: m[1] } : null;
  }
  return null;
}

/**
 * URL del reproductor embebido. En modo "fondo" se reproduce solo, en
 * silencio y en loop, como los videos de las tarjetas del mockup.
 */
export function embedUrl(ref: VideoRef, fondo: boolean): string {
  if (ref.proveedor === "youtube") {
    const params = fondo
      ? `autoplay=1&mute=1&loop=1&playlist=${ref.id}&controls=0&playsinline=1&rel=0`
      : "rel=0&playsinline=1";
    return `https://www.youtube-nocookie.com/embed/${ref.id}?${params}`;
  }
  const params = fondo ? "background=1" : "dnt=1";
  return `https://player.vimeo.com/video/${ref.id}?${params}`;
}

export function thumbnailUrl(ref: VideoRef): string | null {
  // Vimeo no expone la miniatura sin consultar su API
  return ref.proveedor === "youtube" ? `https://i.ytimg.com/vi/${ref.id}/hqdefault.jpg` : null;
}
