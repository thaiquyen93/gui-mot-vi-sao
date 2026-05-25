# Gửi Một Vì Sao

A lightweight one-page React + Vite website for a student empathy and motivation project. Students can send encouraging messages as stars in a cosmic galaxy, and readers can explore hardcoded inspiration blog stories.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Supabase
- Vercel

## Project Structure

```text
package.json
vite.config.js
tailwind.config.js
postcss.config.js
.env.example
README.md
supabase-schema.sql

src/
  components/
    Navbar.jsx
    HeroSection.jsx
    MessageForm.jsx
    MessageGalaxy.jsx
    MessageCard.jsx
    BlogSection.jsx
    BlogModal.jsx
    Footer.jsx
  lib/
    supabaseClient.js
  data/
    blogs.js
  App.jsx
  main.jsx
  index.css
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file from `.env.example` and add your Supabase values:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the dev server:

```bash
npm run dev
```

## Supabase Setup

1. Create a new Supabase project.
2. Open the Supabase SQL Editor.
3. Run the `supabase-schema.sql` file from this project.
4. Copy your Supabase Project URL and anon public key.
5. Add them to your `.env` file.

If the environment variables are missing, the site shows a clear setup warning instead of crashing.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the GitHub repository into Vercel.
3. Add these environment variables in Vercel:

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

4. Deploy the app.

## Supabase Table

The app expects a `messages` table with this schema:

```sql
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
```
