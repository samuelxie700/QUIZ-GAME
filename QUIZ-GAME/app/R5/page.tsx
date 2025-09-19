'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dongle, Bagel_Fat_One } from 'next/font/google';

const dongle700 = Dongle({ subsets: ['latin'], weight: '700' });
const dongle300 = Dongle({ subsets: ['latin'], weight: '300' }); // ✅ motto 18px
const bagel400  = Bagel_Fat_One({ subsets: ['latin'], weight: '400' });

type ModalKey =
  | 'main'
  | 'baseCamp'
  | 'personality'
  | 'rect180'
  | 'rect181'
  | 'rect182';

const MODAL: Record<ModalKey, { title: string; body: string }> = {
  main: {
    title: 'Creative Innovator',
    body:
      'You bring a laid-back approach to a vibrant city filled with artistic expression. Enjoying the creative energy around you, you find inspiration in local culture while maintaining a balanced life that includes plenty of downtime for relaxation and self-care.',
  },
  baseCamp: {
    title: 'Base Camp',
    body: 'Big and Creative City Person.',
  },
  personality: {
    title: 'Personality',
    body: 'Relaxed Person.',
  },
  rect180: {
    title: 'Lucky Charm',
    body: 'Able to note down any on the spot inspiration immediately.',
  },
  rect181: {
    title: 'Partner',
    body: 'City Visionary',
  },
  rect182: {
    title: 'Locations',
    body: 'Art-rich neighborhoods, cozy studios, and quiet cafés where inspiration flows and you can unwind.',
  },
};

// —— 与 R1/R2/R3 一致：只留字母/数字/空格，最多 8 词
function sanitizeToEightWords(s: string) {
  const cleaned = (s || '')
    .replace(/[“”"‘’'`.,!?;:|/\\(){}\[\]<>~@#$%^&*_+=-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(Boolean);
  return words.slice(0, 8).join(' ');
}

export default function PageR5() {
  const [open, setOpen] = useState<ModalKey | null>(null);

  // ✅ Locations motto：从 /api/location 获取，失败用本地或默认
  const [motto, setMotto] = useState('');
  const [loading, setLoading] = useState(true);

  // 可选：把 quiz 的答案也发给接口（与 R1 系列一致）
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
        // 先读本地兜底，避免首屏空白
        const cached = typeof window !== 'undefined' ? localStorage.getItem('locMotto') || '' : '';
        if (cached) setMotto(cached);

        // 与 R1 一致：POST /api/location
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
        console.error('[r5] location api failed:', e);
        if (!motto) setMotto('Explore, learn and thrive');
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answersPayload]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div
        className="relative w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden"
        style={{ background: '#F2D9BB' }}
      >
        {/* 顶部大标题 */}
        <div className="absolute left-[29px] top-[40px] w-[316px] h-[32px] flex items-center justify-center">
          <h1 className={`${dongle700.className} text-[24px] leading-[32px] font-bold text-[#4D688C] text-center`}>
            You are a...!
          </h1>
        </div>

        {/* 人物图 */}
        <div className="absolute left-[79px] top-[79px] w-[217px] h-[217px]">
          <img
            src="/R5/person.png"
            alt="Creative Innovator"
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* 三个短词 */}
        <div className={`${dongle700.className} absolute left-[115px] top-[299px]`}>
          <span className="text-[20px] leading-[20px] font-bold text-[#4D688C]">Chill</span>
        </div>
        <div className={`${dongle700.className} absolute left-[161px] top-[299px]`}>
          <span className="text-[20px] leading-[20px] font-bold text-[#F2A25C]">Inspiring</span>
        </div>
        <div className={`${dongle700.className} absolute left-[233px] top-[299px]`}>
          <span className="text-[20px] leading-[20px] font-bold text-[#152840]">Flexible</span>
        </div>

        {/* 大卡片 */}
        <div className="absolute left-[38px] top-[329px] w-[299px] h-[42px] bg-[#4D688C] rounded-t-[14px]">
          <div className={`${bagel400.className} absolute left-[46px] top-[5px] text-white text-[24px] leading-[32px]`}>
            Creative Innovator
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen('main')}
          className="absolute left-[38px] top-[371px] w-[299px] h-[130px] bg-[#F2A25C] rounded-b-[14px]"
        >
          <div
            className={`${dongle700.className} absolute left-[9px] top-[5px] text-white text-[20px] leading-[20px] font-bold text-center`}
            style={{ width: 280, height: 120 }}
          >
            {MODAL.main.body}
          </div>
        </button>

        {/* 左侧小卡 Base Camp */}
        <button
          type="button"
          onClick={() => setOpen('baseCamp')}
          className="absolute left-[38px] top-[511px] w-[139px] h-[53px] bg-[#4D688C] rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute left-[29px] top-[5px] text-white text-[16px] leading-[32px]`}>
            Base Camp
          </div>
          <div
            className={`${dongle700.className} absolute left-[5px] top-[34px] text-white text-[15px] leading-[14px] font-bold text-center`}
            style={{ width: 129, height: 14 }}
          >
            Big and Creative City Person
          </div>
        </button>

        {/* 右侧小卡 Personality */}
        <button
          type="button"
          onClick={() => setOpen('personality')}
          className="absolute left-[197px] top-[511px] w-[140px] h-[53px] bg-[#F2A25C] rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute left-[26px] top-[5px] text-white text-[16px] leading-[32px]`}>
            Personality
          </div>
          <div className={`${dongle700.className} absolute left-[30px] top-[34px] text-white text-[16px] leading-[14px] font-bold text-center`}>
            Relaxed Person
          </div>
        </button>

        {/* Lucky Charm 卡片 */}
        <button
          type="button"
          onClick={() => setOpen('rect180')}
          className="absolute left-[38px] top-[574px] w-[299px] h-[91px] bg-white rounded-[14px]"
        >
          <img src="/R5/note.png" alt="note" className="absolute left-[9px] top-[8px] w-[76px] h-[76px]" />
          {/* Lucky Charm 双色 */}
          <div
            className={`${bagel400.className} absolute left-[141px] top-[5px] flex items-center justify-center whitespace-nowrap`}
            style={{ width: 98, height: 19 }}
          >
            <span className="text-[16px] leading-[32px]" style={{ color: '#4D688C' }}>Lucky&nbsp;</span>
            <span className="text-[16px] leading-[32px]" style={{ color: '#F2A25C' }}>Charm</span>
          </div>
          <div
            className={`${dongle700.className} absolute left-[91px] top-[37px] text-[#4D688C] text-[20px] leading-[20px] font-bold text-center`}
            style={{ width: 198, height: 40 }}
          >
            Able to note down any on the spot inspiration immediately.
          </div>
        </button>

        {/* Partner 卡片 */}
        <button
          type="button"
          onClick={() => setOpen('rect181')}
          className="absolute left-[38px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute left-[40px] top-[5px] text-[16px] leading-[32px]`} style={{ color: '#4D688C' }}>
            Partner
          </div>
          <img src="/R5/head.png" alt="head" className="absolute left-[33px] top-[29px] w-[72px] h-[72px]" />
          {/* City Visionary 文本 */}
          <div className={`${dongle700.className} absolute text-center`} style={{ left: 7, top: 94, width: 129, height: 14, color: '#4D688C' }}>
            <span className="text-[16px] leading-[14px] font-bold">City Visionary</span>
          </div>
        </button>

        {/* Locations 卡片（API motto，Dongle 18px） */}
        <button
          type="button"
          onClick={() => setOpen('rect182')}
          className="absolute left-[197px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute left-[26px] top-[5px] text-[#4D688C] text-[16px] leading-[32px]`}>
            Locations
          </div>
          <div
            className={`${dongle300.className} absolute left-[12px] right-[12px] top-[44px] text-center`}
            style={{ fontSize: 18, lineHeight: '22px', color: '#4D688C', wordBreak: 'break-word' }}
          >
            {loading ? 'Loading your motto...' : (motto || 'Explore, learn and thrive')}
          </div>
        </button>

        {/* 弹窗 */}
        {open && (
          <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="relative w-[330px] rounded-[14px] overflow-hidden shadow-2xl">
              <div className={`${bagel400.className} h-[48px] bg-[#4D688C] text-white text-[24px] leading-[32px] flex items-center justify-center`}>
                {MODAL[open].title}
              </div>
              <div className={`${dongle700.className} bg-[#F2A25C] text-white p-4 text-[18px] leading-[24px] text-center`}>
                {MODAL[open].body}
              </div>
              <button onClick={() => setOpen(null)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 text-white">
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
