import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import MessagePopup from '../components/MessagePopup';
import MessageGalaxy from '../components/MessageGalaxy';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messagePopupOpen, setMessagePopupOpen] = useState(true);
  const [messageRefreshToken, setMessageRefreshToken] = useState(0);
  const [toast, setToast] = useState({ type: '', message: '' });

  const supabaseWarning = useMemo(() => {
    if (isSupabaseConfigured && supabase) {
      return '';
    }

    return 'Supabase chưa được cấu hình. Hãy thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào file .env của bạn.';
  }, []);

  async function handleSubmitMessage(payload) {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        message: 'Supabase chưa sẵn sàng. Vui lòng kiểm tra biến môi trường rồi thử lại.',
      };
    }

    const { error } = await supabase.from('messages').insert([
      {
        display_name: payload.displayName,
        content: payload.content,
      },
    ]);

    if (error) {
      return {
        success: false,
        message: 'Chúng tôi chưa gửi được vì sao này. Vui lòng thử lại sau ít phút.',
      };
    }

    return {
      success: true,
      message: 'Vì sao của bạn đã được gửi vào vũ trụ.',
    };
  }

  function handleMessageSuccess(message) {
    setMessageRefreshToken((current) => current + 1);
    setMessagePopupOpen(false);
    setToast({ type: 'success', message: message || 'Vì sao của bạn đã được gửi vào vũ trụ.' });
  }

  useEffect(() => {
    if (!toast.message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast({ type: '', message: '' }), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toast.message]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <div className="app-shell text-cosmic-text">
      <div className="relative z-10">
        {supabaseWarning ? (
          <div className="border-b border-cosmic-yellow/20 bg-cosmic-yellow/10 px-4 py-3 text-sm text-white sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl items-start gap-3">
              <span className="mt-0.5 text-cosmic-yellow">✦</span>
              <p>{supabaseWarning}</p>
            </div>
          </div>
        ) : null}

        <Navbar
          mobileMenuOpen={mobileMenuOpen}
          onToggleMenu={() => setMobileMenuOpen((current) => !current)}
          onNavigate={closeMobileMenu}
          onOpenMessagePopup={() => setMessagePopupOpen(true)}
        />

        <main id="content" className="relative">
          <HeroSection onOpenMessagePopup={() => setMessagePopupOpen(true)} />
          <MessageGalaxy refreshToken={messageRefreshToken} />
          <BlogSection />
        </main>

        <Footer />
      </div>

      <MessagePopup
        isOpen={messagePopupOpen}
        onClose={() => setMessagePopupOpen(false)}
        onSubmitMessage={handleSubmitMessage}
        onSuccess={handleMessageSuccess}
      />

      {toast.message ? (
        <div className="pointer-events-none fixed left-1/2 top-6 z-[60] w-[min(92vw,40rem)] -translate-x-1/2 rounded-full border border-white/10 bg-[#081020]/96 px-5 py-3 text-center text-sm text-white shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
