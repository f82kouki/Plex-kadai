// src/app/job-posts/page.tsx
'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function JobPostsPage() {
  type JobPost = { id: number; title: string; company?: { email?: string } };
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number|null>(null);

  const { data } = useQuery<JobPost[]>({
    queryKey: ['job-posts'],
    queryFn: async () => (await api.get('/api/job_posts')).data as JobPost[],
  });

  const { mutate: destroy } = useMutation<void, { response?: { status?: number } }, number>({
    mutationFn: async (id: number) => {
      await api.delete(`/api/job_posts/${id}`);
    },
    onSuccess: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ['job-posts'] });
    },
    onError: (err) => {
      setDeletingId(null);
      const status = err?.response?.status;
      if (status === 401) {
        alert('ログインが必要です。');
        if (typeof window !== 'undefined') window.location.href = '/login';
        return;
      }
      alert(`削除に失敗しました${status ? ` (HTTP ${status})` : ''}`);
    },
  });

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">募集一覧</h1>
        <Link href="/job-posts/new" className="underline">新規作成</Link>
      </div>

      <ul className="space-y-2">
        {data?.map((p) => (
          <li key={p.id} className="p-3 border rounded bg-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-600">{p.company?.email}</div>
              </div>
              <button
                onClick={() => {
                  if (confirm('この募集を削除しますか？')) { setDeletingId(p.id); destroy(p.id); }
                }}
                className="px-3 py-1 text-sm rounded border border-red-600 text-red-600 hover:bg-red-50"
                disabled={deletingId === p.id}
                aria-label={`Delete job post ${p.title}`}
              >
                {deletingId === p.id ? '削除中…' : '削除'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {/* ← スペースを入れる！ */}
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
        >
          ホームに戻る
        </Link>
      </div>
    </main>
  );
}
