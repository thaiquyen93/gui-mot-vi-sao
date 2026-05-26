import { useEffect, useState } from 'react';

const initialForm = {
  displayName: '',
  content: '',
};

export default function AdminMessageForm({ isOpen, message, onClose, onSave, saving }) {
  const [values, setValues] = useState(initialForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValues({
      displayName: message?.display_name || '',
      content: message?.content || '',
    });
    setError('');
  }, [isOpen, message]);

  async function handleSubmit(event) {
    event.preventDefault();

    const content = values.content.trim();
    if (!content) {
      setError('Nội dung không được để trống.');
      return;
    }

    await onSave({
      displayName: values.displayName.trim().slice(0, 40) || 'Ẩn danh',
      content: content.slice(0, 300),
    });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#081020]/96 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-7"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-message-form-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cosmic-yellow/80">
              {message ? 'Chỉnh sửa thông điệp' : 'Tạo thông điệp mới'}
            </p>
            <h3 id="admin-message-form-title" className="mt-2 text-2xl font-semibold text-white">
              {message ? 'Cập nhật thông điệp' : 'Viết một thông điệp mới'}
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="admin-display-name" className="mb-2 block text-sm font-medium text-white/85">
              Tên hiển thị
            </label>
            <input
              id="admin-display-name"
              type="text"
              maxLength={40}
              value={values.displayName}
              onChange={(event) => setValues((current) => ({ ...current, displayName: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-[#091024]/90 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue/25"
              placeholder="Ẩn danh"
            />
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <label htmlFor="admin-content" className="block text-sm font-medium text-white/85">
                Nội dung
              </label>
              <span className="text-xs text-white/45">{values.content.length}/300 ký tự</span>
            </div>
            <textarea
              id="admin-content"
              rows={7}
              maxLength={300}
              value={values.content}
              onChange={(event) => setValues((current) => ({ ...current, content: event.target.value }))}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-[#091024]/90 px-4 py-4 text-white outline-none transition placeholder:text-white/35 focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue/25"
              placeholder="Nội dung thông điệp..."
            />
          </div>

          {error ? <p className="text-sm text-cosmic-pink">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-cosmic-yellow px-6 py-3 text-sm font-semibold text-[#191720] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Đang lưu...' : 'Lưu thông điệp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
