import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import './ChartsSection.css';

interface ChartsSectionProps {
  chartData?: { district: string; impact: number }[];
  pieData?: { name: string; value: number }[];
  aggregatedData?: Record<string, any>[];
  xKey?: string;
  yKey?: string;
  chartType?: 'bar' | 'line' | 'area' | 'pie';
}

const ACCENT_COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#6366F1', '#F97316'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="chart-tooltip-value" style={{ color: p.color || '#60A5FA' }}>
          {p.name}: {Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const ChartsSection: React.FC<ChartsSectionProps> = ({ chartData = [], pieData = [], aggregatedData, xKey, yKey, chartType = 'bar' }) => {
  const barData = aggregatedData && aggregatedData.length > 0 && xKey && yKey ? aggregatedData : chartData;

  const pie = (() => {
    if (aggregatedData && aggregatedData.length > 0 && xKey && yKey) {
      const sorted = [...aggregatedData].sort((a: any, b: any) => Number(b[yKey] ?? 0) - Number(a[yKey] ?? 0));
      return sorted.slice(0, 10).map((t: any) => ({ name: t[xKey], value: Number(t[yKey] ?? 0) }));
    }
    if (pieData && pieData.length > 0) return pieData;
    if (!barData || barData.length === 0) return [];
    const sorted = [...barData].sort((a: any, b: any) => (b[yKey ?? 'impact'] ?? 0) - (a[yKey ?? 'impact'] ?? 0));
    return sorted.slice(0, 5).map((t: any) => ({ name: t[xKey ?? 'district'], value: Number(t[yKey ?? 'impact'] ?? 0) }));
  })();

  const mainPie = (() => {
    if (!aggregatedData || aggregatedData.length === 0 || !xKey || !yKey) return [];
    const sorted = [...aggregatedData].sort((a: any, b: any) => Number(b[yKey] ?? 0) - Number(a[yKey] ?? 0));
    return sorted.slice(0, 10).map((t: any) => ({ name: t[xKey], value: Number(t[yKey] ?? 0) }));
  })();

  const gridStyle = { stroke: 'rgba(148, 163, 184, 0.06)', strokeDasharray: '3 3' };
  const axisStyle = { fill: '#64748B', fontSize: 11, fontFamily: 'Inter' };

  const renderMainChart = () => {
    if (chartType === 'pie') {
      return (
        <PieChart>
          <Pie
            data={mainPie.length > 0 ? mainPie : pie}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {(mainPie.length > 0 ? mainPie : pie).map((_: any, index: number) => (
              <Cell key={`mp-${index}`} fill={ACCENT_COLORS[index % ACCENT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart data={barData as any[]}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={xKey ?? 'district'} tick={axisStyle} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey={yKey ?? 'impact'} stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: '#3B82F6', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2, fill: '#0a0e1a' }} />
        </LineChart>
      );
    }

    if (chartType === 'area') {
      return (
        <AreaChart data={barData as any[]}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={xKey ?? 'district'} tick={axisStyle} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey={yKey ?? 'impact'} fill="url(#areaGrad)" stroke="#3B82F6" strokeWidth={2} />
        </AreaChart>
      );
    }

    // Default: Bar
    return (
      <BarChart data={barData as any[]} barCategoryGap="20%">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey={xKey ?? 'district'} tick={axisStyle} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.06)' }} />
        <Bar dataKey={yKey ?? 'impact'} fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
      </BarChart>
    );
  };

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3 className="chart-title">Impact by {xKey ?? 'Category'}</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            {renderMainChart()}
          </ResponsiveContainer>
        </div>
      </div>
      <div className="chart-card">
        <h3 className="chart-title">Distribution Overview</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pie}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {pie.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={ACCENT_COLORS[index % ACCENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;