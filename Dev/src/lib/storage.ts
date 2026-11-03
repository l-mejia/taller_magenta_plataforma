import type { MediaItem } from "@/data/media";
import { MEDIA_BUCKET, requireSupabase } from "@/lib/supabase";

const EXTENSIONES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Sube una imagen al bucket público y devuelve su URL pública. */
export async function uploadImagen(blob: Blob, carpeta: string): Promise<string> {
  const supabase = requireSupabase();
  const ext = EXTENSIONES[blob.type] ?? "jpg";
  const path = `${carpeta}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, { contentType: blob.type || "image/jpeg", cacheControl: "31536000" });
  if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`);

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Devuelve la ruta dentro del bucket si la URL es de nuestro storage; null si es externa. */
function storagePath(url: string): string | null {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

/** Borra del storage los archivos propios de una lista de media (ignora links externos). */
export async function borrarMedia(items: MediaItem[]): Promise<void> {
  const paths = items.map((m) => storagePath(m.url)).filter((p): p is string => p !== null);
  if (paths.length === 0) return;
  // si falla, solo queda un archivo huérfano: no bloqueamos el borrado del contenido
  await requireSupabase().storage.from(MEDIA_BUCKET).remove(paths);
}
