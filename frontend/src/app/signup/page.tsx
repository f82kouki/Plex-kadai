'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, login, api } from '@/lib/api';
import Link from 'next/link';   // ← ホームリンクのために追加

export default function SignupPage() {
  const [email, setEmail] = useState('i1@example.com');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      // ユーザー作成（role: intern）
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { email, password, role: 'intern' } }),
      });
      if (!res.ok) throw new Error('signup failed: ' + res.status);

      // サインインして JWT 保存
      await login(email, password);

      // プロフィール作成（名前・大学名）
      if (name || school) {
        try {
          await api.post('/api/profile', { profile: { name, school } });
        } catch (e) {
          // プロフィール作成に失敗しても致命的ではないため、ログのみ
          console.warn('Failed to create profile', e);
        }
      }
      router.push('/interns');
    } catch (e: any) {
      setErr(e?.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-sm mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">インターン登録</h1>

      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border p-2"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="氏名"
        />
        <input
          className="w-full border p-2"
          value={school}
          onChange={e => setSchool(e.target.value)}
          placeholder="大学名"
        />
        <input
          className="w-full border p-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="email"
        />
        <input
          className="w-full border p-2"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
        />
        <button
          className="w-full bg-black text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? '送信中…' : '登録してログイン'}
        </button>
        {err && <p className="text-red-600 text-sm">{err}</p>}
      </form>

      {/* ---- ホームに戻るボタンを追加 ---- */}
      <div className="pt-4">
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
