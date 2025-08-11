'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StartPoster() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();      // 路由初始 slug（a1a1、a2a2…或 title）
  const search = useSearchParams();
  const avatar = search.get('avatar') ?? '';

  // 用本地状态来控制“当前显示哪张海报”
  const [posterSlug, setPosterSlug] = useState<string>(slug);

  // 若路由变化，保持同步（通常不需要，但更稳妥）
  useEffect(() => setPosterSlug(slug), [slug]);

  const onStart = () => {
    // ✅ 不跳转，直接把当前展示切到 title
    setPosterSlug('title');
    // 如果你想切完再继续跳某页，可在这儿再 router.push('/choose') 之类的
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div className="w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden relative bg-black">
        {/* 根据本地状态显示对应图片；切到 title 后就是 public/posters/title.png */}
        <img
          src={`/posters/${posterSlug}.png`}
          alt={`poster ${posterSlug}`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* 按钮：如果已经是 title，你可以选择隐藏或改成别的动作 */}
        <div className="absolute inset-x-0 bottom-10 p-6">
          <div className="rounded-2xl bg-black/35 backdrop-blur-sm p-3">
            <button
              onClick={onStart}
              className="w-full py-3 rounded-xl text-white font-semibold bg-[#1F2F4A] hover:brightness-110 transition"
              // 如果已经是 title 想禁用按钮，取消下一行注释：
              // disabled={posterSlug === 'title'}
            >
              Tap to Start
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
