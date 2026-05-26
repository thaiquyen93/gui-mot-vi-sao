import { useEffect } from 'react';

export default function BlogModal({ blog, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!blog) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#02050f]/75 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#0B1024] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-7"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-modal-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cosmic-yellow/80">Câu chuyện blog</p>
            <h3 id="blog-modal-title" className="mt-2 text-2xl font-semibold text-white">
              {blog.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Đóng
          </button>
        </div>

        <p className="mt-4 text-sm text-white/55">{blog.author}</p>
        <p className="mt-6 whitespace-pre-wrap text-base leading-8 text-white/80">{blog.content}</p>
      </div>
    </div>
  );
}
