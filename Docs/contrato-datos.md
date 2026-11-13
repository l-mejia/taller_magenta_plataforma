# Contrato de datos — Magenta

La web pública **solo lee** de Supabase. El contenido se carga desde la
plataforma de carga en `/admin` (misma web, solo para el admin).
Proyecto: `https://csuobqkkeaxggxgouqep.supabase.co`.
Esquema completo e idempotente: [`Dev/supabase/schema.sql`](../Dev/supabase/schema.sql).

## Permisos

- Lectura pública de artistas, exposiciones **publicadas** y productos **visibles**.
- El admin (usuario en `public.admins`) lee todo, incluidos borradores y ocultos, y es el único que escribe.
- Única cuenta admin: `tallermagentalima@gmail.com`.
- La *secret key* (`sb_secret_...`) nunca va en el navegador ni en git.

## `artistas` — catálogo compartido

| Columna | Tipo | Notas |
|---|---|---|
| `id` | text, PK | slug del nombre, ej. `nuria-cano` |
| `nombre` | text | obligatorio |
| `region` | text | región de origen |
| `bio` | text | se muestra en cada exposición donde participa |
| `instagram` | text | usuario sin `@` |
| `foto_url` | text, null | URL pública en el bucket `media/artistas/` |

## `exposiciones`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | text, PK | slug, se usa en la URL: `/exposiciones/<id>` |
| `titulo` | text | obligatorio |
| `descripcion` | text | breve, para la tarjeta |
| `parrafo_explicativo` | text | texto curatorial general; respeta saltos de línea |
| `fecha_inicio`, `fecha_fin` | date, null | inauguración y cierre |
| `publicado` | boolean | `false` = borrador, solo lo ve el admin |
| `media` | jsonb | fotos y videos (ver abajo); la primera es la portada |
| `bio_artista` | text | **obsoleto**, ya no se usa |

## `exposicion_artistas` — uno o varios artistas por exposición

| Columna | Tipo | Notas |
|---|---|---|
| `exposicion_id` | text → `exposiciones.id` | cascade al borrar |
| `artista_id` | text → `artistas.id` | cascade al borrar |
| `orden` | integer | orden en que se muestran |

## `items_tienda`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | text, PK | slug único |
| `categoria` | text | `obras`, `utilitario` o `editorial` |
| `tipo` | text | libre: Cuadro, Llavero, Libro… |
| `titulo` | text | |
| `artista_id` | text, null → `artistas.id` | autor del producto (se pone en null si se borra el artista) |
| `autor` | text | copia del nombre, por compatibilidad; la web muestra el del catálogo |
| `precio` | numeric(10,2) | en soles, número sin "S/" |
| `descripcion`, `medidas`, `tecnica` | text | |
| `ano` | integer | año de producción |
| `stock` | integer ≥ 0 | en 0 se muestra "Agotado" |
| `visible` | boolean | `false` = oculto en la tienda sin borrarlo |
| `media` | jsonb | igual que en exposiciones |

## `revista` — artículos, noticias y entrevistas

| Columna | Tipo | Notas |
|---|---|---|
| `id` | text, PK | slug, se usa en la URL: `/revista/<id>` |
| `tipo` | text | `articulo`, `noticia` o `entrevista` |
| `titulo` | text | obligatorio |
| `resumen` | text | bajada de una o dos líneas, para la lista |
| `cuerpo` | text | texto completo; párrafos separados por una línea en blanco. En entrevistas, los párrafos que terminan en "?" se muestran como preguntas |
| `autor` | text | firma ("Por …") |
| `fecha` | date | la revista se ordena por esta fecha, más reciente primero |
| `publicado` | boolean | `false` = borrador |
| `media` | jsonb | igual que en exposiciones; la primera es la portada |

## `revista_artistas` — artistas mencionados o entrevistados

| Columna | Tipo | Notas |
|---|---|---|
| `revista_id` | text → `revista.id` | cascade al borrar |
| `artista_id` | text → `artistas.id` | cascade al borrar |
| `orden` | integer | |

## Formato de `media`

```json
[
  {
    "url": "https://csuobqkkeaxggxgouqep.supabase.co/storage/v1/object/public/media/exposiciones/9f1c….jpg",
    "tipo": "imagen",
    "descripcion": "Vista de sala, segundo piso",
    "obra": { "titulo": "Memoria expandida", "artistaId": "maria-rojas", "tecnica": "Óleo sobre lienzo", "medidas": "60 x 80 cm", "ano": 2023 }
  },
  { "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX", "tipo": "video", "descripcion": "Registro de la inauguración" }
]
```

- `tipo`: `"imagen"` o `"video"`. `descripcion` (pie de foto) y `obra` (ficha) son opcionales.
- **Imágenes:** bucket `media`, carpetas `exposiciones/`, `tienda/`, `revista/` o `artistas/`. jpg, png, webp o gif; máx. 5 MB.
  La plataforma las reduce a 1600 px y JPEG ~0.8 antes de subir.
- **Videos:** no se suben archivos; se guarda el link de YouTube o Vimeo.
- Al quitar una foto o borrar contenido, la plataforma borra también el archivo del bucket.
