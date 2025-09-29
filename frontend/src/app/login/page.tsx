// src/app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api'; // ← これを使う
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('c@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/sign_in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email, password } }),
      });
      if (!res.ok) throw new Error(`Login failed: ${res.status}`);

      const auth = res.headers.get('Authorization') || res.headers.get('authorization');
      if (!auth?.startsWith('Bearer ')) throw new Error('JWT not found');
      localStorage.setItem('token', auth.slice(7));
      router.push('/interns');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'ログインに失敗しました';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">ログイン</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input className="w-full border p-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
        <button className="w-full bg-black text-white p-2 rounded" disabled={loading}>
          {loading ? '送信中…' : 'ログイン'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
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
