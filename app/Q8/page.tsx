"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const msg = "I wonder where you will go?";
  const [mounted, setMounted] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000 + 3000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* 背景图片 */}
        <img
          src="/Q8/Background.png"
          alt="Gathering results"
          style={{
            maxHeight: "100vh",
            width: "auto",
            display: "block",
            borderRadius: 8,
          }}
        />

        {/* 动态文字 */}
        {mounted && (
          <p
            className="line"
            aria-label={msg}
            style={{
              position: "absolute",
              bottom: "46%",
              left: "18%",
              transform: "translateX(-50%)",
              margin: 0,
              textAlign: "center",
            }}
          >
            {msg.split("").map((ch, i) => (
              <span
                key={i}
                className="char"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </p>
        )}

        {/* 按钮：只有 showButton === true 才显示 */}
        {showButton && (
          <button
            className="reveal-btn"
            onClick={() => alert("You clicked the button!")}
          >
            Click to Find out!
          </button>
        )}
      </div>

      <style jsx>{`
        /* 动态文字 */
        .line {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          opacity: 0;
          transform: translateY(8px);
          animation: fadeInUp 900ms ease forwards 3000ms; /* 延迟3秒出现 */
          user-select: none;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }
        .char {
          display: inline-block;
          animation: wiggle 1400ms ease-in-out infinite;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-2px) rotate(-1deg);
          }
        }

        /* 按钮初始效果 */
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
          animation: buttonReveal 800ms ease forwards,
            buttonShake 600ms ease 800ms; /* 出现后再抖动一次 */
        }
        .reveal-btn:hover {
          background-color: #5a799e;
          transform: translateX(-50%) scale(1.05);
        }

        /* 按钮浮现 */
        @keyframes buttonReveal {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* 抖动动画（只执行一次） */
        @keyframes buttonShake {
          0% {
            transform: translateX(-50%) rotate(0deg);
          }
          25% {
            transform: translateX(-50%) rotate(3deg);
          }
          50% {
            transform: translateX(-50%) rotate(-3deg);
          }
          75% {
            transform: translateX(-50%) rotate(2deg);
          }
          100% {
            transform: translateX(-50%) rotate(0deg);
          }
        }
      `}</style>
    </main>
  );
}
