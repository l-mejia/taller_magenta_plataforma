const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    img.src = url;
  });
}

/**
 * Redimensiona (máx. 1600px de lado) y recomprime una imagen a JPEG antes
 * de subirla, para no gastar storage ni ancho de banda con fotos pesadas
 * subidas tal cual desde una cámara o el celular.
 */
export async function toLightweightBlob(file: File): Promise<Blob> {
  // los GIF pierden la animación si pasan por canvas
  if (file.type === "image/gif") return file;
  try {
    const img = await loadImage(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const width = Math.round(img.width * scale) || 1;
    const height = Math.round(img.height * scale) || 1;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, width, height);
    const compressed = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    // si por algún motivo salió más pesado que el original (imágenes ya muy chicas), nos quedamos con el original
    return compressed && compressed.size < file.size ? compressed : file;
  } catch {
    return file;
  }
}
