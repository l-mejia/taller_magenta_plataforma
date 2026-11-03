import { PlaceholderImage } from "@/components/PlaceholderImage";

export function MediaDisplay({
  src,
  tipo = "imagen",
  alt,
  className,
}: {
  src?: string;
  tipo?: "imagen" | "video";
  alt: string;
  className?: string;
}) {
  if (!src) {
    return <PlaceholderImage alt={alt} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden bg-[#fafafa] ${className ?? ""}`}>
      {tipo === "video" ? (
        <video
          src={src}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- contenido dinámico (URL o data URL) subido por el admin, incompatible con la optimización de next/image
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
