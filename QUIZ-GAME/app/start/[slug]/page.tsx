'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StartPoster() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const search = useSearchParams();
  const avatar = search.get('avatar') ?? '';

  // 当前展示哪张海报
  const [posterSlug, setPosterSlug] = useState<string>(slug);

  // 路由变化时，同步一次
  useEffect(() => setPosterSlug(slug), [slug]);

  // 点击按钮 → 直接跳转到 /choose
  const onTap = () => {
    router.push(`/choose?avatar=${encodeURIComponent(avatar)}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div className="w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden relative bg-black">
        {/* 背景图 */}
        <img
          src={`/posters/${posterSlug}.png`}
          alt={`poster ${posterSlug}`}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* 底部按钮 */}
        <div className="absolute inset-x-0 bottom-10 p-6">
          <div className="rounded-2xl bg-black/35 backdrop-blur-sm p-3">
            <button
              onClick={onTap}
              className="w-full py-3 rounded-xl text-white font-semibold bg-[#1F2F4A] hover:brightness-110 transition"
            >
              Tap to Start
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
