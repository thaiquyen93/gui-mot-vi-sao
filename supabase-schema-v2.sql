create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  display_name text not null default 'Ẩn danh',
  content text not null,
  created_at timestamp with time zone default now()
);

alter table messages enable row level security;

drop policy if exists "Allow public read messages" on messages;
drop policy if exists "Allow public insert messages" on messages;

create policy "Allow public read messages"
on messages for select
to anon
using (true);

create policy "Allow public insert messages"
on messages for insert
to anon
with check (true);
