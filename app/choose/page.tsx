'use client';

import { useEffect, useRef, useState } from 'react';

// 12 张卡片：card-01.png ~ card-12.png
const CARDS = Array.from({ length: 12 }).map((_, i) => ({
  id: `card-${String(i + 1).padStart(2, '0')}`,
  label: `Card ${String(i + 1).padStart(2, '0')}`,
  src: `/cards/card-${String(i + 1).padStart(2, '0')}.png`,
}));

export default function ChoosePage() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const chosen = CARDS[current];

  // 初次居中第0张
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

  // 先不跳转，只在控制台打印所选项（你准备好后再接跳转）
  const onConfirm = () => {
    console.log('chosen:', chosen);
    // 需要跳转时再启用：
    // router.push(`/play?track=${encodeURIComponent(chosen.id)}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#253448] to-[#1b2330]">
      <div className="w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden relative text-white flex flex-col">
        {/* 标题 */}
        <div className="px-5 pt-6 pb-4">
          <p className="text-center text-[18px] leading-6 font-semibold">
            Choose your path to your Aussie<br/>knowledge mastery!
          </p>
        </div>

        {/* 滑动区域 */}
        <div className="px-3">
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="
              overflow-x-auto no-scrollbar
              snap-x snap-mandatory
              scroll-px-6
              flex gap-4 px-4 py-2
            "
            style={{ scrollBehavior: 'smooth' }}
          >
            {CARDS.map((card, idx) => {
              const active = idx === current;
              return (
                <div
                  key={card.id}
                  className={`
                    snap-center shrink-0
                    w-[280px] h-[500px]
                    rounded-3xl bg-[#3a4c66]
                    p-3
                    transition-all duration-300
                    ${active ? 'scale-[1.02] ring-4 ring-white/30' : 'opacity-90'}
                  `}
                >
                  <div className="w-full h-full rounded-2xl bg-[#EBD9C6] overflow-hidden flex items-center justify-center">
                    <img
                      src={card.src}
                      alt={card.label}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                  <div className="text-center mt-3 font-extrabold tracking-wide">
                    {card.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部：当前选中提示 + Confirm（不跳转） */}
        <div className="mt-auto px-6 pb-6 pt-3">
          <div className="text-center text-sm text-white/80 mb-2">
            Selected: <span className="font-semibold">{chosen.label}</span>
          </div>
          <button
            onClick={onConfirm}
            className="w-full py-3.5 rounded-xl text-lg font-semibold bg-white/15 hover:bg-white/25 transition"
          >
            Confirm
          </button>
          <p className="text-center text-xs text-white/70 mt-3">
            Swipe to Select Card then Confirm
          </p>
        </div>
      </div>
    </main>
  );
}
