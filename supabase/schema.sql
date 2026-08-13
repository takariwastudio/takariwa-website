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