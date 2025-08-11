'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AVATARS, AVATAR_TO_POSTER } from '@/lib/mapping';

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const onConfirm = () => {
    if (!selected) return;
    const slug = AVATAR_TO_POSTER[selected]; // 从映射表获取对应的海报页 slug
    if (!slug) {
      alert('未配置对应海报，请检查 AVATAR_TO_POSTER');
      return;
    }
    // 跳转到 /start/[slug]，并附带原始头像 id
    router.push(`/start/${encodeURIComponent(slug)}?avatar=${encodeURIComponent(selected)}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div className="w-[390px] h-[844px] bg-[#8b97a6] rounded-[28px] shadow-2xl overflow-hidden p-6 text-white">
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
