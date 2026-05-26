export default function AdminMessageTable({ messages, onEdit, onDelete, loading, error, deletingId }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cosmic-blue/80">Messages</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Danh sách thông điệp</h2>
        </div>
        <p className="text-sm text-white/55">Tổng cộng: {messages.length}</p>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-cosmic-pink/30 bg-cosmic-pink/10 p-4 text-sm text-white/85">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#091024]/70 p-5 text-sm text-white/70">
          Chưa có thông điệp nào.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
          <div className="hidden grid-cols-[1.1fr_2fr_1fr_auto] gap-4 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.22em] text-white/45 md:grid">
            <span>Người gửi</span>
            <span>Thông điệp</span>
            <span>Thời gian</span>
            <span>Hành động</span>
          </div>

          <div className="divide-y divide-white/10">
            {messages.map((message) => (
              <div key={message.id} className="grid gap-4 px-4 py-4 md:grid-cols-[1.1fr_2fr_1fr_auto] md:items-center">
                <div>
                  <p className="font-medium text-white">{message.display_name || 'Ẩn danh'}</p>
                  <p className="mt-1 text-xs text-white/45">ID: {message.id.slice(0, 8)}</p>
                </div>
                <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-7 text-white/75">{message.content}</p>
                <time className="text-sm text-white/55" dateTime={message.created_at}>
                  {message.formattedDate}
                </time>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(message)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(message)}
                    disabled={deletingId === message.id}
                    className="rounded-full border border-cosmic-pink/30 bg-cosmic-pink/10 px-4 py-2 text-sm text-white transition hover:bg-cosmic-pink/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === message.id ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
