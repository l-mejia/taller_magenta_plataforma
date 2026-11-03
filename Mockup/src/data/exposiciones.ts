import type { MediaItem } from "@/data/media";

export interface Exposicion {
  id: string;
  titulo: string;
  descripcion: string;
  parrafoExplicativo: string;
  media: MediaItem[];
  bioArtista: string;
}

export const exposiciones: Exposicion[] = [
  {
    id: "luz-y-materia",
    titulo: "Luz y materia",
    descripcion:
      "Una exploración de la presencia material y la luz en el taller.",
    parrafoExplicativo:
      "Una exploración de la presencia material y la luz en el taller, donde cada pieza dialoga con el espacio y el tiempo. Las obras reunidas en esta muestra invitan a detenerse en lo sutil: la sombra que cambia con las horas, la textura que solo se revela de cerca.",
    media: [],
    bioArtista:
      "Colectivo de artistas residentes del Taller Magenta, cuya práctica conjunta explora la luz y la materia como lenguaje común.",
  },
  {
    id: "voces-del-sur",
    titulo: "Voces del sur",
    descripcion: "Relatos visuales de artistas del interior del país.",
    parrafoExplicativo:
      "Una muestra que reúne relatos visuales de artistas del interior del país, poniendo en primer plano perspectivas contemporáneas y contextuales. El recorrido propone un cruce entre memoria colectiva y lenguaje plástico actual.",
    media: [],
    bioArtista:
      "Muestra colectiva de artistas del interior del país que trabajan en torno a la memoria, el territorio y la identidad.",
  },
  {
    id: "trazos-contemporaneos",
    titulo: "Trazos contemporáneos",
    descripcion: "Obras que redefinen la pintura y el objeto artesanal.",
    parrafoExplicativo:
      "Obras que redefinen la pintura y el objeto, con procesos artesanales y materiales experimentales. Cada artista trabaja desde su propio taller, pero comparte una misma pregunta: qué queda de lo hecho a mano en un tiempo acelerado.",
    media: [],
    bioArtista:
      "Artistas del taller que investigan procesos artesanales y materiales experimentales en su producción reciente.",
  },
];
