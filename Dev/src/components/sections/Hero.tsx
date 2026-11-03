import { GlitchLogo } from "@/components/GlitchLogo";

export function Hero() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="sr-only">Magenta galería</h1>
      <GlitchLogo />
      <p className="text-sm text-neutral-400">
        © {new Date().getFullYear()}, Av. Lima 149 - Barranco, Lima, Perú
      </p>
    </main>
  );
}
