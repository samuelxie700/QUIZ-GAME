'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dongle, Bagel_Fat_One } from 'next/font/google';

const dongle700 = Dongle({ subsets: ['latin'], weight: '700' });
const dongle300 = Dongle({ subsets: ['latin'], weight: '300' }); // motto 18px
const bagel400  = Bagel_Fat_One({ subsets: ['latin'], weight: '400' });

type ModalKey = 'main' | 'baseCamp' | 'personality' | 'luckyCharm' | 'partner' | 'locations';

const MODAL: Record<ModalKey, { title: string; body: string }> = {
  main: {
    title: 'City Visionary',
    body:
      'You thrive in vibrant urban settings where creativity and innovation collide. This bustling environment fuels your academic pursuits, providing endless inspiration and networking opportunities. Embrace the energy of the city while diving deep into your studies!',
  },
  baseCamp: { title: 'Base Camp', body: 'Big and Creative City Life' },
  personality: { title: 'Personality', body: 'Serious Study Person' },
  luckyCharm: { title: 'Lucky Charm', body: 'You have everything prepared in hand and ready to use.' },
  partner: { title: 'Partner', body: 'Creative Leaner' },
  locations: { title: 'Locations', body: '' },
};

// 客户端兜底清洗：只留字母/数字/空格，最多 8 词
function sanitizeToEightWords(s: string) {
  const cleaned = (s || '')
    .replace(/[“”"‘’'`.,!?;:|/\\(){}\[\]<>~@#$%^&*_+=-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(Boolean);
  return words.slice(0, 8).join(' ');
}

export default function PageR1() {
  const [open, setOpen] = useState<ModalKey | null>(null);
  const [motto, setMotto] = useState<string>('');         // 动态生成 motto
  const [loading, setLoading] = useState(true);

  // 可把 quiz 的答案也一并发给 API（如果你已经存在 localStorage）
  const answersPayload = useMemo(() => {
    try {
      const raw = localStorage.getItem('answers');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        const avatar = localStorage.getItem('avatar') || 'unknown';

        // cache-busting：防止中间层缓存（方案 A 需要每次都新鲜）
        const url = `/api/location?t=${Date.now()}`;

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // 这里可以加上你收集到的所有答题项
          body: JSON.stringify({ avatar, answers: answersPayload }),
          signal: controller.signal,
        });

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }
        const data = (await resp.json()) as { motto?: string };

        const safe = sanitizeToEightWords(data?.motto || '');
        setMotto(safe || 'Explore, learn and thrive');
      } catch (err) {
        console.error('[r1] location api failed:', err);
        setMotto('Explore, learn and thrive');
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [answersPayload]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div
        className="relative w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden"
        style={{ background: '#F2D9BB' }}
      >
        {/* Top Title */}
        <div className="absolute left-[29px] top-[40px] w-[316px] h-[32px] flex items-center justify-center">
          <h1 className={`${dongle700.className} text-[24px] leading-[32px] font-bold text-[#4D688C] text-center`}>
            You are a...!
          </h1>
        </div>

        {/* Main Character */}
        <div className="absolute left-[79px] top-[79px] w-[217px] h-[217px]">
          <img
            src="/r1/City_Visionary.png"
            alt="City_Visionary"
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Three keywords */}
        <div className={`${dongle700.className} absolute left-[75px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#4D688C]">Resilient</span>
        </div>
        <div className={`${dongle700.className} absolute left-[155px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#F2A25C]">Resourceful</span>
        </div>
        <div className={`${dongle700.className} absolute left-[250px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#152840]">Focused</span>
        </div>

        {/* Main Description Card */}
        <div className="absolute left-[38px] top-[329px] w-[299px] h-[42px] bg-[#4D688C] rounded-t-[14px]">
          <div className={`${bagel400.className} absolute left-[75px] top-[5px] text-white text-[24px] leading-[32px]`}>
            City Visionary
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen('main')}
          className="absolute left-[38px] top-[371px] w-[299px] h-[130px] bg-[#F2A25C] rounded-b-[14px]"
        >
          <div className={`${dongle700.className} text-white text-[18px] leading-[22px] font-bold text-center px-3`}>
            {MODAL.main.body}
          </div>
        </button>

        {/* Base Camp */}
        <button
          type="button"
          onClick={() => setOpen('baseCamp')}
          className="absolute left-[38px] top-[511px] w-[139px] h-[53px] bg-[#4D688C] rounded-[14px]"
        >
          <div className={`${bagel400.className} text-white text-[16px] leading-[24px] text-center`}>Base Camp</div>
          <div className={`${dongle700.className} text-white text-[14px] leading-[20px] font-bold text-center`}>
            Big and Creative City Life
          </div>
        </button>

        {/* Personality */}
        <button
          type="button"
          onClick={() => setOpen('personality')}
          className="absolute left-[197px] top-[511px] w-[140px] h-[53px] bg-[#F2A25C] rounded-[14px]"
        >
          <div className={`${bagel400.className} text-white text-[16px] leading-[24px] text-center`}>Personality</div>
          <div className={`${dongle700.className} text-white text-[14px] leading-[20px] font-bold text-center`}>
            Serious Study Person
          </div>
        </button>

        {/* Lucky Charm */}
        <button
          type="button"
          onClick={() => setOpen('luckyCharm')}
          className="absolute left-[38px] top-[574px] w-[299px] h-[91px] bg-white rounded-[14px]"
        >
          <img src="/r1/IMG_1149.png" alt="Lucky Charm" className="absolute left-[9px] top-[8px] w-[76px] h-[76px]" />
          <div className={`${bagel400.className} absolute left-[141px] top-[5px] flex items-center whitespace-nowrap`}>
            <span className="text-[16px]" style={{ color: '#4D688C' }}>
              Lucky&nbsp;
            </span>
            <span className="text-[16px]" style={{ color: '#F2A25C' }}>
              Charm
            </span>
          </div>
          <div
            className={`${dongle700.className} absolute left-[91px] top-[37px] text-[#4D688C] text-[18px] leading-[16px] font-bold text-center`}
            style={{ width: 198 }}
          >
            You have everything prepared in hand and ready to use.
          </div>
        </button>

        {/* Partner */}
        <button
          type="button"
          onClick={() => setOpen('partner')}
          className="absolute left-[38px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute left-[40px] top-[2px] text-[16px] leading-[32px]`} style={{ color: '#4D688C' }}>
            Partner
          </div>
          <img src="/r1/IMG_1134.png" alt="Partner" className="absolute left-[30px] top-[25px] w-[80px] h-[80px]" />
          <div className={`${dongle700.className} absolute text-center text-[14px] font-bold`} style={{ left: 7, top: 95, width: 129, color: '#4D688C' }}>
            Creative Leaner
          </div>
        </button>

        {/* Locations（动态 motto） */}
        <button
          type="button"
          onClick={() => setOpen('locations')}
          className="absolute left-[197px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute left-[30px] top-[2px] text-[#4D688C] text-[16px] leading-[32px]`}>Locations</div>

          <div
            className={`${dongle300.className} absolute left-[12px] right-[12px] top-[40px] text-center`}
            style={{ fontSize: 18, lineHeight: '22px', color: '#4D688C', wordBreak: 'break-word' }}
          >
            {loading ? 'Generating...' : motto}
          </div>
        </button>

        {/* Modal */}
        {open && (
          <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="relative w-[330px] rounded-[14px] overflow-hidden shadow-2xl">
              <div className={`${bagel400.className} h-[48px] bg-[#4D688C] text-white text-[24px] leading-[32px] flex items-center justify-center`}>
                {MODAL[open].title}
              </div>
              <div className={`${dongle700.className} bg-[#F2A25C] text-white p-4 text-[18px] leading-[24px] text-center`}>{MODAL[open].body}</div>
              <button onClick={() => setOpen(null)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 text-white" aria-label="Close dialog">
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

