-- Tabla de categorías de productos
create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  descripcion text,
  created_at timestamp with time zone default now()
);

-- Tabla de ingredientes peligrosos
create table if not exists public.ingredientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nombre_cientifico text,
  nivel_riesgo integer not null check (nivel_riesgo between 1 and 5),
  descripcion_riesgo text not null,
  efectos_salud text not null,
  fuente_cientifica text,
  es_disruptor_endocrino boolean default false,
  created_at timestamp with time zone default now()
);

-- Tabla de productos de cuidado personal
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  marca text not null,
  categoria_id uuid references public.categorias(id) on delete set null,
  descripcion text,
  imagen_url text,
  indice_riesgo integer default 0 check (indice_riesgo between 0 and 100),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabla de relación productos-ingredientes
create table if not exists public.producto_ingredientes (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  ingrediente_id uuid not null references public.ingredientes(id) on delete cascade,
  concentracion text,
  created_at timestamp with time zone default now(),
  unique(producto_id, ingrediente_id)
);

-- Tabla de evaluaciones de productos
create table if not exists public.evaluaciones (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  indice_riesgo_calculado integer not null,
  detalles_evaluacion jsonb,
  evaluado_por text default 'sistema',
  created_at timestamp with time zone default now()
);

-- Habilitar RLS en todas las tablas
alter table public.categorias enable row level security;
alter table public.ingredientes enable row level security;
alter table public.productos enable row level security;
alter table public.producto_ingredientes enable row level security;
alter table public.evaluaciones enable row level security;

-- Políticas de lectura pública
create policy "categorias_select_public" on public.categorias for select using (true);
create policy "ingredientes_select_public" on public.ingredientes for select using (true);
create policy "productos_select_public" on public.productos for select using (true);
create policy "producto_ingredientes_select_public" on public.producto_ingredientes for select using (true);
create policy "evaluaciones_select_public" on public.evaluaciones for select using (true);
