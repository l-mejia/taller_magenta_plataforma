# Contrato de datos — web Magenta ↔ plataforma de carga

La web pública **solo lee** de Supabase. La plataforma de carga es la que escribe.
Las dos usan el mismo proyecto: `https://csuobqkkeaxggxgouqep.supabase.co`.
El esquema completo está en [`Dev/supabase/schema.sql`](../Dev/supabase/schema.sql).

## Permisos

- Lectura: pública (cualquier visitante).
- Escritura (tablas y bucket `media`): solo usuarios autenticados que estén en `public.admins`.
- Opciones para la plataforma de carga:
  1. **Recomendado:** usar `supabase-js` con la *publishable key* e iniciar sesión con
     un usuario admin (`signInWithPassword`). RLS hace el resto.
  2. Desde un servidor/backend propio con la *secret key* (`sb_secret_...`). Se salta RLS:
     **nunca** ponerla en código que corra en el navegador ni subirla a git.

## Tabla `exposiciones`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | text, PK | slug legible, se usa en la URL: `/exposiciones/<id>`. Ej. `luz-y-materia` |
| `titulo` | text | obligatorio |
| `descripcion` | text | breve, se ve en la tarjeta |
| `parrafo_explicativo` | text | texto curatorial; respeta saltos de línea |
| `bio_artista` | text | respeta saltos de línea |
| `media` | jsonb | lista de media (ver abajo); la primera es la portada |
| `created_at` | timestamptz | la web ordena de más nueva a más antigua |

## Tabla `items_tienda`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | text, PK | slug único. Ej. `cuadro-memoria-expandida` |
| `categoria` | text | uno de: `obras`, `utilitario`, `editorial` |
| `tipo` | text | libre: Cuadro, Escultura, Llavero, Libro… |
| `titulo`, `autor` | text | |
| `precio` | numeric(10,2) | en soles, **número** (ej. `1250.50`), sin "S/" |
| `descripcion`, `medidas`, `tecnica` | text | |
| `ano` | integer | año de producción |
| `stock` | integer ≥ 0 | en 0 se muestra "Agotado" |
| `media` | jsonb | igual que en exposiciones |
| `created_at` | timestamptz | orden de más nuevo a más antiguo |

## Formato de `media`

```json
[
  { "url": "https://csuobqkkeaxggxgouqep.supabase.co/storage/v1/object/public/media/tienda/9f1c….jpg", "tipo": "imagen" },
  { "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX", "tipo": "video" }
]
```

- `tipo`: `"imagen"` o `"video"`.
- **Imágenes:** subir al bucket `media`, en la carpeta `exposiciones/` o `tienda/`, y guardar la
  URL pública (`storage.from('media').getPublicUrl(path)`). Formatos: jpg, png, webp, gif; máx. 5 MB.
  Recomendado: redimensionar a máx. 1600 px de lado y JPEG calidad ~0.8 antes de subir.
- **Videos:** no se suben archivos. Se guarda el link de YouTube (watch, youtu.be, shorts) o Vimeo.
- Al borrar un contenido o quitar una foto, borrar también el archivo del bucket para no dejar huérfanos.
