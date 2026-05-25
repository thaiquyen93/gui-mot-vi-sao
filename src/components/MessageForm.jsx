import { useMemo, useState } from 'react';

const defaultForm = {
  displayName: '',
  content: '',
  topic: 'Study pressure',
  starColor: 'Hope Blue',
};

const topicOptions = [
  'Study pressure',
  'Loneliness',
  'Family',
  'Friendship',
  'Future',
  'Healing',
  'Motivation',
];

const starColorOptions = ['Hope Blue', 'Warm Yellow', 'Healing Purple', 'Loving Pink'];

export default function MessageForm({ onSubmitMessage, isSubmitting, isSupabaseReady }) {
  const [form, setForm] = useState(defaultForm);
  const [status, setStatus] = useState({ type: '', message: '' });

  const contentCount = form.content.length;
  const displayNameCount = form.displayName.length;

  const remainingCharacters = useMemo(() => 300 - contentCount, [contentCount]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status.message) {
      setStatus({ type: '', message: '' });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const message = form.content.trim();
    if (!message) {
      setStatus({ type: 'error', message: 'Please write a message before sending your star.' });
      return;
    }

    if (!isSupabaseReady) {
      setStatus({
        type: 'error',
        message: 'Supabase is not configured yet. Add your environment variables to continue.',
      });
      return;
    }

    const safePayload = {
      displayName: form.displayName.trim().slice(0, 40) || 'Ẩn danh',
      content: message.slice(0, 300),
      topic: topicOptions.includes(form.topic) ? form.topic : topicOptions[0],
      starColor: starColorOptions.includes(form.starColor) ? form.starColor : starColorOptions[0],
    };

    const result = await onSubmitMessage(safePayload);
    if (result.success) {
      setForm(defaultForm);
      setStatus({ type: 'success', message: 'Your star has been sent into the universe.' });
    } else {
      setStatus({
        type: 'error',
        message: result.message || 'Something went wrong while sending your star. Please try again.',
      });
    }
  }

  return (
    <section id="send-message" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cosmic-blue/80">Send a message</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Share a thought and let it become a star.
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70">
            Write gently, breathe slowly, and let your message travel through the galaxy.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6 lg:p-8"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-white/85">
                Display name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                maxLength={40}
                value={form.displayName}
                onChange={handleChange}
                placeholder="Optional - defaults to Ẩn danh"
                className="w-full rounded-2xl border border-white/10 bg-[#0B1024]/90 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue/25"
              />
              <p className="mt-2 text-xs text-white/45">{displayNameCount}/40 characters</p>
            </div>

            <div>
              <label htmlFor="topic" className="mb-2 block text-sm font-medium text-white/85">
                Emotional topic
              </label>
              <select
                id="topic"
                name="topic"
                value={form.topic}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-[#0B1024]/90 px-4 py-3 text-white outline-none transition focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue/25"
              >
                {topicOptions.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="starColor" className="mb-2 block text-sm font-medium text-white/85">
                Star color
              </label>
              <select
                id="starColor"
                name="starColor"
                value={form.starColor}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-[#0B1024]/90 px-4 py-3 text-white outline-none transition focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue/25"
              >
                {starColorOptions.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-end justify-between gap-4">
                <label htmlFor="content" className="block text-sm font-medium text-white/85">
                  Message content
                </label>
                <p className={`text-xs ${remainingCharacters < 30 ? 'text-cosmic-yellow' : 'text-white/45'}`}>
                  {contentCount}/300 characters
                </p>
              </div>
              <textarea
                id="content"
                name="content"
                maxLength={300}
                value={form.content}
                onChange={handleChange}
                rows={6}
                placeholder="Share encouragement, a feeling, or a quote that helped you."
                className="mt-2 w-full rounded-3xl border border-white/10 bg-[#0B1024]/90 px-4 py-4 text-white outline-none transition placeholder:text-white/35 focus:border-cosmic-blue focus:ring-2 focus:ring-cosmic-blue/25"
                required
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-6 text-sm">
              {status.message ? (
                <p className={status.type === 'success' ? 'text-cosmic-yellow' : 'text-cosmic-pink'}>{status.message}</p>
              ) : (
                <p className="text-white/45">
                  Messages are stored as plain text only and will appear in the galaxy below.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !isSupabaseReady}
              className="inline-flex items-center justify-center rounded-full bg-cosmic-blue px-6 py-3 text-sm font-semibold text-[#06111F] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Send your star'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
