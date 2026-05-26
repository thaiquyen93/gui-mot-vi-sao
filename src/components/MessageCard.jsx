const colorStyles = {
  'Hope Blue': 'shadow-glowBlue border-cosmic-blue/25',
  'Warm Yellow': 'shadow-glowYellow border-cosmic-yellow/25',
  'Healing Purple': 'shadow-glowPurple border-cosmic-healing/25',
  'Loving Pink': 'shadow-glowPink border-cosmic-pink/25',
};

const colorDotStyles = {
  'Hope Blue': 'bg-cosmic-blue',
  'Warm Yellow': 'bg-cosmic-yellow',
  'Healing Purple': 'bg-cosmic-healing',
  'Loving Pink': 'bg-cosmic-pink',
};

function StarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 2.5l2.88 5.84 6.45.94-4.67 4.55 1.1 6.43L12 17.25 6.24 20.26l1.1-6.43L2.67 9.28l6.45-.94L12 2.5z" />
    </svg>
  );
}

export default function MessageCard({ message }) {
  const colorClass = colorStyles[message.star_color] || colorStyles['Hope Blue'];
  const dotClass = colorDotStyles[message.star_color] || colorDotStyles['Hope Blue'];

  return (
    <article
      className={`rounded-3xl border bg-white/5 p-4 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/[0.07] ${colorClass}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${dotClass} text-[#07111D] shadow-inner`}>
          <StarIcon />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="truncate text-sm font-semibold text-white">{message.display_name || 'Ẩn danh'}</h3>
            </div>
            <time className="shrink-0 text-xs text-white/35" dateTime={message.created_at}>
              {message.formattedDate}
            </time>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/80">{message.content}</p>
        </div>
      </div>
    </article>
  );
}
