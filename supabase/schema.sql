-- Blumen Technologies Event Planner — run in Supabase SQL Editor
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  role text not null default 'manager' check (role in ('ceo', 'hr', 'manager')),
  created_at timestamptz default now()
);

create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  job_title text not null,
  department text not null,
  years int not null default 0,
  email text unique not null,
  phone text,
  birthday text,
  color text default '#3B82F6',
  created_at timestamptz default now()
);

create table if not exists staff_events (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references staff(id) on delete cascade,
  type text not null,
  event_date date not null,
  notes text default '',
  auto boolean default true,
  created_at timestamptz default now()
);

create table if not exists card_sends (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references staff(id) on delete set null,
  type text not null,
  channels text[] not null default '{}',
  body text,
  status text not null default 'delivered',
  sent_at timestamptz default now()
);

create table if not exists app_settings (
  id int primary key default 1 check (id = 1),
  ceo_name text not null default 'Dr. Yunusa Garba Muhammed',
  ceo_title text not null default 'Chief Executive Officer',
  ceo_email text not null default 'yunusa@blumentechnologies.com',
  reply_to text default 'office@blumentechnologies.com',
  cc_hr text default 'hr@blumentechnologies.com',
  auto_send boolean default true,
  reminder_3_day boolean default true,
  weekly_summary boolean default true,
  notify_ceo boolean default true
);

alter table profiles enable row level security;
alter table staff enable row level security;
alter table staff_events enable row level security;
alter table card_sends enable row level security;
alter table app_settings enable row level security;

drop policy if exists profiles_read on profiles;
drop policy if exists profiles_write on profiles;
drop policy if exists staff_all on staff;
drop policy if exists events_all on staff_events;
drop policy if exists sends_all on card_sends;
drop policy if exists settings_all on app_settings;

create policy profiles_read on profiles for select to authenticated using (true);
create policy profiles_write on profiles for all to authenticated using (true) with check (true);
create policy staff_all on staff for all to authenticated using (true) with check (true);
create policy events_all on staff_events for all to authenticated using (true) with check (true);
create policy sends_all on card_sends for all to authenticated using (true) with check (true);
create policy settings_all on app_settings for all to authenticated using (true) with check (true);

insert into app_settings (id) values (1) on conflict (id) do nothing;

-- Demo staff
insert into staff (full_name, job_title, department, years, email, phone, birthday, color) values
  ('Amara Okafor', 'Senior Software Engineer', 'Engineering', 6, 'amara.okafor@blumentechnologies.com', '+234 803 441 2290', '03-22', '#3B82F6'),
  ('Tunde Afolabi', 'DevOps Engineer', 'Engineering', 6, 'tunde.afolabi@blumentechnologies.com', '+234 809 112 8844', '09-12', '#38BDF8'),
  ('Adaeze Nwachukwu', 'Data Analyst', 'Engineering', 3, 'adaeze.nwachukwu@blumentechnologies.com', '+234 807 991 4402', '11-04', '#A855F7'),
  ('Blessing Obi', 'Finance Manager', 'Finance', 7, 'blessing.obi@blumentechnologies.com', '+234 807 890 1234', '02-14', '#EC4899'),
  ('Emeka Adeyemi', 'Sales Director', 'Sales', 8, 'emeka.adeyemi@blumentechnologies.com', '+234 802 555 0192', '05-30', '#EF4444'),
  ('Samuel Adeleke', 'Business Development Manager', 'Sales', 6, 'samuel.adeleke@blumentechnologies.com', '+234 814 330 7721', '07-08', '#F97316'),
  ('Chidi Nwosu', 'Product Manager', 'Product', 5, 'chidi.nwosu@blumentechnologies.com', '+234 806 220 1188', '08-19', '#8B5CF6'),
  ('Ngozi Eze', 'Senior Marketing Manager', 'Marketing', 4, 'ngozi.eze@blumentechnologies.com', '+234 803 200 4411', '01-19', '#B45309'),
  ('Kelechi Onyeka', 'Customer Success Lead', 'Support', 5, 'kelechi.onyeka@blumentechnologies.com', '+234 809 776 1200', '12-02', '#22C55E'),
  ('Chioma Uche', 'UX Designer', 'Product', 3, 'chioma.uche@blumentechnologies.com', '+234 802 667 3344', '08-30', '#7C3AED'),
  ('Fatima Ibrahim', 'HR Manager', 'Human Resources', 6, 'fatima.ibrahim@blumentechnologies.com', '+234 803 441 8800', '04-11', '#10B981'),
  ('Ibrahim Musa', 'Legal Counsel', 'Legal', 4, 'ibrahim.musa@blumentechnologies.com', '+234 805 119 3340', '10-21', '#64748B')
on conflict (email) do nothing;

insert into staff_events (staff_id, type, event_date, notes, auto)
select id, 'birthday', '2026-08-19', 'Turning 34', true from staff where email = 'chidi.nwosu@blumentechnologies.com'
union all select id, 'birthday', '2026-08-30', '', true from staff where email = 'chioma.uche@blumentechnologies.com'
union all select id, 'birthday', '2026-09-12', '', true from staff where email = 'tunde.afolabi@blumentechnologies.com'
union all select id, 'promotion', '2026-08-10', 'Promoted to Senior Marketing Manager', false from staff where email = 'ngozi.eze@blumentechnologies.com'
union all select id, 'wedding', '2026-08-05', '', false from staff where email = 'kelechi.onyeka@blumentechnologies.com'
union all select id, 'new_home', '2026-08-01', 'Bought a 4-bedroom duplex in Lekki', false from staff where email = 'emeka.adeyemi@blumentechnologies.com'
union all select id, 'bereavement', '2026-07-28', 'Lost his beloved mother', false from staff where email = 'tunde.afolabi@blumentechnologies.com'
union all select id, 'work_anniversary', '2026-06-01', '5 years with Blumen Technologies', false from staff where email = 'amara.okafor@blumentechnologies.com'
union all select id, 'new_car', '2026-08-15', 'Brand new Toyota Camry', false from staff where email = 'adaeze.nwachukwu@blumentechnologies.com';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'manager'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
