'use client';
import { saveToken } from '@/lib/auth';
import { useState } from 'react';


export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'intern'|'company'>('intern');


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email, password, role } }),
    });
    if (res.ok) { saveToken(res); location.href = '/interns'; }
  };


  return (
    <main className="max-w-md mx-auto p-6 space-y-2">
      <h1 className="text-2xl font-bold">サインアップ</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="w-full border p-2" value={role} onChange={e=>setRole(e.target.value as 'intern'|'company')}>
          <option value="intern">インターン</option>
          <option value="company">企業</option>
        </select> 
        <button className="w-full bg-black text-white p-2 rounded">作成</button>
      </form>
    </main>
  );
}