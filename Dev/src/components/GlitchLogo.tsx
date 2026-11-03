import Image from "next/image";

export function GlitchLogo() {
  return (
    <div className="glitch-logo relative w-80 sm:w-[28rem]">
      <Image
        src="/images/logo-magenta.jpg"
        alt="Magenta galería"
        width={700}
        height={700}
        priority
        className="glitch-logo__img relative z-10 h-auto w-full"
      />
    </div>
  );
}
