import { useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from './lib/supabaseClient';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MessageForm from './components/MessageForm';
import MessageGalaxy from './components/MessageGalaxy';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messageRefreshToken, setMessageRefreshToken] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabaseWarning = useMemo(() => {
    if (isSupabaseConfigured && supabase) {
      return '';
    }

    return 'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.';
  }, []);

  async function handleSubmitMessage(payload) {
    setIsSubmitting(true);

    try {
      if (!isSupabaseConfigured || !supabase) {
        return { success: false, message: 'Supabase is not configured yet. Add your environment variables to continue.' };
      }

      const { error } = await supabase.from('messages').insert([
        {
          display_name: payload.displayName,
          content: payload.content,
          topic: payload.topic,
          star_color: payload.starColor,
        },
      ]);

      if (error) {
        return { success: false, message: 'We could not send your star. Please check Supabase and try again.' };
      }

      setMessageRefreshToken((current) => current + 1);
      return { success: true };
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-cosmic-bg text-cosmic-text">
      <div className="pointer-events-none absolute inset-0 bg-cosmic-radial" />
      <div className="starfield pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,10,26,0.25)_55%,rgba(7,10,26,0.72)_100%)]" />

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
        />

        <main id="content">
          <HeroSection />
          <MessageForm
            onSubmitMessage={handleSubmitMessage}
            isSubmitting={isSubmitting}
            isSupabaseReady={isSupabaseConfigured && Boolean(supabase)}
          />
          <MessageGalaxy refreshToken={messageRefreshToken} />
          <BlogSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}
