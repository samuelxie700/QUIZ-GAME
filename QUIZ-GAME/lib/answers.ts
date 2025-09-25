// lib/answers.ts

/** Storage key for all Q&A */
const STORAGE_KEY = 'answers';

/** Guard: only touch localStorage in the browser */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/** Read & parse JSON safely */
function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // ensure plain object
    return (parsed && typeof parsed === 'object') ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Stringify & write JSON safely */
function writeJSON<T>(key: string, value: T): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Public API types */
export type Answers = Record<string, string>; // e.g. { q1: 'Kangaroo Jumper', ... }

/** Get the whole answers object (empty object if none) */
export function getAnswers(): Answers {
  return readJSON<Answers>(STORAGE_KEY, {});
}

/** Get a single answer by id (e.g. 'q5'), or undefined */
export function getAnswer(id: string): string | undefined {
  const all = getAnswers();
  return all[id];
}

/**
 * Save/overwrite a single answer (e.g. id='q5', value='City Explorer').
 * Returns true on success.
 */
export function saveAnswer(id: string, value: string): boolean {
  const all = getAnswers();
  const next = { ...all, [id]: value };
  const ok = writeJSON(STORAGE_KEY, next);
  if (ok) dispatchAnswersEvent(next);
  return ok;
}

/** Merge multiple answers at once (e.g. { q1: '...', q2: '...' }) */
export function saveAnswers(partial: Answers): boolean {
  const all = getAnswers();
  const next = { ...all, ...partial };
  const ok = writeJSON(STORAGE_KEY, next);
  if (ok) dispatchAnswersEvent(next);
  return ok;
}

/** Remove one answer (returns true if write succeeded) */
export function removeAnswer(id: string): boolean {
  const all = getAnswers();
  if (!(id in all)) return true;
  const { [id]: _omit, ...rest } = all;
  const ok = writeJSON(STORAGE_KEY, rest);
  if (ok) dispatchAnswersEvent(rest);
  return ok;
}

/** Clear all stored answers */
export function clearAnswers(): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    dispatchAnswersEvent({});
    return true;
  } catch {
    return false;
  }
}

/** Optional: listen for changes in other tabs/windows */
export function onAnswersChange(handler: (answers: Answers) => void): () => void {
  if (!isBrowser()) return () => {};
  const storageListener = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) handler(getAnswers());
  };
  const customListener = (e: Event) => {
    const detail = (e as CustomEvent<Answers>).detail;
    handler(detail ?? getAnswers());
  };
  window.addEventListener('storage', storageListener);
  window.addEventListener('answers:change', customListener as EventListener);
  return () => {
    window.removeEventListener('storage', storageListener);
    window.removeEventListener('answers:change', customListener as EventListener);
  };
}

/** Fire a custom event for same-tab subscribers */
function dispatchAnswersEvent(answers: Answers) {
  if (!isBrowser()) return;
  const ev = new CustomEvent<Answers>('answers:change', { detail: answers });
  window.dispatchEvent(ev);
}

/** (Optional) Known quiz keys if you want to validate or iterate */
export const QUIZ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] as const;
export type QuizKey = typeof QUIZ_KEYS[number];
