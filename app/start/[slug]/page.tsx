'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';

export default function StartPoster() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>(); // ✅ 对应文件夹名 [slug]
  const search = useSearchParams();
  const avatar = search.get('avatar');

  if (!slug) return null;

  const onStart = () => {
    // 跳到 /play，并带上 avatar 参数
    router.push(`/play?avatar=${encodeURIComponent(avatar ?? '')}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div className="w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden relative bg-black">
        <img
          src={`/posters/${slug}.png`}
          alt={`poster ${slug}`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-10 p-6">
          <div className="rounded-2xl bg-black/35 backdrop-blur-sm p-3">
            <button
              onClick={onStart}
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
