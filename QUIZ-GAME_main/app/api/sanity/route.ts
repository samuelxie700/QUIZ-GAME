import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export const runtime = 'nodejs'; // ensure Node (not edge) for firebase-admin

export async function GET() {
  try {
    const sanity = adminDb.collection('sanity_check');
    const wref = await sanity.add({ ok: true, ts: Date.now() });
    const r = await wref.get();
    // Logs in your server console:
    console.log('Sanity doc exists:', r.exists, 'id:', wref.id);
    return NextResponse.json({ ok: true, exists: r.exists, id: wref.id });
  } catch (e) {
    console.error('Sanity write/read failed:', e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
