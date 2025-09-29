// src/app/interns/[id]/page.tsx
'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function InternDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: intern } = useQuery({
    queryKey: ['intern', id],
    queryFn: async () => (await api.get(`/api/interns/${id}`)).data,
  });

  const { mutate: startThread, isPending, error } = useMutation({
    mutationFn: async () => (await api.post('/api/threads', { intern_id: Number(id) })).data,
    onSuccess: (t) => router.push(`/threads/${t.id}`),
  });

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">インターン詳細</h1>
      {intern && (
        <div className="p-4 border rounded bg-white">
          <div className="font-semibold">{intern.profile?.name ?? intern.email}</div>
          <div className="text-sm text-gray-600">
            {intern.profile?.school} {intern.profile?.skills?.join(', ')}
          </div>
        </div>
      )}
      <button
        onClick={() => startThread()}
        className="px-4 py-2 bg-black text-white rounded"
        disabled={isPending}
      >
        {isPending ? '作成中…' : 'DMを開始'}
      </button>
      {error && <p className="text-red-600 text-sm">作成に失敗しました</p>}
    </main>
  );
}
