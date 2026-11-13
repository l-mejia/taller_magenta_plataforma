-- Publicaciones de PRUEBA para la revista: 1 artículo y 1 entrevista.
-- Pegar en Supabase → SQL Editor → Run. Se borran desde /admin/revista → Eliminar.

insert into public.revista (id, tipo, titulo, resumen, cuerpo, autor, fecha, media, publicado)
values
(
  'prueba-articulo-arte-en-barranco',
  'articulo',
  '[Prueba] El arte independiente en Barranco',
  'Artículo de prueba para revisar cómo se ve la revista.',
  'Barranco ha sido durante décadas un punto de encuentro para artistas, escritores y músicos. Sus casonas y talleres han acogido proyectos que nacen fuera de los circuitos tradicionales.

En los últimos años, espacios autogestionados como Magenta han abierto sus puertas a artistas de distintas regiones del Perú, generando nuevas oportunidades para la circulación de sus obras.

Este es un texto de prueba: puedes editarlo o eliminarlo desde el panel de administración.',
  'Equipo Magenta',
  current_date - 3,
  '[]'::jsonb,
  true
),
(
  'prueba-entrevista-dos-preguntas',
  'entrevista',
  '[Prueba] Conversación sobre el oficio',
  'Entrevista de prueba con dos preguntas.',
  '¿Cómo empezaste a trabajar como artista?

Empecé dibujando en cuadernos desde muy chica. Con los años entendí que el taller era un lugar para pensar, no solo para producir.

¿Qué significa para ti exponer en un espacio independiente?

Significa libertad y cercanía con el público. En un espacio independiente la conversación con quien visita la muestra es mucho más directa.',
  'Equipo Magenta',
  current_date,
  '[]'::jsonb,
  true
)
on conflict (id) do nothing;
