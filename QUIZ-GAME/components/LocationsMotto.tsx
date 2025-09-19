'use client';

import { useEffect, useState } from 'react';
import { Dongle } from 'next/font/google';

const dongle = Dongle({ subsets: ['latin'], weight: ['300', '700'] });

/** 保险裁剪：最多 8 个英文词（服务端已裁，这里再次兜底） */
function clamp8Words(s: string) {
  const cleaned = s.replace(/["'.,!?;:]/g, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.slice(0, 8).join(' ');
}

export default function LocationsMotto() {
  const [motto, setMotto] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const v = localStorage.getItem('locMotto') || '';
    setMotto(clamp8Words(v));
  }, []);

  return (
    <div
      className={dongle.className}
      style={{
        fontSize: 18,         // ✅ 字号 18
        lineHeight: '22px',
        textAlign: 'center',
        color: '#4D688C',     // 可按你的配色修改
        wordBreak: 'break-word',
        whiteSpace: 'normal',
      }}
    >
      {motto || 'Loading your motto...'}
    </div>
  );
}
