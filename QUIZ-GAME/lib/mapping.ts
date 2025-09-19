// 头像清单（图片放在 public/avatars/ 下）
export const AVATARS = [
  { id: "a1", src: "/avatars/a1.png", alt: "avatar 1" },
  { id: "a2", src: "/avatars/a2.png", alt: "avatar 2" },
  { id: "a3", src: "/avatars/a3.png", alt: "avatar 3" },
  { id: "a4", src: "/avatars/a4.png", alt: "avatar 4" },
  { id: "a5", src: "/avatars/a5.png", alt: "avatar 5" },
  { id: "a6", src: "/avatars/a6.png", alt: "avatar 6" },
  { id: "a7", src: "/avatars/a7.png", alt: "avatar 7" },
  { id: "a8", src: "/avatars/a8.png", alt: "avatar 8" },
];

// 头像 → 海报 slug（图片放 public/posters/，如 /posters/a1a1.png）
export const AVATAR_TO_POSTER: Record<string, string> = {
  a1: "a1a1",
  a2: "a2a2",
  a3: "a3a3",
  a4: "a4a4",
  a5: "a5a5",
  a6: "a6a6",
  a7: "a7a7",
  a8: "a8a8",
};

// 头像 → 结果页面路由（与 app 目录大小写一致：R5/R6 大写）
export const AVATAR_TO_RESULT: Record<string, string> = {
  a1: "/r8",
  a2: "/r7",
  a3: "/R6",
  a4: "/R5",
  a5: "/r4",
  a6: "/r3",
  a7: "/r2",
  a8: "/r1",
};
