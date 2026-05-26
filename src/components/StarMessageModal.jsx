import { useEffect } from 'react';

export default function StarMessageModal({ message, onClose }) {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose?.();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 px-4 py-4 backdrop-blur-[2px] sm:items-center sm:justify-end sm:px-6 sm:py-6"
      onClick={() => onClose?.()}
      role="presentation"
    >
      <article
        className="relative w-full max-w-lg rounded-[28px] border border-white/10 bg-[#081020]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="star-message-title"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top_right,rgba(76,201,240,0.15),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,209,102,0.12),transparent_26%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cosmic-yellow/80">Thông điệp từ một vì sao</p>
            <h3 id="star-message-title" className="mt-2 text-2xl font-semibold text-white">
              {message.display_name || 'Ẩn danh'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Đóng
          </button>
        </div>

        <dl className="relative mt-5 space-y-4 text-sm leading-7 text-white/80">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-[0.24em] text-white/45">Người gửi</dt>
            <dd className="mt-2 text-base text-white">{message.display_name || 'Ẩn danh'}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-[0.24em] text-white/45">Thông điệp</dt>
            <dd className="mt-2 whitespace-pre-wrap text-base leading-8 text-white/90">{message.content}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-[0.24em] text-white/45">Thời gian gửi</dt>
            <dd className="mt-2 text-base text-white">
              {message.formattedDate ||
                new Intl.DateTimeFormat('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(message.created_at))}
            </dd>
          </div>
        </dl>
      </article>
    </div>
  );
}
