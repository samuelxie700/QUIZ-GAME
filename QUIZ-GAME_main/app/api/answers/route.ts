// app/api/answers/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { datastore } from '@/lib/datastore/admin';

export const runtime = 'nodejs';

const KIND = 'quiz_submissions';

const AnswerSchema = z.object({
  answers: z.record(z.string(), z.string()),
  persona: z.string(),
  meta: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = AnswerSchema.parse(body);

    const key = datastore.key([KIND]); // auto id
    const entity = {
      key,
      data: [
        { name: 'answers', value: parsed.answers, excludeFromIndexes: true },
        { name: 'persona', value: parsed.persona },
        { name: 'meta', value: parsed.meta ?? {}, excludeFromIndexes: true },
        { name: 'createdAt', value: new Date() },
      ],
    };

    await datastore.save(entity);
    return NextResponse.json({ ok: true, id: String(key.id || key.name) });
  } catch (err) {
    console.error('POST /api/answers error', err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limitParam = Number(url.searchParams.get('limit') ?? '100');
  const capped = Math.max(1, Math.min(isFinite(limitParam) ? limitParam : 100, 1000));

  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token || token !== (process.env.ANALYTICS_API_KEY ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const query = datastore
      .createQuery(KIND)
      .order('createdAt', { descending: true })
      .limit(capped);

    const [entities] = await datastore.runQuery(query);

    // Types to access the symbol and strip it safely
    type DSKeyProp = typeof datastore.KEY;
    type WithKey = { [K in DSKeyProp]: { id?: string; name?: string } };

    const keySymbolAsProp: PropertyKey = datastore.KEY as unknown as PropertyKey;

    const items = entities.map((e) => {
      const withKey = e as WithKey;
      const key = withKey[datastore.KEY];
      const id = String(key.id ?? key.name ?? '');

      // clone and remove the symbol-keyed property (no unused var, no `any`)
      const data = { ...(e as Record<string, unknown>) } as Record<PropertyKey, unknown>;
      delete data[keySymbolAsProp];

      // cast keys back to string index for the response shape
      return { id, ...(data as Record<string, unknown>) };
    });

    return NextResponse.json({ items });
  } catch (err) {
    console.error('GET /api/answers error', err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
