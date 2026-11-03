const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo leer la imagen"));
    img.src = src;
  });
}

/** Aproxima el peso en bytes de un data URL base64. */
export function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.round((base64.length * 3) / 4);
}

/**
 * Redimensiona (máx. 1600px de lado) y recomprime una imagen a JPEG antes
 * de convertirla en data URL, para no llenar el localStorage con fotos
 * pesadas subidas tal cual desde una cámara o el celular.
 */
export async function toLightweightDataUrl(file: File): Promise<string> {
  const original = await readAsDataUrl(file);
  try {
    const img = await loadImage(original);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const width = Math.round(img.width * scale) || 1;
    const height = Math.round(img.height * scale) || 1;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return original;

    ctx.drawImage(img, 0, 0, width, height);
    const compressed = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    // si por algún motivo salió más pesado que el original (imágenes ya muy chicas), nos quedamos con el original
    return dataUrlBytes(compressed) < dataUrlBytes(original) ? compressed : original;
  } catch {
    return original;
  }
}
