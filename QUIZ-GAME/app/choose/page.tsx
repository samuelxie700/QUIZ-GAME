'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/** 方框可调参数 **/
const BORDER_COLOR = '#F2A25C';
const BORDER_THICKNESS = 8;   // 边框粗细(px)
const BORDER_RADIUS = 12;     // 圆角(px)

/** 只缩宽 or 只缩高：分别改下面四个 inset 值（单位：px） */
const TOP_INSET = 1;          // 往下收（只缩高度就调它和 BOTTOM_INSET）
const RIGHT_INSET = 14;       // 往左收（只缩宽度就调它和 LEFT_INSET）
const BOTTOM_INSET = 1;       // 往上收
const LEFT_INSET = 14;        // 往右收

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
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);            // 居中索引
  const [selected, setSelected] = useState<number | null>(null); // 点击选中索引

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

  const onCardClick = (idx: number) => {
    setSelected(prev => (prev === idx ? null : idx));
  };

  const onConfirm = () => {
    if (selected == null) return;
    // 这里按你的原逻辑进入下一页
    router.push('/play/q1');
  };

  const hint = selected == null
    ? 'Swipe to Select Card then Confirm'
    : 'i canged my mind';

  const canProceed = selected != null;

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

        {/* 滑动区域 */}
        <div className="relative px-3">
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            // ✅ 不再 preventDefault，改用 onWheel，并手动横向滚动
            onWheel={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
              el.scrollBy({ left: delta * 1.1, behavior: 'auto' });
            }}
            className="
              overflow-x-auto overflow-y-hidden
              snap-x snap-mandatory
              scroll-px-6
              flex gap-5 px-5 pt-[120px] pb-[140px]
              touch-pan-x
              overscroll-x-contain overscroll-y-none   /* ✅ 防止滚动穿透，不需要 preventDefault */
              no-scrollbar
            "
          >
            {CARDS.map((card, idx) => {
              const active = idx === current;          // 居中放大
              const isSelected = idx === selected;     // 是否选中
              return (
                <button
                  type="button"
                  key={card.id}
                  onClick={() => onCardClick(idx)}
                  className={`
                    snap-center shrink-0
                    w-[220px] h-[340px]
                    rounded-2xl p-0
                    bg-transparent
                    flex items-center justify-center
                    transition-all duration-300
                    ${active ? 'scale-105' : 'scale-95 opacity-85'}
                    focus:outline-none
                  `}
                >
                  {/* 图片 + 可控方框容器 */}
                  <div className="relative w-full h-full">
                    <img
                      src={card.src}
                      alt={card.label}
                      className="w-full h-full object-contain pointer-events-none select-none"
                      draggable={false}
                    />
                    {isSelected && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          top: TOP_INSET,
                          right: RIGHT_INSET,
                          bottom: BOTTOM_INSET,
                          left: LEFT_INSET,
                          border: `${BORDER_THICKNESS}px solid ${BORDER_COLOR}`,
                          borderRadius: `${BORDER_RADIUS}px`,
                        }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 底部按钮区 */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-3">
          <button
            onClick={onConfirm}
            disabled={!canProceed}
            className={`
              w-full h-[48px] rounded-xl font-semibold transition
              shadow-[inset_0_-4px_0_rgba(0,0,0,0.35)]
              ${canProceed
                ? 'bg-green-600 hover:brightness-110'
                : 'bg-[#1C2A3C] opacity-60 cursor-not-allowed'}
            `}
          >
            Confirm
          </button>

          <p
            className={`
              text-center text-xs mt-3
              ${canProceed ? 'text-white/80 cursor-pointer underline-offset-2 hover:underline' : 'text-white/70'}
            `}
            onClick={() => {
              if (canProceed) setSelected(null); // 选中时点击可取消
            }}
          >
            {hint}
          </p>
        </div>
      </div>
    </main>
  );
}
