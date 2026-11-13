const direccion = "Av. Lima 149, Barranco, Lima, Perú";

export const contacto = {
  nombre: "Nuria Cano Erazo",
  email: "tallermagentalima@gmail.com",
  telefono: "992654575",
  instagram: "@magenta.galeria",
  instagramUrl: "https://instagram.com/magenta.galeria",
  direccion,
  horario: "Jueves a sábado, de 4 a 8 p. m.",
  // búsqueda por la dirección exacta: el link corto anterior marcaba Av. Lima 148
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`,
};
