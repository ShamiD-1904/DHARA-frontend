import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface DynamicChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  chartType: 'bar' | 'line' | 'area' | 'pie';
}

const DynamicChart: React.FC<DynamicChartProps> = ({ data, xKey, yKey, chartType }) => {
  if (!data || data.length === 0) {
    return <div className="w-full h-64 flex items-center justify-center text-gray-500">Data Not Recognized</div>;
  }

  return (
    <div className="w-full h-full p-2">
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'bar' && (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} fill="#3b82f6" />
          </BarChart>
        )}

        {chartType === 'line' && (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yKey} stroke="#3b82f6" />
          </LineChart>
        )}

        {chartType === 'area' && (
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={yKey} fill="#bfdbfe" stroke="#3b82f6" />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicChart;
