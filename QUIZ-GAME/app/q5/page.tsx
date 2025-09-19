"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { saveAnswer, getAnswers } from "@/lib/answers";

// 给每张卡一个稳定 id，便于存储和回填
const cards = [
  { id: "surf",     img: "/quiz/q5/01_Downtown Options.png",  title: "Surf the Waves" },
  { id: "hike",     img: "/quiz/q5/02_Hike the Outback.png",  title: "Hike the Outback" },
  { id: "city",     img: "/quiz/q5/03_City Explorer.png",     title: "City Explorer" },
  { id: "wildlife", img: "/quiz/q5/04_Wildlife Watcher.png",  title: "Wildlife Watcher" },
] as const;

type CardId = typeof cards[number]["id"];
const QID = "q5";

// 映射为你希望保存在 localStorage.answers 里的值（可按需改成中文/更语义化）
const Q5_VALUE_MAP: Record<CardId, string> = {
  surf: "Surf the Waves",
  hike: "Hike the Outback",
  city: "City Explorer",
  wildlife: "Wildlife Watcher",
};

export default function DowntimePage() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const router = useRouter();

  // 便捷取当前卡片
  const current = useMemo(() => cards[index], [index]);

  // 进页时回填：如果之前答过 q5，则自动定位到该卡
  useEffect(() => {
    const a = getAnswers();
    const stored = a[QID] as string | undefined;
    if (!stored) return;
    const id = (Object.keys(Q5_VALUE_MAP) as CardId[]).find(
      (k) => Q5_VALUE_MAP[k] === stored
    );
    if (!id) return;
    const i = cards.findIndex((c) => c.id === id);
    if (i >= 0) setIndex(i);
  }, []);

  const swipe = (dir: "left" | "right") => {
    setDirection(dir);
    if (dir === "left") {
      setIndex((prev) => (prev + 1) % cards.length);
    } else {
      setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }
  };

  // 动画 variants
  const variants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "left" ? 100 : -100,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: "left" | "right") => ({
      x: dir === "left" ? -300 : 300,
      opacity: 0,
    }),
  };

  const onConfirm = () => {
    const id = current.id as CardId;
    const ok = saveAnswer(QID, Q5_VALUE_MAP[id]);
    if (!ok) {
      alert("保存失败，请重试");
      return;
    }
    router.push("/q6");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      {/* iPhone 框 */}
      <div
        className="w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden relative flex flex-col justify-between"
        style={{ background: "linear-gradient(to bottom, #f7d7b0, #d66a36)" }}
      >
        {/* 标题 */}
        <h2 className="text-center text-xl font-bold text-orange-900 mt-8 px-4">
          How will you level up during your Aussie quest downtime?
        </h2>

        {/* 滑动区 */}
        <div className="flex flex-col items-center justify-center flex-1 relative">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={current.img}
              src={current.img}
              alt={current.title}
              className="max-w-[280px] max-h-[280px] object-contain mx-auto drop-shadow-lg absolute"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(_, info) => {
                if (info.offset.x < -100) swipe("left");
                else if (info.offset.x > 100) swipe("right");
              }}
            />
          </AnimatePresence>

          {/* 标题（随卡片变化） */}
          <motion.h3
            key={current.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-bold text-orange-900 mt-72"
          >
            {current.title}
          </motion.h3>
        </div>

        {/* 确认 */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <button
            onClick={onConfirm}
            className="bg-orange-300 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:bg-orange-600 transition w-60"
          >
            Confirm
          </button>
          <p className="text-xs text-orange-800">
            Swipe to Select Card then Confirm
          </p>
        </div>
      </div>
    </main>
  );
}
