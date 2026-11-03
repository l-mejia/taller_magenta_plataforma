import Image from "next/image";

export function PlaceholderImage({
  alt,
  className,
}: {
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#fafafa] ${className ?? ""}`}>
      <Image
        src="/images/placeholder.svg"
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}
