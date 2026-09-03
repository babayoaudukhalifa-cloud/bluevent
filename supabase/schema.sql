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
  job_title text not null default '',
  department text not null default '',
  years int not null default 0,
  email text unique,
  staff_code text default '',
  professional text default '',
  education text default '',
  specialization text default '',
  phone text,
  birthday text,
  color text default '#3B82F6',
  created_at timestamptz default now()
);

create table if not exists departments (
  name text primary key,
  sort_order int not null default 0
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
  ceo_title text not null default 'CEO/MD',
  ceo_email text not null default 'ygarbawala@gmail.com',
  reply_to text default 'office@blumentechnologies.com',
  cc_hr text default 'hr@blumentechnologies.com',
  auto_send boolean default true,
  reminder_3_day boolean default true,
  weekly_summary boolean default true,
  notify_ceo boolean default true,
  custom_occasions jsonb default '[]'::jsonb
);

alter table profiles enable row level security;
alter table staff enable row level security;
alter table departments enable row level security;
alter table staff_events enable row level security;
alter table card_sends enable row level security;
alter table app_settings enable row level security;

drop policy if exists profiles_read on profiles;
drop policy if exists profiles_write on profiles;
drop policy if exists staff_all on staff;
drop policy if exists departments_all on departments;
drop policy if exists events_all on staff_events;
drop policy if exists sends_all on card_sends;
drop policy if exists settings_all on app_settings;

create policy profiles_read on profiles for select to authenticated using (true);
create policy profiles_write on profiles for all to authenticated using (true) with check (true);
create policy staff_all on staff for all to authenticated using (true) with check (true);
create policy departments_all on departments for all to authenticated using (true) with check (true);
create policy events_all on staff_events for all to authenticated using (true) with check (true);
create policy sends_all on card_sends for all to authenticated using (true) with check (true);
create policy settings_all on app_settings for all to authenticated using (true) with check (true);

insert into app_settings (id) values (1) on conflict (id) do nothing;

alter table staff add column if not exists staff_code text default '';
alter table staff add column if not exists professional text default '';
alter table staff add column if not exists education text default '';
alter table staff add column if not exists specialization text default '';
alter table staff alter column email drop not null;

delete from departments;
insert into departments (name, sort_order) values
  ('Executive Office', 1),
  ('BD & Project Delivery', 2),
  ('Finance & Accounts', 3),
  ('Risk & Compliance', 4),
  ('Corporate Services', 5),
  ('Administration', 6),
  ('Logistics & Procurement', 7),
  ('Legal & Company Secretariat', 8),
  ('Technology & Product', 9),
  ('Blumen Pay', 10),
  ('Bluremit', 11),
  ('Blumen Energy', 12),
  ('Operations', 13)
on conflict (name) do update set sort_order = excluded.sort_order;

-- Staff directory
delete from card_sends;
delete from staff_events;
delete from staff;
insert into staff (full_name, job_title, department, years, email, staff_code, professional, education, specialization, phone, birthday, color) values
  ('Dr. Yunusa Muhammad Garba', 'MD', 'Operations', 0, 'ygarbawala@gmail.com', '', '', 'Human Anatomy', '', '', '', '#3B82F6'),
  ('Mr. Abubakar Abdullahi Kamba', 'Chief Risk & Compliance Officer (CRO)', 'Risk & Compliance', 0, 'abdullahikambaa@gmail.com', '', '', 'B.URP, Risk Management (M.Sc), MBA, PhD Corporate Governance & Leadership', 'Risk Management & Corporate Governance', '+234 806 945 1598', '', '#8B5CF6'),
  ('Dr. Abdurrahman Umar Chikaire', 'Chief Operating Officer (COO)', 'Operations', 10, 'drchikaire@gmail.com', '', '', 'MBBS, MPH, MBA', '', '', '', '#14B8A6'),
  ('Mr Zulkarnaini Musa', 'Chief Strategist', 'Strategy and Business Growth', 8, 'naini5004@gmail.com', '', '', 'Electrical and Electronic Engineering (B.Sc)', 'Strategy', '+234 803 387 4843', '', '#EF4444'),
  ('Mr. Abdulkadir Abubakar', 'Head of Logistics', 'Operations', 6, 'aq.qadeer198@gmail.com', '', '', 'Development Economin (M.Sc)', 'Project Management', '+234 903 683 5394', '', '#F97316'),
  ('Mr. Abdulwaheed Hassan', 'Chief Corporate Service (CCSO)', 'HR & Admin', 9, 'hassanabdulwaheed4@gmail.com', '', '', 'International Affairs Abd Diplomacy (M.Sc)', 'Administration', '+234 903 099 7659', '', '#06B6D4'),
  ('Mr. Sherif Adamu', 'Software Engineer', 'IT Department', 7, 'shereefadamu001@gmail.com', '', '', 'Doctor in Veterinary Medicine (DVM)', 'UI UX', '+234 903 175 4067', '', '#EC4899'),
  ('Mr. Ibrahim Muritala', 'Software Engineer', 'IT Department', 7, 'muritalaibrahim097@gmail.com', '', 'Software Engineer', 'Physics and Electronics (B.Sc)', 'Frontend', '+234 903 597 1227', '02-28', '#7C3AED'),
  ('Mr. Olakunle Stephen Oluwadamilola', 'Software Engineer', 'IT Department', 7, 'dammykunle79@gmail.com', '', 'Full-Stack Developer', 'Hydrology (B.Sc)', 'Web Development and Server Management', '+234 816 476 8989', '01-25', '#F59E0B'),
  ('Mr. Abdulsalam Zarruk', 'Web Devloper', 'IT Department', 5, 'abduussalamzarruk@gmail.com', '', 'Frontend Web Developer', 'Computer Science (Diploma)', 'Frontend Development', '', '', '#64748B'),
  ('Miss Hannah Rowland Ibimendi', 'Secretary', 'HR & Admin', 3, 'hannahbella.rh@gmail.com', '', 'Virtual Assistant (VA)', 'English and Literary Studies (B.A)', 'Secretarial and Office Management', '+234 905 910 0827', '06-13', '#3B82F6'),
  ('Mr. Abdulrahman Isa Mele', 'Programme Officer', 'Operations', 3, 'isameleabdulrahman@gmail.com', '', '', 'Criminology (B.Sc)', '', '', '', '#8B5CF6'),
  ('Mr. Muhammad Babangida Umar', 'Clinical informatics analyst', 'Business Development & Marketing', 4, 'babangidamuhdumar@gmail.com', '', 'Clinical', 'Human Anatomy (B.Sc)', 'Advertising and Documentation', '', '', '#14B8A6'),
  ('Mr. Emmanuel Chijoke', 'Lead Software Engineer & AI Architect', 'IT Department', 6, 'manuelemeka@gmail.com', '', 'Software Engineer, Machine Learning Engineer, AI Systems Architect', 'Computer Science (B.Sc)', 'Full-stack software engineering', '', '', '#EF4444'),
  ('Mr. Odiaga Raymond', 'Software Engineer', 'IT Department', 7, 'odiagaraymondray@gmail.com', '', '', 'BTech Physics (B.Sc)', 'Backend Development', '+234 907 795 1767', '10-01', '#F97316'),
  ('Mr. Alim Habib Dattijo', '3D Artist / motion graphics', 'IT Department', 2, 'alimhabibcgartist@gmail.com', '', '3D Artist', 'Industrial Design (B.Sc)', 'Graphics', '', '', '#06B6D4'),
  ('Miss Hadiza Muhammed', '', 'IT Department', 1, 'hadizaabubakar93@yahoo.com', '', 'Data analytics and Visualisation', 'Business Administration (B.Sc)', 'Data analyst', '+234 806 571 6810', '09-04', '#EC4899'),
  ('Mr. Aliyu Usman', 'Software Engineer', 'IT Department', 25, 'aliyu.usman@blumentechnologies.com', '', '', 'Computer Science (B.Sc)', '', '', '', '#7C3AED'),
  ('Mr. Abubakar Babayo Abdullahi', 'Software Engineer', 'IT Department', 10, 'babayoaudukhalifa@gmail.com', '', 'Software Engineering', 'Information Technology (B.Sc)', '', '+234 808 213 1111', '', '#F59E0B'),
  ('Mr. Kelechi Anyanwu', 'Data & Integration Lead', 'IT Department', 7, 'kayceeanyanwu@gmail.com', '', 'AWS Solutions Architect, Google Data Analytics, ITIL v4, Ethical Hacker', 'Mathematics & Computer Science', 'Data, Integration, Vending and Metering', '', '', '#64748B'),
  ('Miss Glory Peter Ayuba', 'Officer Manager', 'HR & Admin', 3, 'glorianapeter21@gmail.com', '', 'Project Manager', 'Social Work (B.A)', 'Office Management', '+234 906 873 6996', '05-21', '#3B82F6'),
  ('Mr. Abubakar Abdullahi Gwabare', 'POS Engineer', 'Blumen Pay', 7, 'gwabstech@gmail.com', '', 'Softeware Engineer| FINTECH', 'Computer Science (HND)', 'Payment System (POS & Switching)', '', '', '#8B5CF6'),
  ('Mr. Samson Olalere', 'Technical Assistant', 'Technical Services', 1, 'samsonolalere25@gmail.com', '', 'Project management', 'Microbiology (B.Sc)', 'Tech/Operations/Administration', '', '', '#14B8A6'),
  ('Mr. Abdulrasheed Taimiyu', 'Technical Assistant', 'Technical Services', 2, 'tiyamuabdulrasheed8080@gmail.com', '', 'NSE/ IAENG', 'Mechanical Engineering (B.Sc)', 'Technical Operations', '', '', '#EF4444'),
  ('Mr. Muhammad Abdullahi Walid', 'Admin officer I', 'HR & Admin', 5, 'muhammadabdullahiwalid@yahoo.com', '', 'Geounformation Society Of Nigeria', 'Remote Sensing and GIS (M.Sc)', 'Geopatial Analytics', '', '', '#F97316'),
  ('Mr. Abdulaziz Kabir', '', 'Business Development & Marketing', 7, 'milmildydx@gmail.com', '', 'Business Developer', '', 'Business Development', '', '', '#06B6D4'),
  ('Mr. Oluwagbminiyi Oreoluwa Oshoba', 'DevOps Engineer', 'IT Department', 10, 'gbeminiyi.oshoba@gmail.com', '', 'Advanced Diploma in Software Engineering', 'Computer Science (Systems Engineering)', 'Softeware Engineering & Developer Operations', '+234 906 344 5311', '11-07', '#EC4899'),
  ('Umar Liman', 'Office Keeper', 'HR & Admin', 0, null, '', '', '', '', '', '', '#7C3AED'),
  ('Miss Hassana Dahiru', 'Customer Care Service', '', 2, null, '', 'Frontend Website Design & Development', 'Public Administration (B.Sc)', 'Customer Care Service', '+234 806 155 2197', '01-08', '#F59E0B'),
  ('Mr. Yahaya Iliyasu', 'Driver', 'Operations', 0, null, '', '', '', '', '+234 813 342 6299 / +234 902 353 0088', '01-01', '#64748B')
on conflict (email) do update set
  full_name = excluded.full_name,
  job_title = excluded.job_title,
  department = excluded.department,
  years = excluded.years,
  professional = excluded.professional,
  education = excluded.education,
  specialization = excluded.specialization,
  phone = excluded.phone,
  birthday = excluded.birthday;

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
