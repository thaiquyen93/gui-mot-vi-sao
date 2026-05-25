import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import MessageCard from './MessageCard';

function normalizeMessage(record) {
  const createdAt = record.created_at || new Date().toISOString();
  return {
    id: record.id,
    display_name: record.display_name || 'Ẩn danh',
    content: record.content || '',
    topic: record.topic || 'Motivation',
    star_color: record.star_color || 'Hope Blue',
    created_at: createdAt,
    formattedDate: new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(createdAt)),
  };
}

export default function MessageGalaxy({ refreshToken }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadMessages() {
      if (!isSupabaseConfigured || !supabase) {
        if (!active) {
          return;
        }
        setMessages([]);
        setLoading(false);
        setError('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to continue.');
        return;
      }

      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('id, display_name, content, topic, star_color, created_at')
        .order('created_at', { ascending: false });

      if (!active) {
        return;
      }

      if (fetchError) {
        setMessages([]);
        setError('We could not load the galaxy right now. Please try again in a moment.');
        setLoading(false);
        return;
      }

      setMessages((data || []).map(normalizeMessage));
      setLoading(false);
    }

    loadMessages();

    return () => {
      active = false;
    };
  }, [refreshToken]);

  const emptyState = useMemo(
    () => 'No stars have been lit yet. Be the first to send a kind message.',
    [],
  );

  return (
    <section id="galaxy" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cosmic-yellow/80">Message galaxy</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Stars shared by students</h2>
          <p className="mt-4 text-base leading-7 text-white/70">
            Each message becomes a glowing point of care, floating gently across the galaxy.
          </p>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6 lg:p-8">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/5"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-cosmic-pink/30 bg-cosmic-pink/10 p-5 text-sm text-white/85">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#0B1024]/70 p-6 text-sm text-white/70">
              {emptyState}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {messages.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
