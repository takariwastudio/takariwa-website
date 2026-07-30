-- Ejecutar en el SQL editor de Supabase.

create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  empresa text not null,
  contacto text,
  email text not null,
  status text not null default 'nuevo', -- nuevo | en_revision | aprobado | archivado
  data jsonb not null
);

create index if not exists briefs_created_at_idx on briefs (created_at desc);
create index if not exists briefs_status_idx on briefs (status);

alter table briefs enable row level security;

-- El formulario público solo puede INSERTAR (con la anon key), nunca leer.
create policy "Cualquiera puede enviar un brief"
  on briefs for insert
  to anon
  with check (true);

-- Nadie puede leer/actualizar con la anon key. El panel admin usa la
-- service_role key desde el servidor (server actions / server components),
-- que se salta RLS por diseño — nunca exponer esa key en el cliente.
