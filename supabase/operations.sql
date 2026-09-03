-- Paste in Supabase SQL Editor and Run.
-- Adds custom occasion types (hospital visit, etc.) plus 2026 people mapping.
-- Does not wipe send history.

alter table app_settings add column if not exists custom_occasions jsonb default '[]'::jsonb;

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

update staff set job_title = 'Managing Director / CEO', department = 'Executive Office', staff_code = 'Director', specialization = 'Reports to Board / Shareholders' where lower(email) = 'ygarbawala@gmail.com';
update staff set job_title = 'CRO', department = 'Risk & Compliance', staff_code = 'Manager', specialization = 'Risk Management & Corporate Governance · Reports to MD / CEO' where lower(email) = 'abdullahikambaa@gmail.com';
update staff set job_title = 'CCSO', department = 'Corporate Services', staff_code = 'Manager' where lower(email) = 'hassanabdulwaheed4@gmail.com';
update staff set job_title = 'CAO', department = 'Administration', staff_code = 'Manager', specialization = 'Reports to MD / CEO' where lower(email) = 'drchikaire@gmail.com';
update staff set job_title = 'Head, PMO / Programme Coordination', department = 'BD & Project Delivery', staff_code = 'Deputy Manager' where lower(email) = 'naini5004@gmail.com';
update staff set job_title = 'Head of Procurement / logistics coordination', department = 'Logistics & Procurement', staff_code = 'Assistant Manager' where lower(email) = 'aq.qadeer198@gmail.com';
update staff set job_title = 'Reduce Project Lead', department = 'BD & Project Delivery', staff_code = 'BO' where lower(email) = 'isameleabdulrahman@gmail.com';
update staff set job_title = 'Product Lead', department = 'BD & Project Delivery', staff_code = 'BO' where lower(email) = 'milmildydx@gmail.com';
update staff set job_title = 'Executive Assistant / Secretary to MD', department = 'Executive Office', staff_code = 'ABO' where lower(email) = 'hannahbella.rh@gmail.com';
update staff set job_title = 'Basic integrations & service provision', department = 'Administration', staff_code = 'ABO' where lower(email) = 'muhammadabdullahiwalid@yahoo.com';
update staff set job_title = 'Market Development, Communications & Documentation', department = 'BD & Project Delivery', staff_code = 'ET' where lower(email) = 'babangidamuhdumar@gmail.com';
update staff set job_title = 'Client Manager', department = 'BD & Project Delivery', staff_code = 'ET' where lower(email) = 'glorianapeter21@gmail.com';
update staff set job_title = 'Project Manager / Data & BI Analyst', department = 'BD & Project Delivery', staff_code = 'ET' where lower(email) = 'hadizaabubakar93@yahoo.com';
update staff set job_title = 'Project Support Assistant — Radians', department = 'BD & Project Delivery', staff_code = 'ET' where lower(email) = 'samsonolalere25@gmail.com';
update staff set job_title = 'Technical Operations & Field Support', department = 'Logistics & Procurement', staff_code = 'ET' where lower(email) = 'tiyamuabdulrasheed8080@gmail.com';
update staff set job_title = 'Corporate Services Assistant', department = 'Corporate Services', staff_code = 'ET' where lower(full_name) like '%hassana%dahiru%';
update staff set job_title = 'CTPO / Lead Engineer & AI Architect', department = 'Technology & Product', staff_code = 'AGM' where lower(email) = 'manuelemeka@gmail.com';
update staff set job_title = 'System Engineer / Project Lead VAAS', department = 'Technology & Product', staff_code = 'Senior Manager' where lower(email) = 'kayceeanyanwu@gmail.com';
update staff set job_title = 'Full-Stack Engineer / Technology Project Manager', department = 'Technology & Product', staff_code = 'Developer 2' where lower(email) = 'dammykunle79@gmail.com';
update staff set job_title = 'Backend Engineer / PCB Project Lead', department = 'Technology & Product', staff_code = 'Full Developer' where lower(email) = 'odiagaraymondray@gmail.com';
update staff set job_title = 'Product Lead — TMS & POS', department = 'Technology & Product', staff_code = 'Full Developer' where lower(email) = 'gwabstech@gmail.com';
update staff set job_title = 'Senior Software Engineer / Technical Lead Baggage', department = 'Technology & Product', staff_code = 'Full Developer' where lower(email) = 'aliyu.usman@blumentechnologies.com';
update staff set job_title = 'Frontend Software Engineer', department = 'Technology & Product', staff_code = 'Full Developer' where lower(email) = 'muritalaibrahim097@gmail.com';
update staff set job_title = 'DevOps Engineer', department = 'Technology & Product', staff_code = 'Full Developer' where lower(email) = 'gbeminiyi.oshoba@gmail.com';
update staff set job_title = 'Product Designer / UI-UX Engineer', department = 'Technology & Product', staff_code = 'Full Developer' where lower(email) = 'shereefadamu001@gmail.com';
update staff set job_title = 'Frontend / Web Developer', department = 'Technology & Product', staff_code = 'Developer 1' where lower(email) = 'abduussalamzarruk@gmail.com';
update staff set job_title = 'Creative & Motion Graphics Specialist', department = 'BD & Project Delivery', staff_code = 'Developer 1' where lower(email) = 'alimhabibcgartist@gmail.com';
update staff set job_title = 'Frontend Engineer', department = 'Technology & Product', staff_code = 'Executive Trainee' where lower(email) = 'babayoaudukhalifa@gmail.com';
update staff set department = 'Administration' where lower(full_name) like '%umar liman%';

insert into staff (full_name, job_title, department, years, email, staff_code, specialization, color)
select 'Mr. Mohammed Abdulhamid Hassan', 'CBPO', 'BD & Project Delivery', 0, null, 'Senior Manager', 'Reports to MD / CEO', '#3B82F6'
where not exists (select 1 from staff where lower(full_name) like '%abdulhamid%hassan%');

insert into staff (full_name, job_title, department, years, email, staff_code, specialization, color)
select 'Mr. Faisal Barda', 'CFO', 'Finance & Accounts', 0, null, 'Manager', 'Reports to MD / CEO; Board oversight', '#8B5CF6'
where not exists (select 1 from staff where lower(full_name) like '%faisal%barda%' or lower(full_name) like '%fahad%barda%');

insert into staff (full_name, job_title, department, years, email, staff_code, specialization, birthday, color)
select 'Mr. Ali Balaya Audu', 'Project Management Officer — Ease', 'BD & Project Delivery', 0, 'babayoali@gmail.com', 'SBO', 'Reports to CBPO', '01-23', '#14B8A6'
where not exists (select 1 from staff where lower(full_name) like '%ali%balaya%' or lower(email) = 'babayoali@gmail.com');

update staff
set
  email = 'babayoali@gmail.com',
  birthday = '01-23',
  job_title = coalesce(nullif(job_title, ''), 'Project Management Officer — Ease'),
  department = coalesce(nullif(department, ''), 'BD & Project Delivery'),
  staff_code = coalesce(nullif(staff_code, ''), 'SBO')
where lower(full_name) like '%ali%balaya%'
   or lower(full_name) like '%ali%babayo%'
   or lower(email) = 'babayoali@gmail.com';

insert into staff (full_name, job_title, department, years, email, staff_code, specialization, color)
select 'Ms. Favor Patience Solomon', 'Legal Counsel (external)', 'Legal & Company Secretariat', 0, null, 'BO', 'Reports to MD / CEO; CBPO coordination', '#EF4444'
where not exists (select 1 from staff where lower(full_name) like '%favor%solomon%' or lower(full_name) like '%patience%solomon%');

insert into staff (full_name, job_title, department, years, email, staff_code, specialization, color)
select 'Mr. Aliyu Hassan (Haldar)', 'Embedded Systems Engineer / Hardware Project Lead', 'Technology & Product', 0, null, 'Developer 2', 'Reports to CTPO', '#F97316'
where not exists (select 1 from staff where lower(full_name) like '%aliyu%hassan%' or lower(full_name) like '%haldar%');
