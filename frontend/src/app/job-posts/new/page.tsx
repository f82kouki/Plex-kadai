// src/app/job-posts/new/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function NewJobPost() {
  const [title, setTitle] = useState('インターン募集（Rails/Next.js）');
  const [description, setDescription] = useState('業務内容の説明…');
  const [tags, setTags] = useState('rails,nextjs');
  const [err, setErr] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/api/job_posts', { job_post: { title, description, tags } });
      router.push('/job-posts');
    } catch (e) {
      const message = e instanceof Error ? e.message : '作成に失敗しました（企業ユーザーのみ可）';
      setErr(message);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">募集作成</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" value={title} onChange={e=>setTitle(e.target.value)} placeholder="タイトル" />
        <textarea className="w-full border p-2 rounded min-h-[120px]" value={description} onChange={e=>setDescription(e.target.value)} placeholder="説明" />
        <input className="w-full border p-2 rounded" value={tags} onChange={e=>setTags(e.target.value)} placeholder="カンマ区切りタグ" />
        <button className="px-4 py-2 bg-black text-white rounded">作成</button>
        {err && <p className="text-red-600 text-sm">{err}</p>}
      </form>
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