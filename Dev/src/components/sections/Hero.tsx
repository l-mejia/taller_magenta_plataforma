import { GlitchLogo } from "@/components/GlitchLogo";

export function Hero() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="sr-only">Magenta galería</h1>
      <GlitchLogo />
    </main>
  );
}
