import { useEffect, useState } from 'react';
import MessageForm from './MessageForm';

const initialValues = {
  displayName: '',
  content: '',
};

export default function MessagePopup({ isOpen, onClose, onSubmitMessage, onSuccess }) {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValues(initialValues);
    setStatus({ type: '', message: '' });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose?.();
      }
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (status.message) {
      setStatus({ type: '', message: '' });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedContent = values.content.trim();
    if (!trimmedContent) {
      setStatus({ type: 'error', message: 'Bạn hãy nhập nội dung thông điệp trước khi gửi.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmitMessage({
        displayName: values.displayName.trim().slice(0, 40) || 'Ẩn danh',
        content: trimmedContent.slice(0, 300),
      });

      if (result?.success) {
        setStatus({ type: 'success', message: result.message || 'Vì sao của bạn đã được gửi vào vũ trụ.' });
        setValues(initialValues);
        onSuccess?.(result.message || 'Vì sao của bạn đã được gửi vào vũ trụ.');
        onClose?.();
        return;
      }

      setStatus({
        type: 'error',
        message: result?.message || 'Chúng tôi chưa gửi được vì sao này. Vui lòng thử lại sau ít phút.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      onClick={() => onClose?.()}
      role="presentation"
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-[#050816]/92 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-popup-title"
      >
        <div className="pointer-events-none absolute inset-0 opacity-75">
          <div className="absolute -right-12 top-6 h-40 w-40 rounded-full bg-cosmic-blue/10 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-cosmic-healing/10 blur-3xl" />
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cosmic-yellow/80">Gửi một vì sao</p>
            <h3 id="message-popup-title" className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Gửi một lời nhắn tử tế vào vũ trụ.
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">
              Một câu nói dịu dàng có thể đi rất xa. Hãy để nó trở thành một vì sao mới.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Đóng
          </button>
        </div>

        <div className="relative mt-6 rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-6">
          <MessageForm
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={onClose}
            status={status}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
