# Gửi Một Vì Sao

React + Vite + Tailwind + Supabase cho website “Gửi Một Vì Sao”. Người dùng sẽ thấy một popup gửi lời nhắn ngay khi vào trang, còn các lời nhắn đã gửi sẽ bay trong một thiên hà 3D nhẹ và mượt.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Supabase Auth, Database, Storage
- Three.js via React Three Fiber
- Vercel

## Cài đặt cục bộ

1. Cài dependency:

```bash
npm install
npm install react-router-dom @react-three/fiber @react-three/drei three
```

2. Tạo file môi trường từ `.env.example` và điền giá trị Supabase:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Chạy local:

```bash
npm run dev
```

4. Build kiểm tra trước khi deploy:

```bash
npm run build
```

## Supabase Database

Chạy file [supabase-schema-v2.sql](supabase-schema-v2.sql) trước để tạo bảng công khai `messages` với 4 cột:

- `id`
- `display_name`
- `content`
- `created_at`

File này cho phép public đọc và public insert cho trang gửi lời nhắn.

## Admin Setup

Chạy tiếp file [supabase-admin-schema.sql](supabase-admin-schema.sql) để bật admin workflow an toàn hơn.

1. Tạo user admin trong Supabase Auth bằng email/password.
2. Lấy `id` của user trong Supabase Auth.
3. Chèn user đó vào bảng `admin_users`.

Ví dụ:

```sql
insert into public.admin_users (id, email)
values ('YOUR_AUTH_USER_UUID', 'admin@example.com');
```

4. Đăng nhập ở route `/admin` bằng đúng tài khoản đó.

Ghi chú: frontend chỉ dùng public/anon key. Không có service role key trong React.

## Storage

Admin dashboard có phần upload ảnh tùy chọn.

1. Tạo bucket Supabase Storage tên `site-images`.
2. Đặt bucket ở chế độ public nếu muốn URL public hoạt động ngay.
3. Nếu chưa tạo bucket, phần upload sẽ chỉ hiện thông báo thân thiện và không làm hỏng app.

## Project Structure

```text
package.json
vite.config.js
tailwind.config.js
postcss.config.js
.env.example
README.md
supabase-schema-v2.sql
supabase-admin-schema.sql
vercel.json

src/
  components/
    Navbar.jsx
    HeroSection.jsx
    MessagePopup.jsx
    MessageForm.jsx
    MessageGalaxy.jsx
    GalaxyScene.jsx
    StarMessageModal.jsx
    BlogSection.jsx
    BlogModal.jsx
    Footer.jsx
    AdminLogin.jsx
    AdminDashboard.jsx
    AdminMessageTable.jsx
    AdminMessageForm.jsx
  pages/
    Home.jsx
    Admin.jsx
  lib/
    supabaseClient.js
  data/
    blogs.js
  App.jsx
  main.jsx
  index.css
```

## How It Works

- `/` opens the public site and immediately shows the message popup.
- Submitted messages are inserted into Supabase and reloaded into the 3D galaxy.
- Clicking a glowing message star opens a Vietnamese detail card.
- `/admin` shows a login form first, then the dashboard only for authenticated admin users.

Admin page is hidden from the public navbar. Access it manually at `/admin` or `/quan-tri`.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the environment variables:

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

4. Deploy.

The included [vercel.json](vercel.json) file rewrites SPA routes so `/admin` works on refresh.

## Notes

- Public-facing text is mostly Vietnamese.
- `topic` and `star_color` are no longer used by the app.
- Blog content is still static for this MVP and lives in [src/data/blogs.js](src/data/blogs.js).
