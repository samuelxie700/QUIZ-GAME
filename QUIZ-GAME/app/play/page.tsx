'use client';

import { useSearchParams } from 'next/navigation';

export default function PlayPage() {
  const params = useSearchParams();
  const avatar = params.get('avatar');

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-100 p-6">
      <div className="w-[390px] min-h-[844px] bg-white rounded-[28px] shadow-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Game Page</h1>
        <p className="mb-4">Selected avatar: <b>{avatar ?? 'none'}</b></p>
        {avatar && (
          <img
            src={`/avatars/${avatar}.png`}
            alt="selected avatar"
            className="w-24 h-24 object-contain"
          />
        )}
        <p className="text-sm text-gray-500 mt-8">（这里之后接入题库、倒计时、得分等）</p>
      </div>
    </main>
  );
}
