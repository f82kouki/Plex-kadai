'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';   // ← 追加
import { useRouter } from 'next/navigation';

export default function Interns() {
  type Intern = { id: number; email: string; profile?: { name?: string; school?: string; skills?: string[] } };
  const queryClient = useQueryClient();
  const router = useRouter();

  // 検索状態の管理
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');

  // 検索パラメータを構築
  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (skillFilter.trim()) params.append('skills', skillFilter.trim());
    if (schoolFilter.trim()) params.append('school', schoolFilter.trim());
    return params.toString();
  }, [searchQuery, skillFilter, schoolFilter]);

  const { data } = useQuery<Intern[]>({
    queryKey: ['interns', searchParams],
    queryFn: async () => {
      const url = searchParams ? `/api/interns?${searchParams}` : '/api/interns';
      return (await api.get(url)).data as Intern[];
    },
  });

  const [deletingId, setDeletingId] = useState<number|null>(null);
  const { mutate: destroy } = useMutation<void, { response?: { status?: number } }, number>({
    mutationFn: async (id: number) => {
      await api.delete(`/api/interns/${id}`);
    },
    onSuccess: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ['interns'] });
    },
    onError: (err) => {
      setDeletingId(null);
      const status = err?.response?.status;
      if (status === 401) {
        alert('ログインが必要です。');
        if (typeof window !== 'undefined') window.location.href = '/login';
        return;
      }
      alert(`削除に失敗しました${status ? ` (HTTP ${status})` : ''}`);
    },
  });

  const { mutate: startThread, isPending: startingId } = useMutation<{ id:number }, { response?: { status?: number } }, number>({
    mutationFn: async (internId: number) => (await api.post('/api/threads', { intern_id: internId })).data,
    onSuccess: (t) => router.push(`/threads/${t.id}`),
    onError: (err) => {
      const status = err?.response?.status;
      if (status === 401) {
        alert('ログインが必要です。');
        if (typeof window !== 'undefined') window.location.href = '/login';
        return;
      }
      if (status === 403) {
        alert('企業ユーザーのみDMを開始できます');
        return;
      }
      alert(`DM開始に失敗しました${status ? ` (HTTP ${status})` : ''}`);
    },
  });

  // 検索をクリアする関数
  const clearSearch = () => {
    setSearchQuery('');
    setSkillFilter('');
    setSchoolFilter('');
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">インターン一覧</h1>
      
      {/* 検索フォーム */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h2 className="text-lg font-semibold mb-4">検索・フィルター</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* 名前・メール検索 */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              名前・メール検索
            </label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="名前やメールアドレスで検索"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* スキル検索 */}
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
              スキル検索
            </label>
            <input
              id="skills"
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="例: JavaScript, React, Python"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* 学校検索 */}
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
              学校検索
            </label>
            <input
              id="school"
              type="text"
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              placeholder="学校名で検索"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* 検索クリアボタン */}
        {(searchQuery || skillFilter || schoolFilter) && (
          <button
            onClick={clearSearch}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            検索をクリア
          </button>
        )}
      </div>

      {/* 検索結果の表示 */}
      {data && data.length === 0 && (searchQuery || skillFilter || schoolFilter) && (
        <div className="text-center py-8 text-gray-500">
          検索条件に一致するインターン生が見つかりませんでした。
        </div>
      )}

      <ul className="grid gap-3">
        {data?.map((u) => (
          <li key={u.id} className="p-4 bg-white rounded border">
            <div className="flex items-start justify-between gap-3">
              <div>
                <a className="font-semibold underline" href={`/interns/${u.id}`}>
                  {u.profile?.name ?? u.email}
                </a>
                <p className="text-sm text-gray-600">
                  {u.profile?.school} / {u.profile?.skills?.join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startThread(u.id)}
                  className="px-3 py-1 text-sm rounded bg-black text-white hover:opacity-90"
                  disabled={!!startingId}
                >
                  DMを開始
                </button>
                <button
                  onClick={() => {
                    if (confirm('このインターン生登録を削除しますか？')) { setDeletingId(u.id); destroy(u.id); }
                  }}
                  className="px-3 py-1 text-sm rounded border border-red-600 text-red-600 hover:bg-red-50"
                  disabled={deletingId === u.id}
                  aria-label={`Delete intern ${u.profile?.name ?? u.email}`}
                >
                  {deletingId === u.id ? '削除中…' : '削除'}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

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
