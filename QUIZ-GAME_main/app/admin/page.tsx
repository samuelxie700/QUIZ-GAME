// app/admin/page.tsx
import { Suspense } from 'react';
import AdminCharts from '@/components/AdminCharts';

// Render fresh data on each request (optional, but useful for dashboards)
export const dynamic = 'force-dynamic';

/** The 8 persona labels used across the app */
type PersonaName =
  | 'City Visionary'
  | 'Adventurous Scholar'
  | 'Dynamic Explorer'
  | 'Creative Innovator'
  | 'Focused Scholar'
  | 'Balanced Adventurer'
  | 'Nature-Loving Learner'
  | 'Mindful Learner';

/** Firestore Timestamp shape (when serialized through your API) */
type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

/** createdAt may come back as Firestore timestamp, ISO string, ms epoch, or null */
type CreatedAt = FirestoreTimestamp | string | number | null | undefined;

type Item = {
  id: string;
  answers: Record<string, string>;
  persona: PersonaName | string; // keep loose in case API returns unexpected value
  createdAt?: CreatedAt;
  meta?: Record<string, unknown>;
};

type ItemsResponse = {
  items?: Item[];
};

async function getData(): Promise<Item[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const url = `${base}/api/answers?limit=500`;

  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.ANALYTICS_API_KEY ?? ''}` },
    cache: 'no-store',
  });

  if (!r.ok) return [];
  const json = (await r.json()) as ItemsResponse;
  return json.items ?? [];
}

/** Robust formatter for different createdAt shapes */
function formatCreatedAt(input: CreatedAt): string {
  if (input == null) return '—';
  try {
    if (typeof input === 'string') {
      const d = new Date(input);
      return isNaN(d.getTime()) ? '—' : d.toLocaleString();
    }
    if (typeof input === 'number') {
      const d = new Date(input);
      return isNaN(d.getTime()) ? '—' : d.toLocaleString();
    }
    if (typeof input === 'object' && 'seconds' in input && typeof input.seconds === 'number') {
      const d = new Date(input.seconds * 1000);
      return isNaN(d.getTime()) ? '—' : d.toLocaleString();
    }
  } catch {
    // ignore malformed dates
  }
  return '—';
}

/** Initialize persona buckets */
function emptyPersonaCounts(): Record<PersonaName, number> {
  return {
    'City Visionary': 0,
    'Adventurous Scholar': 0,
    'Dynamic Explorer': 0,
    'Creative Innovator': 0,
    'Focused Scholar': 0,
    'Balanced Adventurer': 0,
    'Nature-Loving Learner': 0,
    'Mindful Learner': 0,
  };
}

export default async function AdminPage() {
  const items = await getData();

  // Aggregate personas for charts
  const personaCounts = items.reduce<Record<PersonaName, number>>((acc, it) => {
    if (it.persona in acc) {
      acc[it.persona as PersonaName] += 1;
    }
    return acc;
  }, emptyPersonaCounts());

  return (
    <main className="min-h-screen p-8 bg-neutral-100">
      <h1 className="text-2xl font-bold mb-6">Quiz Dashboard</h1>

      <Suspense fallback={<p>Loading charts…</p>}>
        <AdminCharts personas={personaCounts} />
      </Suspense>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Recent submissions</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-3 py-2">When</th>
                <th className="text-left px-3 py-2">Persona</th>
                <th className="text-left px-3 py-2">q1–q7</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 25).map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="px-3 py-2">{formatCreatedAt(it.createdAt)}</td>
                  <td className="px-3 py-2">{it.persona}</td>
                  <td className="px-3 py-2">
                    {(['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] as const)
                      .map((k) => it.answers?.[k] ?? '—')
                      .join(' | ')}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-neutral-500" colSpan={3}>
                    No data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
