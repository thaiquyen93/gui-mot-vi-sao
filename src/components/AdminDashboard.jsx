import { useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import AdminMessageForm from './AdminMessageForm';
import AdminMessageTable from './AdminMessageTable';

function formatMessage(record) {
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

export default function AdminDashboard({ session, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const isReady = useMemo(() => isSupabaseConfigured && Boolean(supabase), []);

  useEffect(() => {
    let active = true;

    async function loadMessages() {
      if (!isReady) {
        setError('Supabase chưa được cấu hình.');
        setLoading(false);
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
        setError('Không thể tải danh sách thông điệp. Hãy kiểm tra policy hoặc kết nối Supabase.');
        setMessages([]);
        setLoading(false);
        return;
      }

      setMessages((data || []).map(formatMessage));
      setLoading(false);
    }

    loadMessages();

    return () => {
      active = false;
    };
  }, [isReady]);

  async function refreshMessages() {
    const { data, error: fetchError } = await supabase
      .from('messages')
      .select('id, display_name, content, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('Không thể làm mới dữ liệu.');
      return;
    }

    setMessages((data || []).map(formatMessage));
  }

  async function handleSaveMessage(payload) {
    if (!isReady) {
      setError('Supabase chưa được cấu hình.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (selectedMessage) {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ display_name: payload.displayName, content: payload.content })
          .eq('id', selectedMessage.id);

        if (updateError) {
          setError('Không thể cập nhật thông điệp.');
          return;
        }
      } else {
        const { error: insertError } = await supabase.from('messages').insert([
          {
            display_name: payload.displayName,
            content: payload.content,
          },
        ]);

        if (insertError) {
          setError('Không thể tạo thông điệp mới.');
          return;
        }
      }

      setFormOpen(false);
      setSelectedMessage(null);
      await refreshMessages();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) {
      return;
    }

    setDeletingId(deleteTarget.id);
    const { error: deleteError } = await supabase.from('messages').delete().eq('id', deleteTarget.id);
    if (deleteError) {
      setError('Không thể xóa thông điệp này.');
      setDeletingId('');
      setDeleteTarget(null);
      return;
    }

    setDeletingId('');
    setDeleteTarget(null);
    await refreshMessages();
  }

  async function handleUploadImage() {
    if (!uploadFile) {
      setUploadStatus({ type: 'error', message: 'Hãy chọn một file ảnh trước.' });
      return;
    }

    if (!isReady) {
      setUploadStatus({ type: 'error', message: 'Supabase chưa được cấu hình.' });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: '', message: '' });

    try {
      const extension = uploadFile.name.split('.').pop() || 'png';
      const safeFileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
      const filePath = `admin/${safeFileName}`;

      const { error: uploadError } = await supabase.storage.from('site-images').upload(filePath, uploadFile, {
        upsert: true,
      });

      if (uploadError) {
        setUploadStatus({
          type: 'error',
          message: 'Chưa upload được ảnh. Hãy chắc chắn bucket site-images đã tồn tại và public.',
        });
        return;
      }

      const { data } = supabase.storage.from('site-images').getPublicUrl(filePath);
      setUploadedUrl(data?.publicUrl || '');
      setUploadStatus({ type: 'success', message: 'Ảnh đã được tải lên thành công.' });
      setUploadFile(null);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cosmic-yellow/80">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Quản trị Gửi Một Vì Sao</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
              Xin chào {session?.user?.email || 'admin'}. Bạn có thể tạo, sửa, xóa thông điệp và tải ảnh lên Supabase Storage.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setSelectedMessage(null);
                setFormOpen(true);
              }}
              className="rounded-full bg-cosmic-blue px-5 py-3 text-sm font-semibold text-[#06111F] transition hover:brightness-110"
            >
              Tạo thông điệp mới
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <AdminMessageTable
          messages={messages}
          onEdit={(message) => {
            setSelectedMessage(message);
            setFormOpen(true);
          }}
          onDelete={(message) => setDeleteTarget(message)}
          loading={loading}
          error={error}
          deletingId={deletingId}
        />

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-cosmic-blue/80">Image upload</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Tải ảnh lên tùy chọn</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Nếu bucket <span className="text-white">site-images</span> đã được tạo trong Supabase Storage, bạn có thể tải ảnh lên ở đây.
            </p>

            <div className="mt-5 space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setUploadFile(event.target.files?.[0] || null)}
                className="block w-full text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white file:transition hover:file:bg-white/15"
              />
              <button
                type="button"
                onClick={handleUploadImage}
                disabled={isUploading}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? 'Đang tải...' : 'Tải ảnh lên'}
              </button>
              {uploadStatus.message ? (
                <p className={`text-sm ${uploadStatus.type === 'success' ? 'text-cosmic-yellow' : 'text-cosmic-pink'}`}>
                  {uploadStatus.message}
                </p>
              ) : null}
              {uploadedUrl ? (
                <div className="rounded-2xl border border-white/10 bg-[#091024]/70 p-4 text-sm text-white/75">
                  <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/45">Public URL</p>
                  <p className="break-all">{uploadedUrl}</p>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-cosmic-pink/80">Blog</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Blog vẫn là dữ liệu tĩnh trong MVP này</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Nếu cần quản lý blog bằng admin, có thể nối thêm một bảng riêng sau. Hiện tại blog đang được giữ trong src/data/blogs.js.
            </p>
          </section>
        </aside>
      </div>

      <AdminMessageForm
        isOpen={formOpen}
        message={selectedMessage}
        onClose={() => {
          setFormOpen(false);
          setSelectedMessage(null);
        }}
        onSave={handleSaveMessage}
        saving={saving}
      />

      {deleteTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#081020]/96 p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
          >
            <h3 id="delete-confirm-title" className="text-2xl font-semibold">
              Xóa thông điệp?
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Hành động này sẽ xóa vĩnh viễn thông điệp của {deleteTarget.display_name || 'Ẩn danh'}.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="rounded-full border border-cosmic-pink/30 bg-cosmic-pink/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cosmic-pink/20"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
