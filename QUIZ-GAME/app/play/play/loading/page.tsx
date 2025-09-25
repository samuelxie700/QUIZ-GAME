'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { computePersona } from '@/lib/scoring';
import type { Persona } from '@/lib/scoring';

// Map persona → result route folder
const PERSONA_TO_RESULT: Record<Persona, string> = {
  'City Visionary': 'r1',
  'Adventurous Scholar': 'r2',
  'Dynamic Explorer': 'r3',
  'Creative Innovator': 'r4',
  'Focused Scholar': 'r5',
  'Balanced Adventurer': 'r6',
  'Nature-Loving Learner': 'r7',
  'Mindful Learner': 'r8',
};

export default function Page() {
  const router = useRouter();
  const msg = 'I wonder where you will go?';
  const [mounted, setMounted] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowButton(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  // When the reveal button appears, wire it to compute → route
  useEffect(() => {
    if (!showButton) return;
    const btn = document.querySelector<HTMLButtonElement>('.reveal-btn');
    if (!btn) return;

    const handler = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation?.();

      // 1) read answers
      let answers: Record<string, string> = {};
      try {
        answers = JSON.parse(localStorage.getItem('answers') || '{}');
      } catch {}

      // 2) compute persona
      const persona = computePersona(answers);

      // 3) persist persona (optional)
      try {
        localStorage.setItem('persona', persona);
      } catch {}

      // 4) route to the correct result page
      const slug = PERSONA_TO_RESULT[persona] ?? 'r8';

      // Navigate
      router.push(`/result/${slug}`);
    };

    btn.addEventListener('click', handler, { once: true });
    return () => btn.removeEventListener('click', handler);
  }, [showButton, router]);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src="/Q8/Background.png"
          alt="Gathering results"
          style={{ maxHeight: '100vh', width: 'auto', display: 'block', borderRadius: 8 }}
        />

        {mounted && (
          <p
            className="line"
            aria-label={msg}
            style={{
              position: 'absolute',
              bottom: '46%',
              left: '18%',
              transform: 'translateX(-50%)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            {msg.split('').map((ch, i) => (
              <span key={i} className="char" style={{ animationDelay: `${i * 0.06}s` }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </p>
        )}

        {showButton && <button className="reveal-btn">Click to Find out!</button>}
      </div>

      <style jsx>{`
        .line {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          opacity: 0;
          transform: translateY(8px);
          animation: fadeInUp 900ms ease forwards 3000ms;
          user-select: none;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }
        .char {
          display: inline-block;
          animation: wiggle 1400ms ease-in-out infinite;
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(-1deg); }
        }
        .reveal-btn {
          position: absolute;
          bottom: 15%;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 24px;
          background-color: #4d688c;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          opacity: 0;
          animation: buttonReveal 800ms ease forwards, buttonShake 600ms ease 800ms;
        }
        .reveal-btn:hover {
          background-color: #5a799e;
          transform: translateX(-50%) scale(1.05);
        }
        @keyframes buttonReveal {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes buttonShake {
          0%   { transform: translateX(-50%) rotate(0deg); }
          25%  { transform: translateX(-50%) rotate(3deg); }
          50%  { transform: translateX(-50%) rotate(-3deg); }
          75%  { transform: translateX(-50%) rotate(2deg); }
          100% { transform: translateX(-50%) rotate(0deg); }
        }
      `}</style>
    </main>
  );
}
