// src/lib/api.ts
import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
});

// ブラウザ側で毎回 Authorization を付与
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ログイン（JWT保存）
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/users/sign_in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: { email, password } }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const auth = res.headers.get('Authorization') || res.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) throw new Error('JWT not found');
  localStorage.setItem('token', auth.slice(7));
  return res.json();
}
