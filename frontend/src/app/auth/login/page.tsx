'use client';
import { useState } from 'react';
import { saveToken } from '@/lib/auth';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/sign_in`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email, password } }),
    });
    if (res.ok) {
      saveToken(res);
      location.href = '/interns';
    } else {
      setError('ログインに失敗しました');
    }
  };


 return (
  <main className="max-w-md mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">ログイン</h1>
    <form onSubmit={onSubmit} className="space-y-3">
      <input className="w-full border p-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full border p-2" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="w-full bg-black text-white p-2 rounded">ログイン</button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  </main>
 );
}