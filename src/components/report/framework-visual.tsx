'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface FrameworkVisualProps {
  type: 'radar' | 'bar';
  data: Record<string, number>;
  primaryColor: string;
}

export function FrameworkVisual({ type, data, primaryColor }: FrameworkVisualProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  if (type === 'radar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="rgba(128,128,128,0.2)" />
          <PolarAngleAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10 }} />
          <Radar name="Score" dataKey="value" stroke={primaryColor} fill={primaryColor} fillOpacity={0.3} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} width={80} />
        <Tooltip />
        <Bar dataKey="value" fill={primaryColor} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
