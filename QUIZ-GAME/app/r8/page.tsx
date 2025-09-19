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
  | 'luckyCharm'
  | 'partner'
  | 'locations';

const MODAL: Record<ModalKey, { title: string; body: string }> = {
  main: {
    title: 'Balanced Adventurer',
    body:
      'You know how to balance your studies with life’s adventures. Enjoying the vibrancy of city life while finding solace in nature, you create a harmonious study routine that fosters both productivity and relaxation. Your journey is as enriching as it is dynamic!',
  },
  baseCamp: { title: 'Base Camp', body: 'Mix of City and Nature' },
  personality: { title: 'Personality', body: 'Serious Study Person' },
  luckyCharm: { title: 'Lucky Charm', body: 'To be able to balance your work life and personal life.' },
  partner: { title: 'Partner', body: 'Nature-Loving Leaner' },
  locations: { title: 'Locations', body: 'Your favorite spots to explore are waiting here!' },
};

// —— 与 R1 系列一致：只留字母/数字/空格，最多 8 词
function sanitizeToEightWords(s: string) {
  const cleaned = (s || '')
    .replace(/[“”"‘’'`.,!?;:|/\\(){}\[\]<>~@#$%^&*_+=-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(Boolean);
  return words.slice(0, 8).join(' ');
}

export default function PageR8() {
  const [open, setOpen] = useState<ModalKey | null>(null);

  // ✅ Locations motto：从 /api/location 获取，失败兜底
  const [motto, setMotto] = useState('');
  const [loading, setLoading] = useState(true);

  // 可选：把 quiz 的答案也发给接口（与 R1 系列对齐）
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
        // 先读本地兜底（避免首屏空白）
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
        console.error('[r8] location api failed:', e);
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
        {/* Top Title */}
        <div className="absolute left-[29px] top-[40px] w-[316px] h-[32px] flex items-center justify-center">
          <h1 className={`${dongle700.className} text-[24px] leading-[32px] font-bold text-[#F2A25C] text-center`}>
            You are a...!
          </h1>
        </div>

        {/* Main Character */}
        <div className="absolute left-[79px] top-[79px] w-[217px] h-[217px]">
          <img
            src="/r8/Balanced_Adventurer.png"
            alt="Balanced Adventurer"
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Three keywords */}
        <div className={`${dongle700.className} absolute left-[75px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#F2A25C]">Creative</span>
        </div>
        <div className={`${dongle700.className} absolute left-[155px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#152840]">Resourceful</span>
        </div>
        <div className={`${dongle700.className} absolute left-[250px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#4D688C]">Curious</span>
        </div>

        {/* Main Description Card */}
        <div className="absolute left-[38px] top-[329px] w-[299px] h-[42px] bg-[#F2A25C] rounded-t-[14px]">
          <div className={`${bagel400.className} absolute left-[40px] top-[5px] text-white text-[24px] leading-[32px]`}>
            Balanced Adventurer
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen('main')}
          className="absolute left-[38px] top-[371px] w-[299px] h-[130px] bg-[#FFFFFF] rounded-b-[14px]"
        >
          <div className={`${dongle700.className} text-[#4D688C] text-[18px] leading-[22px] font-bold text-center px-3`}>
            {MODAL.main.body}
          </div>
        </button>

        {/* Base Camp Card */}
        <button
          type="button"
          onClick={() => setOpen('baseCamp')}
          className="absolute left-[38px] top-[511px] w-[139px] h-[53px] bg-[#F2A25C] rounded-[14px]"
        >
          <div className={`${bagel400.className} text-white text-[16px] leading-[24px] text-center`}>Base Camp</div>
          <div className={`${dongle700.className} text-white text-[14px] leading-[20px] font-bold text-center`}>Mix of City and Nature</div>
        </button>

        {/* Personality Card */}
        <button
          type="button"
          onClick={() => setOpen('personality')}
          className="absolute left-[197px] top-[511px] w-[140px] h-[53px] bg-[#FFFFFF] rounded-[14px]"
        >
          <div className={`${bagel400.className} text-[#4D688C] text-[16px] leading-[24px] text-center`}>Personality</div>
          <div className={`${dongle700.className} text-[#4D688C] text-[14px] leading-[20px] font-bold text-center`}>Serious Study Person</div>
        </button>

        {/* Lucky Charm Card */}
        <button
          type="button"
          onClick={() => setOpen('luckyCharm')}
          className="absolute left-[38px] top-[574px] w-[299px] h-[91px] bg-white rounded-[14px]"
        >
          <img src="/r8/Balance.png" alt="Lucky Charm" className="absolute left-[9px] top-[8px] w-[76px] h-[76px]" />
          <div className={`${bagel400.className} absolute left-[141px] top-[5px] flex items-center whitespace-nowrap`}>
            <span className="text-[16px]" style={{ color: '#F2A25C' }}>Lucky&nbsp;</span>
            <span className="text-[16px]" style={{ color: '#4D688C' }}>Charm</span>
          </div>
          <div className={`${dongle700.className} absolute left-[91px] top-[37px] text-[#4D688C] text-[18px] leading-[16px] font-bold text-center`} style={{ width: 198 }}>
            {MODAL.luckyCharm.body}
          </div>
        </button>

        {/* Partner Card */}
        <button
          type="button"
          onClick={() => setOpen('partner')}
          className="absolute left-[38px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]">
          <div className={`${bagel400.className} absolute left-[40px] top-[2px] text-[16px] leading-[32px]`} style={{ color: '#F2A25C' }}>
            Partner
          </div>
          <img src="/r8/Balance_Partner.png" alt="Partner" className="absolute left-[30px] top-[25px] w-[80px] h-[80px]" />
          <div className={`${dongle700.className} absolute text-center text-[14px] font-bold`} style={{ left: 7, top: 95, width: 129, color: '#F2A25C' }}>
            Nature-Loving Leaner
          </div>
        </button>

        {/* Locations Card（API motto，Dongle 18px） */}
        <button
          type="button"
          onClick={() => setOpen('locations')}
          className="absolute left-[197px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute left-[30px] top-[2px] text-[#4D688C] text-[16px] leading-[32px]`}>Locations</div>
          <div
            className={`${dongle300.className} absolute left-[12px] right-[12px] top-[44px] text-center`}
            style={{ fontSize: 18, lineHeight: '22px', color: '#4D688C', wordBreak: 'break-word' }}
          >
            {loading ? 'Loading your motto...' : (motto || 'Explore, learn and thrive')}
          </div>
        </button>

        {/* Modal */}
        {open && (
          <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="relative w-[330px] rounded-[14px] overflow-hidden shadow-2xl">
              <div className={`${bagel400.className} h-[48px] bg-[#F2A25C] text-white text-[24px] leading-[32px] flex items-center justify-center`}>
                {MODAL[open].title}
              </div>
              <div className={`${dongle700.className} bg-[#FFFFFF] text-[#4D688C] p-4 text-[18px] leading-[24px] text-center`}>
                {MODAL[open].body}
              </div>
              <button onClick={() => setOpen(null)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 text-white">×</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
