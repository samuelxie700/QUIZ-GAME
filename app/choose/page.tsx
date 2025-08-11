'use client';

import { useEffect, useRef, useState } from 'react';

// 12 张卡片：public/cards/card-01.png ~ card-12.png
const labels = [
  'Art & Humanities',
  'Business',
  'Design & Creative Arts',
  'Engineering',
  'Environmental Studies',
  'Health Science',
  'IT & Computer Science',
  'Law',
  'Eduation',
  'Nursing',
  'Other',
  'Social Work',
];

const CARDS = Array.from({ length: 12 }).map((_, i) => ({
  id: `card-${String(i + 1).padStart(2, '0')}`,
  label: labels[i] ?? `Card ${String(i + 1).padStart(2, '0')}`,
  src: `/cards/card-${String(i + 1).padStart(2, '0')}.png`,
}));

export default function ChoosePage() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const chosen = CARDS[current];

  // 初次居中第 0 张
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !el.children.length) return;
    const first = el.children[0] as HTMLElement;
    const left = first.offsetLeft + first.offsetWidth / 2 - el.clientWidth / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: 'auto' });
  }, []);

  // 滚动时找离中心最近的卡片
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0, dist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const c = el.children[i] as HTMLElement;
      const mid = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < dist) { dist = d; best = i; }
    }
    setCurrent(best);
  };

  // 先不跳转，只打印
  const onConfirm = () => {
    console.log('chosen:', chosen);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      {/* iPhone 竖屏容器 */}
      <div className="w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden relative text-white">
        {/* 背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#273444] via-[#1f2a3a] to-[#17202b]" />

        {/* 顶部标题 */}
        <div className="relative px-6 pt-8 pb-2">
          <p className="text-center text-[18px] leading-6 font-semibold text-white/90">
            Choose your path to your Aussie<br />knowledge mastery!
          </p>
        </div>

        {/* 滑动区域（整体下移：pt-[120px] 可调） */}
        <div className="relative px-3">
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            onWheelCapture={(e) => {
              e.preventDefault();
              const el = e.currentTarget;
              const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
              el.scrollBy({ left: delta * 1.1, behavior: 'auto' });
            }}
            className="
              overflow-x-auto overflow-y-hidden
              snap-x snap-mandatory
              scroll-px-6
              flex gap-5 px-5 pt-[120px] pb-2
              touch-pan-x
              no-scrollbar
            "
          >
            {CARDS.map((card, idx) => {
              const active = idx === current;
              return (
                <div
                  key={card.id}
                  className={`
                    snap-center shrink-0
                    w-[220px] h-[340px]
                    rounded-2xl
                    bg-[#F5F0EA]
                    border-[6px] border-[#E69A4E]
                    flex flex-col items-center justify-center
                    transition-all duration-300
                    ${active ? 'scale-105 shadow-[0_12px_28px_rgba(0,0,0,0.35)]' : 'opacity-85'}
                  `}
                >
                  <img
                    src={card.src}
                    alt={card.label}
                    className="max-w-[80%] max-h-[80%] object-contain"
                    draggable={false}
                  />
                  <div className="mt-4 text-[#2E3E55] font-extrabold text-base tracking-wide">
                    {card.label.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部按钮区 */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-3">
          <button
            onClick={onConfirm}
            className="
              w-full h-[48px]
              rounded-xl
              font-semibold
              bg-[#1C2A3C]
              shadow-[inset_0_-4px_0_rgba(0,0,0,0.35)]
              hover:brightness-110
              transition
            "
          >
            Confirm
          </button>

          <p className="text-center text-xs text-white/70 mt-3">
            I changed my mind!
          </p>
        </div>
      </div>
    </main>
  );
}
