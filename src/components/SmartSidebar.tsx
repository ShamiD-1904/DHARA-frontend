import React from 'react';
import { BarChart3, LineChart, AreaChart, PieChart, Layers, TrendingUp } from 'lucide-react';
import './SmartSidebar.css';

interface SmartSidebarProps {
  dimensions: string[];
  metrics: string[];
  selectedGroup?: string;
  selectedValue?: string;
  onSelectGroup: (k: string) => void;
  onSelectValue: (k: string) => void;
  chartType: 'bar' | 'line' | 'area' | 'pie';
  onChartTypeChange: (t: 'bar' | 'line' | 'area' | 'pie') => void;
}

const chartIcons = {
  bar: BarChart3,
  line: LineChart,
  area: AreaChart,
  pie: PieChart,
};

const SmartSidebar: React.FC<SmartSidebarProps> = ({
  dimensions,
  metrics,
  selectedGroup,
  selectedValue,
  onSelectGroup,
  onSelectValue,
  chartType,
  onChartTypeChange
}) => {
  return (
    <aside className="smart-sidebar">
      <div className="sidebar-card">
        <div className="sidebar-section">
          <div className="sidebar-title">
            <Layers size={14} />
            Dimensions
          </div>
          {dimensions.length === 0 ? (
            <div className="sidebar-empty">Upload data to see dimensions</div>
          ) : (
            <div className="sidebar-options">
              {dimensions.map(d => (
                <label key={d} className={`sidebar-option${selectedGroup === d ? ' active' : ''}`}>
                  <input
                    type="radio"
                    name="group"
                    className="sidebar-radio"
                    checked={selectedGroup === d}
                    onChange={() => onSelectGroup(d)}
                  />
                  <span className="sidebar-label">{d}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <div className="sidebar-title">
            <TrendingUp size={14} />
            Metrics
          </div>
          {metrics.length === 0 ? (
            <div className="sidebar-empty">Upload data to see metrics</div>
          ) : (
            <div className="sidebar-options">
              {metrics.map(m => (
                <label key={m} className={`sidebar-option${selectedValue === m ? ' active' : ''}`}>
                  <input
                    type="radio"
                    name="metric"
                    className="sidebar-radio"
                    checked={selectedValue === m}
                    onChange={() => onSelectValue(m)}
                  />
                  <span className="sidebar-label">{m}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <div className="sidebar-title">Chart Type</div>
          <div className="chart-type-buttons">
            {(['bar', 'line', 'area', 'pie'] as const).map(type => {
              const Icon = chartIcons[type];
              return (
                <button
                  key={type}
                  className={`chart-btn${chartType === type ? ' active' : ''}`}
                  onClick={() => onChartTypeChange(type)}
                  title={type.charAt(0).toUpperCase() + type.slice(1)}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SmartSidebar;
