'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';


type ThreadUser = { id: number; email: string; role: 'intern'|'company' };
type Thread = { id: number; users: ThreadUser[] };

export default function Threads() {
  const { data, isLoading, error } = useQuery<Thread[]>({
    queryKey: ['threads'],
    queryFn: async () => (await api.get('/api/threads')).data as Thread[],
  });

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">スレッド</h1>
        <Link href="/" className="text-sm underline">ホーム</Link>
      </div>
      {isLoading && <div className="text-sm text-gray-500">読み込み中…</div>}
      {error && <div className="text-sm text-red-600">スレッド取得に失敗しました</div>}
      <ul className="space-y-2">
        {data?.map((t) => (
          <li key={t.id} className="p-3 bg-white border rounded">
            <Link className="underline" href={`/threads/${t.id}`}>Thread #{t.id}</Link>
            <div className="text-xs text-gray-500">participants: {t.users.map((u) => u.email).join(', ')}</div>
          </li>
        ))}
        {data && data.length === 0 && (
          <li className="text-sm text-gray-500">スレッドはまだありません</li>
        )}
      </ul>
    </main>
  );
}