import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './ChartsSection.css';

interface ChartsSectionProps {
  chartData: { district: string; impact: number }[];
  pieData: { name: string; value: number }[];
}

const COLORS = {
  Critical: '#dc2626',
  Moderate: '#f59e0b',
  Low: '#16a34a'
};

const ChartsSection: React.FC<ChartsSectionProps> = ({ chartData, pieData }) => {
  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3 className="chart-title">Impact by District</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="impact" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="chart-card">
        <h3 className="chart-title">Damage Severity Distribution</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;