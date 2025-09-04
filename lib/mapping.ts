// 头像清单（文件必须在 public/avatars/ 下）
export const AVATARS = [
  { id: 'a1', src: '/avatars/a1.png', alt: 'avatar 1' },
  { id: 'a2', src: '/avatars/a2.png', alt: 'avatar 2' },
  { id: 'a3', src: '/avatars/a3.png', alt: 'avatar 3' },
  { id: 'a4', src: '/avatars/a4.png', alt: 'avatar 4' },
  { id: 'a5', src: '/avatars/a5.png', alt: 'avatar 5' },
  { id: 'a6', src: '/avatars/a6.png', alt: 'avatar 6' },
  { id: 'a7', src: '/avatars/a7.png', alt: 'avatar 7' },
  { id: 'a8', src: '/avatars/a8.png', alt: 'avatar 8' }
];

// 头像 → 海报页面 slug 的映射
// 例如 a1 → a1a1（则海报文件为 public/posters/a1a1.png）
export const AVATAR_TO_POSTER: Record<string, string> = {
  a1: 'a1a1',
  a2: 'a2a2',
  a3: 'a3a3',
  a4: 'a4a4',
  a5: 'a5a5',
  a6: 'a6a6',
  a7: 'a7a7',
  a8: 'a8a8'
};
