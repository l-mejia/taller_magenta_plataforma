import { PlaceholderImage } from "@/components/PlaceholderImage";
import { MediaContent, type ModoVideo } from "@/components/MediaContent";

export function MediaDisplay({
  src,
  tipo = "imagen",
  alt,
  className,
  modoVideo,
}: {
  src?: string;
  tipo?: "imagen" | "video";
  alt: string;
  className?: string;
  modoVideo?: ModoVideo;
}) {
  if (!src) {
    return <PlaceholderImage alt={alt} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden bg-[#fafafa] ${className ?? ""}`}>
      <MediaContent url={src} tipo={tipo} alt={alt} modoVideo={modoVideo} />
    </div>
  );
}
