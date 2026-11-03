const objetivosEspecificos = [
  "Ofrecer un espacio de exhibición accesible para artistas emergentes y consolidados.",
  "Impulsar procesos de creación colectiva y residencias cortas dentro del taller.",
  "Acercar el arte contemporáneo a públicos diversos mediante actividades abiertas.",
  "Sostener el proyecto a través de una tienda de arte utilitario y obra original.",
];

export function QuienesSomos() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32">
      <h2 className="text-3xl font-medium tracking-tight text-neutral-900">
        Quiénes somos
      </h2>

      <div className="mt-8 space-y-5 text-neutral-600">
        <p>
          Magenta nació en Barranco como un taller autogestionado por artistas
          que buscaban un lugar propio para producir, mostrar y compartir su
          trabajo fuera de los circuitos tradicionales de la galería comercial.
        </p>
        <p>
          Con el tiempo, el taller se transformó en un espacio híbrido: parte
          estudio, parte sala de exposiciones, parte tienda. Un lugar donde
          conviven la práctica artística cotidiana y la posibilidad de que
          cualquier persona se lleve una pieza a casa.
        </p>
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-400">
            Propósito
          </h3>
          <p className="mt-2 text-neutral-600">
            Sostener un espacio vivo para la creación y exhibición de arte
            contemporáneo en Lima, gestionado por sus propios artistas.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-400">
            Objetivo general
          </h3>
          <p className="mt-2 text-neutral-600">
            Consolidar a Magenta como una plataforma independiente de
            exhibición, formación y venta de arte en Barranco.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-400">
          Objetivos específicos
        </h3>
        <ul className="mt-3 space-y-2">
          {objetivosEspecificos.map((objetivo) => (
            <li key={objetivo} className="flex gap-3 text-neutral-600">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#c2185b]" />
              <span>{objetivo}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
