
-- Settings table
create table public.settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  updated_at timestamptz default now()
);

-- Projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  title_en text not null,
  title_ar text not null,
  category text not null default 'CONFERENCES',
  type text not null default 'video',
  thumbnail text not null default '',
  video_url text default '',
  vimeo_id text default '',
  display_order integer default 0,
  featured boolean default false,
  visible boolean default true,
  created_at timestamptz default now()
);

-- Client requests table
create table public.requests (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  organization text not null,
  service_type text not null,
  event_date text default '',
  location text default '',
  details text default '',
  phone text not null,
  email text not null,
  status text default 'new',
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.settings enable row level security;
alter table public.projects enable row level security;
alter table public.requests enable row level security;

-- Public read policies
create policy "Public read settings" on public.settings for select using (true);
create policy "Public read projects" on public.projects for select using (visible = true);
create policy "Public insert requests" on public.requests for insert with check (true);

-- Admin policies for authenticated users
create policy "Admin all settings" on public.settings for all to authenticated using (true) with check (true);
create policy "Admin all projects" on public.projects for all to authenticated using (true) with check (true);
create policy "Admin all requests" on public.requests for all to authenticated using (true) with check (true);
