-- Esquema de Magenta. Pegar completo en Supabase → SQL Editor → Run.
-- Es idempotente: se puede volver a correr sin perder datos.

-- ---------------------------------------------------------------------------
-- Administradores
-- Solo los usuarios listados aquí pueden editar contenido. Tener una cuenta
-- en Supabase Auth no alcanza: además hay que estar en esta tabla.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins: cada uno ve su fila" on public.admins;
create policy "admins: cada uno ve su fila" on public.admins
  for select to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Exposiciones
-- ---------------------------------------------------------------------------
create table if not exists public.exposiciones (
  id text primary key,
  titulo text not null,
  descripcion text not null default '',
  parrafo_explicativo text not null default '',
  bio_artista text not null default '',
  -- [{ "url": "...", "tipo": "imagen" | "video" }]; la primera es la portada
  media jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Tienda
-- ---------------------------------------------------------------------------
create table if not exists public.items_tienda (
  id text primary key,
  categoria text not null check (categoria in ('obras', 'utilitario', 'editorial')),
  tipo text not null default '',
  titulo text not null,
  autor text not null default '',
  precio numeric(10, 2) not null default 0 check (precio >= 0),
  descripcion text not null default '',
  medidas text not null default '',
  tecnica text not null default '',
  ano integer,
  stock integer not null default 0 check (stock >= 0),
  media jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists exposiciones_updated_at on public.exposiciones;
create trigger exposiciones_updated_at before update on public.exposiciones
  for each row execute function public.touch_updated_at();

drop trigger if exists items_tienda_updated_at on public.items_tienda;
create trigger items_tienda_updated_at before update on public.items_tienda
  for each row execute function public.touch_updated_at();

-- Lectura pública, escritura solo admins
alter table public.exposiciones enable row level security;
alter table public.items_tienda enable row level security;

drop policy if exists "exposiciones: lectura publica" on public.exposiciones;
create policy "exposiciones: lectura publica" on public.exposiciones
  for select to anon, authenticated using (true);

drop policy if exists "exposiciones: admins escriben" on public.exposiciones;
create policy "exposiciones: admins escriben" on public.exposiciones
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "tienda: lectura publica" on public.items_tienda;
create policy "tienda: lectura publica" on public.items_tienda
  for select to anon, authenticated using (true);

drop policy if exists "tienda: admins escriben" on public.items_tienda;
create policy "tienda: admins escriben" on public.items_tienda
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: bucket público "media" para las fotos (máx. 5 MB, solo imágenes).
-- Los videos no se suben: se enlazan desde YouTube o Vimeo.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media: admins suben" on storage.objects;
create policy "media: admins suben" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admins actualizan" on storage.objects;
create policy "media: admins actualizan" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admins borran" on storage.objects;
create policy "media: admins borran" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Dar permisos de admin (correr DESPUÉS de crear el usuario en
-- Authentication → Users → Add user):
--
-- insert into public.admins (user_id, email)
-- select id, email from auth.users where email = 'tallermagentalima@gmail.com'
-- on conflict (user_id) do nothing;
-- ---------------------------------------------------------------------------
