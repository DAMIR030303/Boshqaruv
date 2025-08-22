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

-- =========================
-- Marketing specific tables
-- =========================

-- marketing_tasks
create table if not exists public.marketing_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  task_type varchar(50) not null,
  title varchar(255) not null,
  description text,
  target_count integer default 1,
  completed_count integer default 0,
  status varchar(20) default 'pending',
  priority varchar(10) default 'medium',
  due_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.marketing_tasks replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'marketing_tasks'
  ) then
    execute 'alter publication supabase_realtime add table public.marketing_tasks';
  end if;
end $$;
alter table public.marketing_tasks enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='marketing_tasks' and policyname='marketing_tasks_select_auth') then
    create policy "marketing_tasks_select_auth" on public.marketing_tasks for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='marketing_tasks' and policyname='marketing_tasks_insert_auth') then
    create policy "marketing_tasks_insert_auth" on public.marketing_tasks for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='marketing_tasks' and policyname='marketing_tasks_update_auth') then
    create policy "marketing_tasks_update_auth" on public.marketing_tasks for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

-- instagram_posts
create table if not exists public.instagram_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  content_url varchar(500),
  caption text,
  hashtags text[],
  location varchar(255),
  status varchar(20) default 'draft',
  engagement_likes integer default 0,
  engagement_comments integer default 0,
  engagement_shares integer default 0,
  published_at timestamptz,
  created_at timestamptz default now()
);

alter table public.instagram_posts replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'instagram_posts'
  ) then
    execute 'alter publication supabase_realtime add table public.instagram_posts';
  end if;
end $$;
alter table public.instagram_posts enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='instagram_posts' and policyname='instagram_posts_select_auth') then
    create policy "instagram_posts_select_auth" on public.instagram_posts for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='instagram_posts' and policyname='instagram_posts_insert_auth') then
    create policy "instagram_posts_insert_auth" on public.instagram_posts for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='instagram_posts' and policyname='instagram_posts_update_auth') then
    create policy "instagram_posts_update_auth" on public.instagram_posts for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

-- video_projects
create table if not exists public.video_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  title varchar(255) not null,
  video_type varchar(50) default 'reels',
  duration_seconds integer,
  status varchar(20) default 'editing',
  preview_url varchar(500),
  final_url varchar(500),
  music_track varchar(255),
  created_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.video_projects replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'video_projects'
  ) then
    execute 'alter publication supabase_realtime add table public.video_projects';
  end if;
end $$;
alter table public.video_projects enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='video_projects' and policyname='video_projects_select_auth') then
    create policy "video_projects_select_auth" on public.video_projects for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='video_projects' and policyname='video_projects_insert_auth') then
    create policy "video_projects_insert_auth" on public.video_projects for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='video_projects' and policyname='video_projects_update_auth') then
    create policy "video_projects_update_auth" on public.video_projects for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

-- marketing_kpi
create table if not exists public.marketing_kpi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  metric_name varchar(100) not null,
  current_value numeric(10,2) default 0,
  target_value numeric(10,2) not null,
  metric_date date default current_date,
  category varchar(50),
  created_at timestamptz default now()
);

alter table public.marketing_kpi replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'marketing_kpi'
  ) then
    execute 'alter publication supabase_realtime add table public.marketing_kpi';
  end if;
end $$;
alter table public.marketing_kpi enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='marketing_kpi' and policyname='marketing_kpi_select_auth') then
    create policy "marketing_kpi_select_auth" on public.marketing_kpi for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='marketing_kpi' and policyname='marketing_kpi_insert_auth') then
    create policy "marketing_kpi_insert_auth" on public.marketing_kpi for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='marketing_kpi' and policyname='marketing_kpi_update_auth') then
    create policy "marketing_kpi_update_auth" on public.marketing_kpi for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

-- content_monitoring
create table if not exists public.content_monitoring (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  platform varchar(50) not null,
  account_handle varchar(100),
  last_checked timestamptz default now(),
  status varchar(20) default 'active',
  follower_count integer default 0,
  following_count integer default 0,
  post_count integer default 0
);

alter table public.content_monitoring replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'content_monitoring'
  ) then
    execute 'alter publication supabase_realtime add table public.content_monitoring';
  end if;
end $$;
alter table public.content_monitoring enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='content_monitoring' and policyname='content_monitoring_select_auth') then
    create policy "content_monitoring_select_auth" on public.content_monitoring for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='content_monitoring' and policyname='content_monitoring_insert_auth') then
    create policy "content_monitoring_insert_auth" on public.content_monitoring for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='content_monitoring' and policyname='content_monitoring_update_auth') then
    create policy "content_monitoring_update_auth" on public.content_monitoring for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  end if;
end $$;

-- ai_content_logs
create table if not exists public.ai_content_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  content_type varchar(50),
  prompt_text text not null,
  generated_content text not null,
  is_used boolean default false,
  created_at timestamptz default now()
);

alter table public.ai_content_logs replica identity full;
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'ai_content_logs'
  ) then
    execute 'alter publication supabase_realtime add table public.ai_content_logs';
  end if;
end $$;
alter table public.ai_content_logs enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ai_content_logs' and policyname='ai_content_logs_select_auth') then
    create policy "ai_content_logs_select_auth" on public.ai_content_logs for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ai_content_logs' and policyname='ai_content_logs_insert_auth') then
    create policy "ai_content_logs_insert_auth" on public.ai_content_logs for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ai_content_logs' and policyname='ai_content_logs_update_auth') then
    create policy "ai_content_logs_update_auth" on public.ai_content_logs for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
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


