'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function Home() {
  type JobPost = { id: number; title: string; company?: { email?: string } };
  type Intern = { id: number; email: string; profile?: { name?: string; school?: string; skills?: string[] } };

  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');


  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (skillFilter.trim()) params.append('skills', skillFilter.trim());
    if (schoolFilter.trim()) params.append('school', schoolFilter.trim());
    return params.toString();
  }, [searchQuery, skillFilter, schoolFilter]);

  const { data: jobPosts } = useQuery<JobPost[]>({
    queryKey: ['job-posts', 'home'],
    queryFn: async () => (await api.get('/api/job_posts')).data as JobPost[],
  });
  
  const { data: interns, error: internsError, isLoading: internsLoading } = useQuery<Intern[]>({
    queryKey: ['interns', 'home', searchParams],
    queryFn: async () => {
      const url = searchParams ? `/api/interns?${searchParams}` : '/api/interns';
      return (await api.get(url)).data as Intern[];
    },
  });

  const clearSearch = () => {
    setSearchQuery('');
    setSkillFilter('');
    setSchoolFilter('');
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">スカウトサービス</h1>
        <div className="space-x-4">
          <Link className="underline active:bg-black active:text-white transition-colors" href="/login">ログイン</Link>
          <Link className='underline active:bg-black active:text-white transition-colors' href="/threads">スレッド</Link>
          <Link className="underline active:bg-black active:text-white transition-colors" href="/signup">インターン生登録</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">募集一覧</h2>
            <Link href="/job-posts" className="text-sm underline active:bg-black active:text-white transition-colors">もっと見る</Link>
          </div>
          <ul className="space-y-2">
            {jobPosts?.slice(0, 5).map((p) => (
              <li key={p.id} className="p-3 border rounded bg-white active:bg-black active:text-white transition-colors cursor-pointer">
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
            <h2 className="text-xl font-semibold">インターン生一覧</h2>
            <Link href="/interns" className="text-sm underline active:bg-black active:text-white transition-colors">もっと見る</Link>
          </div>
          
          {/* 検索フォーム */}
          <div className="bg-white p-3 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-700 mb-2">インターン生検索</h3>
            
            <div className="grid grid-cols-1 gap-2 mb-2">
              {/* 名前・メール検索 */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="名前やメールで検索"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              
              {/* スキル検索 */}
              <input
                type="text"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                placeholder="スキルで検索 (例: JavaScript, React)"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              
              {/* 学校検索 */}
              <input
                type="text"
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                placeholder="学校で検索"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {/* 検索クリアボタン */}
            {(searchQuery || skillFilter || schoolFilter) && (
              <button
                onClick={clearSearch}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 active:bg-black active:text-white transition-colors"
              >
                検索をクリア
              </button>
            )}
          </div>

          <ul className="space-y-2">
            {internsLoading && (
              <li className="text-sm text-gray-500 text-center py-4">読み込み中...</li>
            )}
            {internsError && (
              <li className="text-sm text-red-500 text-center py-4">
                エラーが発生しました: {internsError.message}
              </li>
            )}
            {!internsLoading && !internsError && interns?.slice(0, 5).map((u) => (
              <li key={u.id} className="p-3 border rounded bg-white active:bg-black active:text-white transition-colors cursor-pointer">
                <div className="font-semibold">{u.profile?.name ?? u.email}</div>
                <div className="text-sm text-gray-600">
                  {u.profile?.school} {u.profile?.skills?.join(', ')}
                </div>
              </li>
            ))}
            {!internsLoading && !internsError && !interns?.length && (searchQuery || skillFilter || schoolFilter) && (
              <li className="text-sm text-gray-500 text-center py-4">
                検索条件に一致するインターン生が見つかりませんでした
              </li>
            )}
            {!internsLoading && !internsError && !interns?.length && !searchQuery && !skillFilter && !schoolFilter && (
              <li className="text-sm text-gray-500">インターン生はまだいません</li>
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
