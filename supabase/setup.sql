-- Bigzone Marketing: database setup for Supabase.
-- Run this once in Supabase > SQL Editor > New query > paste > Run.
-- Before running, change the admin email on the line marked CHANGE ME.

-- Who may use the admin panel
create table if not exists public.admins (
  email text primary key
);
insert into public.admins (email) values ('admin@bigzonemarketing.com') -- CHANGE ME
on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

-- Property listings
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'House',
  purpose text not null default 'Buy',
  city text,
  area_category text,
  area text,
  price bigint default 0,
  beds int default 0,
  baths int default 0,
  size text,
  description text,
  images jsonb not null default '[]'::jsonb,
  video_url text,
  featured boolean not null default false,
  status text not null default 'published' check (status in ('published', 'draft', 'sold')),
  created_at timestamptz not null default now()
);
alter table public.listings add column if not exists area_category text;

-- Housing and commercial projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  location text,
  price bigint not null default 0,
  highlights text,
  description text,
  image text,
  link text,
  status text not null default 'published' check (status in ('published', 'draft')),
  created_at timestamptz not null default now()
);
alter table public.projects add column if not exists price bigint not null default 0;

-- News and updates posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  body text,
  image text,
  link text,
  link_label text,
  status text not null default 'published' check (status in ('published', 'draft')),
  created_at timestamptz not null default now()
);

-- Site settings (one row)
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb
);
insert into public.settings (id, data) values (1, '{}'::jsonb) on conflict do nothing;

-- Security: everyone can read published content, only admins can change anything
alter table public.admins   enable row level security;
alter table public.listings enable row level security;
alter table public.projects enable row level security;
alter table public.posts    enable row level security;
alter table public.settings enable row level security;

drop policy if exists "public read" on public.listings;
drop policy if exists "admin all"   on public.listings;
create policy "public read" on public.listings for select using (status <> 'draft' or public.is_admin());
create policy "admin all"   on public.listings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.projects;
drop policy if exists "admin all"   on public.projects;
create policy "public read" on public.projects for select using (status <> 'draft' or public.is_admin());
create policy "admin all"   on public.projects for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.posts;
drop policy if exists "admin all"   on public.posts;
create policy "public read" on public.posts for select using (status <> 'draft' or public.is_admin());
create policy "admin all"   on public.posts for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.settings;
drop policy if exists "admin all"   on public.settings;
create policy "public read" on public.settings for select using (true);
create policy "admin all"   on public.settings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin read" on public.admins;
create policy "admin read" on public.admins for select using (public.is_admin());

-- Photo storage: public to view, admins only to upload or delete
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read"  on storage.objects;
drop policy if exists "media admin insert" on storage.objects;
drop policy if exists "media admin update" on storage.objects;
drop policy if exists "media admin delete" on storage.objects;
create policy "media public read"  on storage.objects for select using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());
