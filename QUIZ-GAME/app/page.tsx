'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AVATARS, AVATAR_TO_POSTER } from '@/lib/mapping';

export default function Home() {
  const router = useRouter();

  // ① 首屏是否显示 title.png 覆盖层
  const [showIntro, setShowIntro] = useState(true);

  // ② 你原来的选择逻辑保持不变
  const [selected, setSelected] = useState<string | null>(null);

  const onConfirm = () => {
    if (!selected) return;

    // ✅ 新增：把选中的头像ID持久化，供 Q8 读取
    try {
      localStorage.setItem('avatar', selected);
    } catch {}

    const slug = AVATAR_TO_POSTER[selected]; // 从映射表获取对应的海报页 slug
    if (!slug) {
      alert('未配置对应海报，请检查 AVATAR_TO_POSTER');
      return;
    }
    // 跳转到 /start/[slug]，并附带原始头像 id（原逻辑不变）
    router.push(`/start/${encodeURIComponent(slug)}?avatar=${encodeURIComponent(selected)}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div className="relative w-[390px] h-[844px] bg-[#8b97a6] rounded-[28px] shadow-2xl overflow-hidden p-6 text-white">

        {/* ===== 覆盖层：首次进入显示 title.png ===== */}
        {showIntro && (
          <div className="absolute inset-0 z-50">
            {/* 背景海报：public/posters/title.png */}
            <img
              src="/posters/title.png"
              alt="Title"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              draggable={false}
            />
            {/* 按钮整体上移，通过 bottom-[数值] 调整 */}
            <div className="absolute inset-x-0 bottom-[78px] flex justify-center">
              <button
                onClick={() => setShowIntro(false)}
                className="w-[218px] h-[46px] rounded-[7px] text-white font-semibold bg-[#F2A25C] hover:brightness-110 transition"
              >
                Tap to Start
              </button>
            </div>
          </div>
        )}
        {/* ===== 覆盖层结束 ===== */}

        {/* 你原来的首页内容（保持不变） */}
        <h1 className="text-5xl font-extrabold leading-tight mb-4">G’day ’Straya!</h1>

        {/* 头像网格 */}
        <div className="grid grid-cols-2 gap-6 justify-items-center mb-8">
          {AVATARS.map((a) => {
            const active = selected === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setSelected(a.id)}
                className={[
                  'w-28 h-28 rounded-2xl bg-white/10 flex items-center justify-center transition',
                  active ? 'ring-4 ring-blue-500 scale-95' : 'ring-2 ring-white/20 hover:ring-white/40'
                ].join(' ')}
                aria-pressed={active}
                aria-label={a.alt}
              >
                <img
                  src={a.src}
                  alt={a.alt}
                  className="w-20 h-20 object-contain select-none pointer-events-none"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-auto mb-4">
          <h2 className="text-xl font-extrabold">AUSTRALIA STUDY QUIZ</h2>
          <p className="text-white/80">Where do you belong?</p>
        </div>

        <button
          onClick={onConfirm}
          disabled={!selected}
          className="w-full py-4 rounded-xl text-lg font-semibold bg-[#1F2F4A] hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
        </button>
      </div>
    </main>
  );
}
