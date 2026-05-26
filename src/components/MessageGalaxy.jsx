import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import GalaxyScene from './GalaxyScene';
import StarMessageModal from './StarMessageModal';

function normalizeMessage(record) {
  const createdAt = record.created_at || new Date().toISOString();
  return {
    id: record.id,
    display_name: record.display_name || 'Ẩn danh',
    content: record.content || '',
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
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadMessages() {
      if (!isSupabaseConfigured || !supabase) {
        if (!active) {
          return;
        }
        setMessages([]);
        setLoading(false);
        setError('Supabase chưa được cấu hình. Hãy thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY để tiếp tục.');
        return;
      }

      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('id, display_name, content, created_at')
        .order('created_at', { ascending: false });

      if (!active) {
        return;
      }

      if (fetchError) {
        setMessages([]);
        setError('Không thể tải thiên hà ngay lúc này. Vui lòng thử lại sau ít phút.');
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
    () => 'Chưa có vì sao nào được gửi. Bạn có thể mở popup để thắp sáng vì sao đầu tiên.',
    [],
  );

  return (
    <section id="galaxy" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cosmic-yellow/80">Thiên hà thông điệp</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Những vì sao đang đi quanh quỹ đạo</h2>
          <p className="mt-4 text-base leading-7 text-white/70">
            Mỗi lời nhắn sẽ hóa thành một vì sao phát sáng và trôi chậm trong thiên hà.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl sm:p-4 lg:p-5">
          {error ? (
            <div className="rounded-3xl border border-cosmic-pink/30 bg-cosmic-pink/10 p-5 text-sm text-white/85">
              {error}
            </div>
          ) : (
            <div className="relative h-[560px] min-h-[520px] w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#03050D] sm:h-[620px] lg:h-[700px]">
              <GalaxyScene messages={loading ? [] : messages} onSelectMessage={setSelectedMessage} />
              <div className="pointer-events-none absolute left-4 top-4 max-w-xs rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-white/75 backdrop-blur-md">
                {loading ? 'Đang kết nối với bầu trời...' : messages.length > 0 ? `${messages.length} vì sao đang bay trong thiên hà.` : emptyState}
              </div>
            </div>
          )}
        </div>
      </div>

      <StarMessageModal message={selectedMessage} onClose={() => setSelectedMessage(null)} />
    </section>
  );
}
