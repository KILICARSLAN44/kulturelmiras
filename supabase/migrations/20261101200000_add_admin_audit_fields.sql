alter table public.eserler
  add column if not exists approved_by text,
  add column if not exists last_edited_by text;
