// src/app/page.tsx
'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function Home() {
  type JobPost = { id: number; title: string; company?: { email?: string } };
  type Intern = { id: number; email: string; profile?: { name?: string; school?: string; skills?: string[] } };

  const { data: jobPosts } = useQuery<JobPost[]>({
    queryKey: ['job-posts', 'home'],
    queryFn: async () => (await api.get('/api/job_posts')).data as JobPost[],
  });
  const { data: interns } = useQuery<Intern[]>({
    queryKey: ['interns', 'home'],
    queryFn: async () => (await api.get('/api/interns')).data as Intern[],
  });

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">スカウトサービス</h1>
        <div className="space-x-4">
          <Link className="underline" href="/login">ログイン</Link>
          <Link className='underline' href="/threads">スレッド</Link>
          <Link className="underline" href="/signup">インターン登録</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">募集一覧</h2>
            <Link href="/job-posts" className="text-sm underline">もっと見る</Link>
          </div>
          <ul className="space-y-2">
            {jobPosts?.slice(0, 5).map((p) => (
              <li key={p.id} className="p-3 border rounded bg-white">
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-600">{p.company?.email}</div>
              </li>
            ))}
            {!jobPosts?.length && (
              <li className="text-sm text-gray-500">募集はまだありません</li>
            )}
          </ul>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">インターン一覧</h2>
            <Link href="/interns" className="text-sm underline">もっと見る</Link>
          </div>
          <ul className="space-y-2">
            {interns?.slice(0, 5).map((u) => (
              <li key={u.id} className="p-3 border rounded bg-white">
                <div className="font-semibold">{u.profile?.name ?? u.email}</div>
                <div className="text-sm text-gray-600">
                  {u.profile?.school} {u.profile?.skills?.join(', ')}
                </div>
              </li>
            ))}
            {!interns?.length && (
              <li className="text-sm text-gray-500">インターンはまだいません</li>
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
