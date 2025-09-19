// /lib/answers.ts

/** 读取所有答案 */
export function getAnswers(): Record<string, string> {
  if (typeof window === 'undefined') return {}; // SSR 安全
  try {
    const raw = localStorage.getItem('answers');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** 保存某个题目的答案，返回 true/false */
export function saveAnswer(qid: string, value: string): boolean {
  if (typeof window === 'undefined') return false; // SSR 安全
  try {
    const raw = localStorage.getItem('answers');
    const obj = raw ? JSON.parse(raw) : {};
    obj[qid] = value;
    localStorage.setItem('answers', JSON.stringify(obj));
    return true;
  } catch (err) {
    console.error('保存答案失败:', err);
    return false;
  }
}

/** 清空所有答案 */
export function clearAnswers(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem('answers');
    return true;
  } catch (err) {
    console.error('清空答案失败:', err);
    return false;
  }
}
