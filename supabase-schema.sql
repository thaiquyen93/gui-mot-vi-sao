create table messages (
  id uuid primary key default gen_random_uuid(),
  display_name text not null default 'Ẩn danh',
  content text not null,
  topic text not null,
  star_color text not null,
  created_at timestamp with time zone default now()
);

alter table messages enable row level security;

create policy "Allow public read messages"
on messages for select
to anon
using (true);

create policy "Allow public insert messages"
on messages for insert
to anon
with check (true);
