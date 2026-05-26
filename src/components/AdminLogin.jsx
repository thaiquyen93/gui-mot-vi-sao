import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase chưa được cấu hình. Hãy thêm biến môi trường trước khi đăng nhập.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError('Không thể đăng nhập. Kiểm tra email, mật khẩu hoặc quyền admin của bạn.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cosmic-yellow/80">Admin login</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Đăng nhập quản trị</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Chỉ những tài khoản đã được thêm vào danh sách admin mới có thể mở dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-white/85">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#091024]/90 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue/25"
            placeholder="admin@domain.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-white/85">
            Mật khẩu
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#091024]/90 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue/25"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        {error ? <p className="text-sm text-cosmic-pink">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-cosmic-blue px-6 py-3 text-sm font-semibold text-[#06111F] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}
