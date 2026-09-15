-- Ejecutar en el SQL editor de Supabase.
-- Si ya tienes la tabla "briefs" de una entrega anterior, esto la migra sin
-- perder datos — usa IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null default 'web', -- 'web' | 'diseno'
  empresa text not null,
  contacto text,
  email text,
  status text not null default 'nuevo', -- nuevo | en_revision | aprobado | archivado
  data jsonb not null
);

-- MIGRACIÓN — si la tabla ya existía sin la columna "type" o con "email"
-- como NOT NULL, esto la deja al día sin perder datos.
alter table briefs add column if not exists type text not null default 'web';
alter table briefs alter column email drop not null;

create index if not exists briefs_created_at_idx on briefs (created_at desc);
create index if not exists briefs_status_idx on briefs (status);
create index if not exists briefs_type_idx on briefs (type);

alter table briefs enable row level security;

drop policy if exists "Cualquiera puede enviar un brief" on briefs;
create policy "Cualquiera puede enviar un brief"
  on briefs for insert
  to anon
  with check (true);

-- Nadie puede leer/actualizar con la anon key. El panel admin usa la
-- service_role key desde el servidor, que se salta RLS por diseño —
-- nunca exponer esa key en el cliente.


-- Storage: bucket para los archivos de referencia del brief de diseño
-- (público de lectura, para que el link del correo/panel funcione directo).
insert into storage.buckets (id, name, public)
values ('brief-uploads', 'brief-uploads', true)
on conflict (id) do nothing;

drop policy if exists "Cualquiera puede subir archivos de brief" on storage.objects;
create policy "Cualquiera puede subir archivos de brief"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'brief-uploads');

drop policy if exists "Los archivos de brief son públicos para lectura" on storage.objects;
create policy "Los archivos de brief son públicos para lectura"
  on storage.objects for select
  to public
  using (bucket_id = 'brief-uploads');

-- Clientes que se muestran en el marquee de "Nuestros clientes" del home.
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  logo_url text not null,
  website_url text
);

create index if not exists clients_created_at_idx on clients (created_at asc);

alter table clients enable row level security;

drop policy if exists "Cualquiera puede leer clientes" on clients;
create policy "Cualquiera puede leer clientes"
  on clients for select
  to anon
  using (true);

-- A diferencia de "briefs", aquí NO hay policy de insert/update/delete para
-- anon: agregar o quitar un cliente es una acción de administrador, no algo
-- que cualquier visitante del sitio deba poder hacer. El panel admin usa la
-- service_role key desde el servidor (Server Actions), que se salta RLS.


-- Storage: bucket para los logos de clientes (público de lectura, para que
-- el <img> del home los cargue directo).
insert into storage.buckets (id, name, public)
values ('client-logos', 'client-logos', true)
on conflict (id) do nothing;

drop policy if exists "Los logos de clientes son públicos para lectura" on storage.objects;
create policy "Los logos de clientes son públicos para lectura"
  on storage.objects for select
  to public
  using (bucket_id = 'client-logos');

-- Tampoco hay policy de insert en storage para 'client-logos' — el admin
-- sube los archivos desde una Server Action con la service_role key, que
-- se salta RLS. Nadie más puede escribir en ese bucket.

-- Proyectos que se muestran en "Nuestro trabajo" (home) y en /trabajos.
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  tag text not null,
  category text not null, -- 'diseño' | 'desarrollo' | 'audiovisual'
  hero_image_url text not null,
  paragraph_1 text not null default '',
  paragraph_2 text not null default ''
);

create index if not exists projects_created_at_idx on projects (created_at asc);
create index if not exists projects_category_idx on projects (category);

-- Galería de cada proyecto — tabla aparte para que sea de tamaño libre
-- (agregar/quitar imágenes sin tocar la fila del proyecto).
create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_id uuid not null references projects (id) on delete cascade,
  image_url text not null
);

create index if not exists project_images_project_id_idx on project_images (project_id);

alter table projects enable row level security;
alter table project_images enable row level security;

drop policy if exists "Cualquiera puede leer proyectos" on projects;
create policy "Cualquiera puede leer proyectos"
  on projects for select
  to anon
  using (true);

drop policy if exists "Cualquiera puede leer imágenes de proyectos" on project_images;
create policy "Cualquiera puede leer imágenes de proyectos"
  on project_images for select
  to anon
  using (true);

-- Igual que "clients": nada de insert/update/delete para anon. El admin
-- gestiona proyectos e imágenes desde Server Actions con la service_role key.

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "Las imágenes de proyectos son públicas para lectura" on storage.objects;
create policy "Las imágenes de proyectos son públicas para lectura"
  on storage.objects for select
  to public
  using (bucket_id = 'project-images');

-- Lista de servicios que se muestra en el detalle de cada proyecto — antes
-- era fija por categoría (misma lista para todo "diseño"), ahora es propia
-- de cada proyecto, cargada a mano desde el admin.
alter table projects add column if not exists services text[] not null default '{}';
-- Links de video (YouTube/Vimeo) — solo relevante para categoría audiovisual,
-- pero vive en la misma tabla para no complejizar el modelo.
alter table projects add column if not exists video_urls text[] not null default '{}';