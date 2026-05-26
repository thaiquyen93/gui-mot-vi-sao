import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessError, setAccessError] = useState('');
  const [logoutError, setLogoutError] = useState('');

  const configWarning = useMemo(() => {
    if (isSupabaseConfigured && supabase) {
      return '';
    }

    return 'Supabase chưa được cấu hình. Hãy thêm biến môi trường trước khi mở trang admin.';
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setCheckingSession(false);
      return undefined;
    }

    let active = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!active) {
        return;
      }
      setSession(data.session);
      setCheckingSession(false);
    }

    loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsAdmin(false);
      setAccessError('');
      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function checkAdminAccess() {
      if (!session) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase.rpc('is_admin_user');
      if (!active) {
        return;
      }

      if (error) {
        setAccessError('Không thể xác thực quyền admin. Hãy chạy file SQL admin setup trước.');
        setIsAdmin(false);
        return;
      }

      setIsAdmin(Boolean(data));
      setAccessError(Boolean(data) ? '' : 'Tài khoản này chưa được thêm vào admin_users.');
    }

    checkAdminAccess();

    return () => {
      active = false;
    };
  }, [session]);

  async function handleLogout() {
    setLogoutError('');
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLogoutError('Không thể đăng xuất ngay lúc này.');
    }
  }

  return (
    <div className="app-shell text-cosmic-text">
      <div className="relative z-10 min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 pb-6">
          <Link to="/" className="text-sm font-semibold tracking-wide text-white transition hover:text-cosmic-blue">
            ← Về trang chủ
          </Link>
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">/admin</p>
        </div>

        {configWarning ? (
          <div className="mx-auto mb-6 w-full max-w-7xl rounded-2xl border border-cosmic-yellow/20 bg-cosmic-yellow/10 px-4 py-3 text-sm text-white">
            {configWarning}
          </div>
        ) : null}

        {checkingSession ? (
          <div className="mx-auto flex w-full max-w-7xl items-center justify-center rounded-[32px] border border-white/10 bg-white/5 px-6 py-20 text-white/70 backdrop-blur-xl">
            Đang kiểm tra phiên đăng nhập...
          </div>
        ) : !session ? (
          <AdminLogin />
        ) : !isAdmin ? (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cosmic-pink/80">Access denied</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Tài khoản chưa có quyền admin</h1>
              <p className="mt-3 text-sm leading-7 text-white/70">{accessError || 'Hãy thêm user này vào bảng admin_users trong Supabase rồi đăng nhập lại.'}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-cosmic-blue px-5 py-3 text-sm font-semibold text-[#06111F] transition hover:brightness-110"
              >
                Đăng xuất
              </button>
              <Link
                to="/"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Về trang chủ
              </Link>
            </div>
            {logoutError ? <p className="text-sm text-cosmic-pink">{logoutError}</p> : null}
          </div>
        ) : (
          <>
            {logoutError ? (
              <div className="mx-auto mb-6 w-full max-w-7xl rounded-2xl border border-cosmic-pink/30 bg-cosmic-pink/10 px-4 py-3 text-sm text-white">
                {logoutError}
              </div>
            ) : null}
            <AdminDashboard session={session} onLogout={handleLogout} />
          </>
        )}
      </div>
    </div>
  );
}
