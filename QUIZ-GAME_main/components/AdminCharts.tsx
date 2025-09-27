'use client';

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { useMemo, type ComponentType } from 'react';
import type { LegendProps } from 'recharts';

/** Exported so app/admin/page.tsx can import it */
export type PersonaName =
  | 'City Visionary'
  | 'Adventurous Scholar'
  | 'Dynamic Explorer'
  | 'Creative Innovator'
  | 'Focused Scholar'
  | 'Balanced Adventurer'
  | 'Nature-Loving Learner'
  | 'Mindful Learner';

type Props = {
  personas: Record<PersonaName, number>;
};

const COLORS = ['#152840', '#4D688C', '#F2A25C', '#BF4F26', '#2B3A4B', '#90A4B9', '#F5C08E', '#C7724D'];

/** TS-friendly wrapper for Recharts Legend */
const LegendComponent = Legend as unknown as ComponentType<Partial<LegendProps>>;

export default function AdminCharts({ personas }: Props) {
  // Convert the counts object → arrays for charts
  const pieData = useMemo(
    () =>
      (Object.entries(personas) as Array<[PersonaName, number]>)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
    [personas]
  );

  const barData = useMemo(
    () => pieData.map(d => ({ persona: d.name, count: d.value })),
    [pieData]
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Personas pie */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Persona distribution</h2>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={110} label>
                {pieData.map((entry, idx) => (
                  <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <LegendComponent />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Personas bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Persona counts</h2>
        <div style={{ width: '100%', height: 360 }}>
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="persona" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <LegendComponent />
              <Bar dataKey="count" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
