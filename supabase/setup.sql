-- KPI table
create table if not exists public.kpi (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.kpi replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'kpi'
  ) then
    execute 'alter publication supabase_realtime add table public.kpi';
  end if;
end $$;
alter table public.kpi enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'kpi' and policyname = 'kpi_select_auth'
  ) then
    create policy "kpi_select_auth" on public.kpi for select using (auth.role() = 'authenticated');
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'kpi' and policyname = 'kpi_write_auth'
  ) then
    create policy "kpi_write_auth" on public.kpi for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'kpi' and policyname = 'kpi_update_auth'
  ) then
    create policy "kpi_update_auth" on public.kpi for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assignee text,
  status text not null default 'pending',
  priority text not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tasks'
  ) then
    execute 'alter publication supabase_realtime add table public.tasks';
  end if;
end $$;
alter table public.tasks enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='tasks' and policyname='tasks_select_auth') then
    create policy "tasks_select_auth" on public.tasks for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='tasks' and policyname='tasks_insert_auth') then
    create policy "tasks_insert_auth" on public.tasks for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='tasks' and policyname='tasks_update_auth') then
    create policy "tasks_update_auth" on public.tasks for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

-- Attendance
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  check_in timestamptz,
  check_out timestamptz,
  status text,
  created_at timestamptz not null default now()
);

alter table public.attendance replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'attendance'
  ) then
    execute 'alter publication supabase_realtime add table public.attendance';
  end if;
end $$;
alter table public.attendance enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='attendance' and policyname='attendance_select_auth') then
    create policy "attendance_select_auth" on public.attendance for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='attendance' and policyname='attendance_write_auth') then
    create policy "attendance_write_auth" on public.attendance for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='attendance' and policyname='attendance_update_auth') then
    create policy "attendance_update_auth" on public.attendance for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

-- Shifts
create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  employee_id text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  status text default 'scheduled',
  created_at timestamptz not null default now()
);

alter table public.shifts replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'shifts'
  ) then
    execute 'alter publication supabase_realtime add table public.shifts';
  end if;
end $$;
alter table public.shifts enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='shifts' and policyname='shifts_select_auth') then
    create policy "shifts_select_auth" on public.shifts for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='shifts' and policyname='shifts_write_auth') then
    create policy "shifts_write_auth" on public.shifts for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='shifts' and policyname='shifts_update_auth') then
    create policy "shifts_update_auth" on public.shifts for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

-- Penalties
create table if not exists public.penalties (
  id uuid primary key default gen_random_uuid(),
  employee_id text not null,
  type text not null,
  amount numeric not null default 0,
  status text not null default 'active',
  reason text,
  created_at timestamptz not null default now()
);

alter table public.penalties replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'penalties'
  ) then
    execute 'alter publication supabase_realtime add table public.penalties';
  end if;
end $$;
alter table public.penalties enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='penalties' and policyname='penalties_select_auth') then
    create policy "penalties_select_auth" on public.penalties for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='penalties' and policyname='penalties_write_auth') then
    create policy "penalties_write_auth" on public.penalties for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='penalties' and policyname='penalties_update_auth') then
    create policy "penalties_update_auth" on public.penalties for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

-- Reports
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  data jsonb,
  generated_at timestamptz not null default now(),
  period text
);

alter table public.reports replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'reports'
  ) then
    execute 'alter publication supabase_realtime add table public.reports';
  end if;
end $$;
alter table public.reports enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='reports' and policyname='reports_select_auth') then
    create policy "reports_select_auth" on public.reports for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='reports' and policyname='reports_write_auth') then
    create policy "reports_write_auth" on public.reports for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='reports' and policyname='reports_update_auth') then
    create policy "reports_update_auth" on public.reports for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;


