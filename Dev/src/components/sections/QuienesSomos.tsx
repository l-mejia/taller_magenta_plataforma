const parrafos = [
  "Magenta es un espacio cultural autogestionado ubicado en Barranco, Lima - Perú, fundado en 2020, apenas quince días antes del inicio de la pandemia. En un contexto adverso, el proyecto logró sostenerse y crecer, consolidándose hoy como una iniciativa con seis años de trayectoria dedicada a la promoción de las artes visuales y la difusión cultural.",
  "Fundado y dirigido por Nuria Cano, artista visual, historiadora del arte y docente, Magenta funciona como una plataforma de exhibición, formación y encuentro.",
  "A través de exposiciones con una mirada curatorial y contextual, el espacio visibiliza a artistas de distintas regiones del Perú que, pese a su relevancia en la construcción del arte contemporáneo, permanecen fuera de los circuitos tradicionales, generando nuevas oportunidades para la circulación, conexión y valoración de sus obras.",
];

export function QuienesSomos() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32">
      <h2 className="text-3xl font-medium tracking-tight text-neutral-900">
        Quiénes somos
      </h2>

      <div className="mt-8 space-y-5 leading-relaxed text-neutral-600">
        {parrafos.map((parrafo) => (
          <p key={parrafo.slice(0, 24)}>{parrafo}</p>
        ))}
      </div>
    </main>
  );
}
