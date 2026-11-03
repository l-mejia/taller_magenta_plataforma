# Configurar Supabase (fase 1)

La web lee y guarda exposiciones, tienda y fotos en Supabase. El panel admin
usa Supabase Auth. Pasos (una sola vez):

## 1. Crear el proyecto

1. Entrar a <https://supabase.com> con la cuenta **tallermagentalima@gmail.com** → *New project*.
2. Nombre: `magenta`. Región: **South America (São Paulo)** (la más cercana a Lima).
3. Guardar la contraseña de la base de datos en un lugar seguro (no se usa en la web).

## 2. Crear tablas, permisos y bucket de fotos

1. *SQL Editor* → *New query*.
2. Pegar todo el contenido de [`supabase/schema.sql`](supabase/schema.sql) → *Run*.

Se puede volver a correr sin perder datos si cambia el esquema.

## 3. Crear el usuario admin

1. *Authentication* → *Users* → *Add user* → *Create new user*.
   Email `tallermagentalima@gmail.com`, una contraseña fuerte, marcar *Auto confirm user*.
2. En el *SQL Editor* correr:

   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users where email = 'tallermagentalima@gmail.com'
   on conflict (user_id) do nothing;
   ```

3. Recomendado: *Authentication* → *Sign In / Providers* → desactivar **Allow new users to sign up**.
   (Aunque alguien se registre no podría editar nada, porque no está en `admins`.)

Para sumar otro admin: repetir 1 y 2 con su email.

## 4. Conectar la web

1. *Project Settings* → *API Keys*: copiar la **URL del proyecto** y la clave
   **anon / publishable**. Nunca usar la `service_role` / secret en la web.
2. En `Dev/`, copiar `.env.example` como `.env.local` y completar ambos valores.
3. `npm run dev` → <http://localhost:3000>.

## 5. Cargar contenido de prueba

1. Mantener presionado el logo 8 segundos → login con el email y contraseña del paso 3.
2. En `/admin` → *Cargar contenido de ejemplo* (abajo de todo). Reemplaza todo
   por las exposiciones y productos de ejemplo de `src/data/`.

## Fotos y videos

- Las fotos se suben al bucket público `media` (máx. 5 MB c/u; el admin las
  comprime a ~1600 px antes de subir). Al quitar una foto o borrar un
  contenido, el archivo también se borra del storage.
- Los videos **no** se suben: se publican en YouTube (como "no listado") o
  Vimeo y se pega el link en el admin.

## Vercel

En el proyecto de Vercel, *Settings* → *Environment Variables*: agregar
`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` con los mismos
valores del `.env.local`, y volver a desplegar.
