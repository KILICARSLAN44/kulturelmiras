alter table public.eserler
  add column if not exists is_approved boolean;

update public.eserler
set is_approved = true
where is_approved is null;

alter table public.eserler
  alter column is_approved set default false,
  alter column is_approved set not null;
