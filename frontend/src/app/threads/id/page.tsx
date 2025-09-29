// src/app/threads/[id]/page.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

type Message = { id:number; body:string; created_at:string; sender_id:number };

export default function ThreadPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [body, setBody] = useState('');

  const { data: messages } = useQuery({
    queryKey: ['messages', id],
    queryFn: async () => (await api.get(`/api/threads/${id}/messages`)).data as Message[],
    refetchInterval: 3000, // 簡易ポーリング
  });

  const { mutate: send, isPending } = useMutation({
    mutationFn: async () =>
      (await api.post(`/api/threads/${id}/messages`, { message: { body } })).data,
    onSuccess: () => {
      setBody('');
      qc.invalidateQueries({ queryKey: ['messages', id] });
    },
  });

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">メッセージ</h1>
        <Link href="/threads" className="text-sm underline">スレッド一覧</Link>
      </div>
      <div className="space-y-2">
        {messages?.map((m) => (
          <div key={m.id} className="p-2 border rounded bg-white">
            <div className="text-sm text-gray-500">{new Date(m.created_at).toLocaleString()}</div>
            <div>{m.body}</div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); if (body.trim()) send(); }}
        className="flex gap-2"
      >
        <input
          className="flex-1 border p-2 rounded"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="メッセージを入力"
        />
        <button className="px-4 bg-black text-white rounded" disabled={isPending}>
          送信
        </button>
      </form>
    </main>
  );
}
