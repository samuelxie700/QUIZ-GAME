'use client';
'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const TITLE_SLUG = 'title'; // public/posters/title.png

export default function StartPoster() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const search = useSearchParams();
  const avatar = search.get('avatar') ?? '';

  // 当前展示哪张海报
  const [posterSlug, setPosterSlug] = useState<string>(slug);

  // 路由变化时，同步一次（稳妥）
  useEffect(() => setPosterSlug(slug), [slug]);

  const onTap = () => {
    if (posterSlug !== TITLE_SLUG) {
      // 第一次点击：只把画面换成 title（不改 URL、不跳转）
      setPosterSlug(TITLE_SLUG);
    } else {
      // 第二次点击：进入卡片滑动页面
      router.push(`/choose?avatar=${encodeURIComponent(avatar)}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div className="w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden relative bg-black">
        {/* 防挡点击：pointer-events-none */}
        <img
          src={`/posters/${posterSlug}.png`}
          alt={`poster ${posterSlug}`}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        <div className="absolute inset-x-0 bottom-10 p-6">
          <div className="rounded-2xl bg-black/35 backdrop-blur-sm p-3">
            <button
              onClick={onTap}
              className="w-full py-3 rounded-xl text-white font-semibold bg-[#1F2F4A] hover:brightness-110 transition"
            >
              {posterSlug !== TITLE_SLUG ? 'Tap to Start' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
