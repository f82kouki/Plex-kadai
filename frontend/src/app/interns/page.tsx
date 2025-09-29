'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';   // ← 追加

export default function Interns() {
  type Intern = { id: number; email: string; profile?: { name?: string; school?: string; skills?: string[] } };
  const queryClient = useQueryClient();

  const { data } = useQuery<Intern[]>({
    queryKey: ['interns'],
    queryFn: async () => (await api.get('/api/interns')).data as Intern[],
  });

  const [deletingId, setDeletingId] = useState<number|null>(null);
  const { mutate: destroy } = useMutation<void, { response?: { status?: number } }, number>({
    mutationFn: async (id: number) => {
      await api.delete(`/api/interns/${id}`);
    },
    onSuccess: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ['interns'] });
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
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">インターン一覧</h1>
      <ul className="grid gap-3">
        {data?.map((u) => (
          <li key={u.id} className="p-4 bg-white rounded border">
            <div className="flex items-start justify-between gap-3">
              <div>
                <a className="font-semibold underline" href={`/interns/${u.id}`}>
                  {u.profile?.name ?? u.email}
                </a>
                <p className="text-sm text-gray-600">
                  {u.profile?.school} / {u.profile?.skills?.join(', ')}
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('このインターン生登録を削除しますか？')) { setDeletingId(u.id); destroy(u.id); }
                }}
                className="px-3 py-1 text-sm rounded border border-red-600 text-red-600 hover:bg-red-50"
                disabled={deletingId === u.id}
                aria-label={`Delete intern ${u.profile?.name ?? u.email}`}
              >
                {deletingId === u.id ? '削除中…' : '削除'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
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
