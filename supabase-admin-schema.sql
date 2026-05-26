create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamp with time zone default now()
);

alter table admin_users enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  );
$$;

revoke all on function public.is_admin_user() from public;
grant execute on function public.is_admin_user() to authenticated;

drop policy if exists "Allow public read messages" on messages;
drop policy if exists "Allow public insert messages" on messages;
drop policy if exists "Allow admin update messages" on messages;
drop policy if exists "Allow admin delete messages" on messages;
drop policy if exists "Allow admin insert messages" on messages;
drop policy if exists "Allow authenticated read messages" on messages;

alter table messages enable row level security;

create policy "Allow public read messages"
on messages for select
to anon, authenticated
using (true);

create policy "Allow public insert messages"
on messages for insert
to anon
with check (true);

create policy "Allow admin insert messages"
on messages for insert
to authenticated
with check (public.is_admin_user());

create policy "Allow admin update messages"
on messages for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Allow admin delete messages"
on messages for delete
to authenticated
using (public.is_admin_user());
