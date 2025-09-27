'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/client';
import { collection, onSnapshot } from 'firebase/firestore';

export default function LiveCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const col = collection(db, 'quiz_submissions');
    const unsub = onSnapshot(col, (snap) => setCount(snap.size));
    return () => unsub();
  }, []);

  return <p className="text-sm text-neutral-600">Live submissions: {count}</p>;
}
