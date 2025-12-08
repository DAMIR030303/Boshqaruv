-- Create employees table
create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  avatar text,
  status text not null default 'offline',
  department text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.employees replica identity full;

do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'employees'
  ) then
    execute 'alter publication supabase_realtime add table public.employees';
  end if;
end $$;

alter table public.employees enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='employees' and policyname='employees_select_auth') then
    create policy "employees_select_auth" on public.employees for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='employees' and policyname='employees_insert_auth') then
    create policy "employees_insert_auth" on public.employees for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='employees' and policyname='employees_update_auth') then
    create policy "employees_update_auth" on public.employees for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='employees' and policyname='employees_delete_auth') then
    create policy "employees_delete_auth" on public.employees for delete using (auth.role() = 'authenticated');
  end if;
end $$;


-- Update tasks table to add due_date
do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='tasks' and column_name='due_date') then
    alter table public.tasks add column due_date timestamptz;
  end if;
end $$;

-- Create comments table if not exists (for CollaborationService)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  author text not null,
  content text not null,
  mentions text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

alter table public.comments replica identity full;

do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'comments'
  ) then
    execute 'alter publication supabase_realtime add table public.comments';
  end if;
end $$;

alter table public.comments enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='comments' and policyname='comments_select_auth') then
    create policy "comments_select_auth" on public.comments for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='comments' and policyname='comments_insert_auth') then
    create policy "comments_insert_auth" on public.comments for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='comments' and policyname='comments_update_auth') then
    create policy "comments_update_auth" on public.comments for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='comments' and policyname='comments_delete_auth') then
    create policy "comments_delete_auth" on public.comments for delete using (auth.role() = 'authenticated');
  end if;
end $$;
