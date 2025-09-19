'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Dongle, Bagel_Fat_One } from 'next/font/google';

// ✅ 字体：Dongle 700 + Bagel 400；另加 Dongle 300 用于 18px 正文
const dongle700 = Dongle({ subsets: ['latin'], weight: '700' });
const dongle300 = Dongle({ subsets: ['latin'], weight: '300' });
const bagel400 = Bagel_Fat_One({ subsets: ['latin'], weight: '400' });

type ModalKey =
  | 'main'
  | 'baseCamp'
  | 'personality'
  | 'lucky'
  | 'partner'
  | 'locations'
  | null;

const MODAL: Record<Exclude<ModalKey, null>, { title: string; body: string }> = {
  main: {
    title: 'Focused Scholar',
    body:
      'A peaceful and serene environment is where you flourish. You prefer calm surroundings that allow for deep concentration and reflection. Your commitment to your studies is unwavering, and you value the tranquillity that supports your learning journey.',
  },
  baseCamp: { title: 'Base Camp', body: 'Quiet and Relaxed.' },
  personality: { title: 'Personality', body: 'Serious Study Person.' },
  lucky: { title: 'Lucky Charm', body: 'With the headphones, you are able to concentrate better.' },
  partner: { title: 'Partner', body: 'Mindful Leaner.' },
  locations: { title: 'Locations', body: 'Coming soon.' },
};

// —— 与 R1/R2 一致：只留字母/数字/空格，最多 8 词
function sanitizeToEightWords(s: string) {
  const cleaned = (s || '')
    .replace(/[“”"‘’'`.,!?;:|/\\(){}\[\]<>~@#$%^&*_+=-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(Boolean);
  return words.slice(0, 8).join(' ');
}

export default function R3Page() {
  const [open, setOpen] = useState<ModalKey>(null);

  // ✅ motto：从接口获取，失败/首屏用本地兜底
  const [motto, setMotto] = useState('');
  const [loading, setLoading] = useState(true);

  // 可选：把 quiz 的答案也发给 API（与 R1/R2 同步）
  const answersPayload = useMemo(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('answers') : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        // 1) 先读本地兜底（避免白屏）
        const cached = typeof window !== 'undefined' ? localStorage.getItem('locMotto') || '' : '';
        if (cached) setMotto(cached);

        // 2) POST /api/location（与 R1/R2 相同）
        const avatar = typeof window !== 'undefined' ? (localStorage.getItem('avatar') || 'unknown') : 'unknown';
        const url = `/api/location?t=${Date.now()}`; // cache-busting

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar, answers: answersPayload }),
          signal: controller.signal,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const data = (await resp.json()) as { motto?: string };
        const safe = sanitizeToEightWords(data?.motto || '');
        const finalText = safe || 'Explore, learn and thrive';

        setMotto(finalText);
        if (typeof window !== 'undefined') localStorage.setItem('locMotto', finalText);
      } catch (e) {
        console.error('[r3] location api failed:', e);
        if (!motto) setMotto('Explore, learn and thrive');
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answersPayload]); // 与 R1/R2 保持一致

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      {/* 390 x 844 画布 */}
      <div
        className="relative w-[390px] h-[844px] rounded-[28px] overflow-hidden shadow-2xl"
        style={{ background: '#F2D9BB' }}
      >
        {/* 顶部标题 */}
        <span
          className={`${dongle700.className}`}
          style={{
            position: 'absolute',
            top: 40,
            left: 29,
            width: 316,
            height: 32,
            fontSize: 24,
            lineHeight: '32px',
            textAlign: 'center',
            color: '#BF4F26',
          }}
        >
          You are a...!
        </span>

        {/* 人物主插画 */}
        <img
          src="/r3/Focused_Scholar.png"
          alt="Focused Scholar"
          className="absolute select-none pointer-events-none"
          style={{ left: 79, top: 79, width: 217, height: 217 }}
          draggable={false}
        />

        {/* 三个性格词 */}
        <div
          className={`${dongle700.className}`}
          style={{
            position: 'absolute',
            left: 98,
            top: 305,
            display: 'flex',
            gap: 16,
            fontSize: 18,
            lineHeight: '20px',
          }}
        >
          <span style={{ color: '#BF4F26' }}>Patient</span>
          <span style={{ color: '#4D688C' }}>Organised</span>
          <span style={{ color: '#F2A25C' }}>Calm</span>
        </div>

        {/* 大卡片标题条 */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 329,
            width: 299,
            height: 42,
            background: '#BF4F26',
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
          }}
        />
        <span
          className={`${bagel400.className}`}
          style={{
            position: 'absolute',
            left: 38,
            top: 333,
            width: 299,
            height: 32,
            fontSize: 24,
            lineHeight: '32px',
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          Focused Scholar
        </span>

        {/* 大卡片正文（蓝底） */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 371,
            width: 299,
            height: 130,
            background: '#4D688C',
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 14,
          }}
        />
        <div
          className={`${dongle700.className}`}
          style={{
            position: 'absolute',
            left: 47,
            top: 376,
            width: 280,
            height: 120,
            opacity: 1,
            fontSize: 16,
            lineHeight: '20px',
            color: '#FFFFFF',
            textAlign: 'center',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 6,
            WebkitBoxOrient: 'vertical',
          }}
        >
          A peaceful and serene environment is where you flourish. You prefer calm surroundings
          that allow for deep concentration and reflection. Your commitment to your studies is
          unwavering, and you value the tranquillity that supports your learning journey.
        </div>

        {/* 点击区域（大卡片弹窗） */}
        <button
          aria-label="Open Focused Scholar"
          onClick={() => setOpen('main')}
          className="absolute"
          style={{ left: 38, top: 371, width: 299, height: 130, borderRadius: 14, background: 'transparent' }}
        />

        {/* Base Camp 小卡 */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 511,
            width: 139,
            height: 53,
            background: '#BF4F26',
            borderRadius: 14,
          }}
        />
        <span
          className={`${bagel400.className}`}
          style={{
            position: 'absolute',
            left: 38,
            top: 516,
            width: 139,
            textAlign: 'center',
            fontSize: 16,
            lineHeight: '32px',
            color: '#FFFFFF',
          }}
        >
          Base Camp
        </span>
        <span
          className={`${dongle700.className}`}
          style={{
            position: 'absolute',
            left: 38,
            top: 544,
            width: 139,
            textAlign: 'center',
            fontSize: 15,
            lineHeight: '14px',
            color: '#FFFFFF',
          }}
        >
          Quiet and Relaxed
        </span>
        {/* 点击区域（Base Camp 弹窗） */}
        <button
          aria-label="Open Base Camp"
          onClick={() => setOpen('baseCamp')}
          className="absolute"
          style={{ left: 38, top: 511, width: 139, height: 53, borderRadius: 14, background: 'transparent' }}
        />

        {/* Personality 小卡 */}
        <div
          style={{
            position: 'absolute',
            left: 197,
            top: 511,
            width: 140,
            height: 53,
            background: '#4D688C',
            borderRadius: 14,
          }}
        />
        <span
          className={`${bagel400.className}`}
          style={{
            position: 'absolute',
            left: 197,
            top: 516,
            width: 140,
            textAlign: 'center',
            fontSize: 16,
            lineHeight: '32px',
            color: '#FFFFFF',
          }}
        >
          Personality
        </span>
        <span
          className={`${dongle700.className}`}
          style={{
            position: 'absolute',
            left: 197,
            top: 544,
            width: 140,
            textAlign: 'center',
            fontSize: 15,
            lineHeight: '14px',
            color: '#FFFFFF',
          }}
        >
          Serious Study Person
        </span>
        {/* 点击区域（Personality 弹窗） */}
        <button
          aria-label="Open Personality"
          onClick={() => setOpen('personality')}
          className="absolute"
          style={{ left: 197, top: 511, width: 140, height: 53, borderRadius: 14, background: 'transparent' }}
        />

        {/* Lucky Charm 卡片 */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 574,
            width: 299,
            height: 91,
            background: '#FFFFFF',
            borderRadius: 14,
          }}
        />
        <img
          src="/r3/IMG_1136.png"
          alt="Headphones"
          className="absolute"
          style={{ left: 47, top: 582, width: 76, height: 76 }}
        />
        {/* Lucky Charm 标题 */}
        <span
          className={`${bagel400.className}`}
          style={{
            position: 'absolute',
            top: 579,
            left: 179,
            width: 98,
            height: 19,
            fontSize: 16,
            lineHeight: '19px',
            textAlign: 'center',
            opacity: 1,
          }}
        >
          <span style={{ color: '#BF4F26' }}>Lucky </span>
          <span style={{ color: '#4D688C' }}>Charm</span>
        </span>
        {/* Lucky Charm 描述 */}
        <div
          className={`${dongle700.className}`}
          style={{
            position: 'absolute',
            top: 611,
            left: 129,
            width: 198,
            height: 40,
            fontSize: 20,
            lineHeight: '20px',
            textAlign: 'center',
            color: '#4D688C',
            opacity: 1,
          }}
        >
          With the headphones, you are able to concentrate better.
        </div>
        {/* 点击区域（Lucky 弹窗） */}
        <button
          aria-label="Open Lucky Charm"
          onClick={() => setOpen('lucky')}
          className="absolute"
          style={{ left: 38, top: 574, width: 299, height: 91, borderRadius: 14, background: 'transparent' }}
        />

        {/* Partner 卡片 */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 675,
            width: 139,
            height: 117,
            background: '#FFFFFF',
            borderRadius: 14,
          }}
        />
        <span
          className={`${bagel400.className}`}
          style={{
            position: 'absolute',
            left: 38,
            top: 680,
            width: 139,
            textAlign: 'center',
            fontSize: 16,
            lineHeight: '32px',
            color: '#4D688C',
          }}
        >
          Partner
        </span>
        <img
          src="/r3/IMG_1152.png"
          alt="Mindful Leaner"
          className="absolute"
          style={{ left: 71, top: 704, width: 72, height: 72 }}
        />
        <span
          className={`${dongle700.className}`}
          style={{
            position: 'absolute',
            left: 38,
            top: 777,
            width: 139,
            textAlign: 'center',
            fontSize: 16,
            lineHeight: '14px',
            color: '#4D688C',
          }}
        >
          Mindful Leaner
        </span>
        {/* 点击区域（Partner 弹窗） */}
        <button
          aria-label="Open Partner"
          onClick={() => setOpen('partner')}
          className="absolute"
          style={{ left: 38, top: 675, width: 139, height: 117, borderRadius: 14, background: 'transparent' }}
        />

        {/* Locations 卡片（API motto，Dongle 18px） */}
        <div
          style={{
            position: 'absolute',
            left: 197,
            top: 675,
            width: 139,
            height: 117,
            background: '#FFFFFF',
            borderRadius: 14,
          }}
        />
        <span
          className={`${bagel400.className}`}
          style={{
            position: 'absolute',
            left: 197,
            top: 680,
            width: 139,
            textAlign: 'center',
            fontSize: 16,
            lineHeight: '32px',
            color: '#4D688C',
          }}
        >
          Locations
        </span>
        {/* ✅ Motto（Dongle 18px） */}
        <div
          className={`${dongle300.className}`}
          style={{
            position: 'absolute',
            left: 205,
            top: 720,
            width: 123,
            textAlign: 'center',
            fontSize: 18,
            lineHeight: '22px',
            color: '#4D688C',
            wordBreak: 'break-word',
          }}
        >
          {loading ? 'Loading…' : (motto || 'Explore, learn and thrive')}
        </div>

        {/* 点击区域（Locations 弹窗） */}
        <button
          aria-label="Open Locations"
          onClick={() => setOpen('locations')}
          className="absolute"
          style={{ left: 197, top: 675, width: 139, height: 117, borderRadius: 14, background: 'transparent' }}
        />

        {/* ===== 弹窗 ===== */}
        {open && (
          <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="relative w-[330px] rounded-[14px] overflow-hidden shadow-2xl">
              <div
                className={`${bagel400.className} flex items-center justify-center`}
                style={{
                  height: 48,
                  background: '#BF4F26',
                  color: '#FFFFFF',
                  fontSize: 24,
                  lineHeight: '32px',
                }}
              >
                {MODAL[open].title}
              </div>
              <div
                className={`${dongle700.className} p-4 text-center`}
                style={{
                  background: '#4D688C',
                  color: '#FFFFFF',
                  fontSize: 18,
                  lineHeight: '24px',
                }}
              >
                {MODAL[open].body}
              </div>

              <button
                onClick={() => setOpen(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 text-white"
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
