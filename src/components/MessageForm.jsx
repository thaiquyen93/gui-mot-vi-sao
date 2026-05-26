export default function MessageForm({
  values,
  onChange,
  onSubmit,
  onClose,
  status,
  isSubmitting,
}) {
  const contentCount = values.content.length;
  const displayNameCount = values.displayName.length;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5">
        <div>
          <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-white/85">
            Tên của bạn
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            maxLength={40}
            value={values.displayName}
            onChange={onChange}
            placeholder="Tên của bạn (nếu muốn)"
            className="w-full rounded-2xl border border-white/10 bg-[#091024]/90 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue/25"
          />
          <p className="mt-2 text-xs text-white/45">{displayNameCount}/40 ký tự</p>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <label htmlFor="content" className="block text-sm font-medium text-white/85">
              Nội dung thông điệp
            </label>
            <p className={`text-xs ${contentCount > 270 ? 'text-cosmic-yellow' : 'text-white/45'}`}>
              {contentCount}/300 ký tự
            </p>
          </div>
          <textarea
            id="content"
            name="content"
            maxLength={300}
            value={values.content}
            onChange={onChange}
            rows={6}
            placeholder="Hãy gửi một lời nhắn tử tế vào vũ trụ..."
            className="mt-2 w-full rounded-3xl border border-white/10 bg-[#091024]/90 px-4 py-4 text-white outline-none transition placeholder:text-white/35 focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue/25"
            required
          />
        </div>
      </div>

      {status.message ? (
        <p className={`min-h-6 text-sm ${status.type === 'success' ? 'text-cosmic-yellow' : 'text-cosmic-pink'}`}>
          {status.message}
        </p>
      ) : (
        <p className="min-h-6 text-sm text-white/45">Lời nhắn của bạn sẽ được lưu như một vì sao mới trong thiên hà.</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Đóng
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-cosmic-blue px-6 py-3 text-sm font-semibold text-[#06111F] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi một vì sao'}
        </button>
      </div>
    </form>
  );
}
