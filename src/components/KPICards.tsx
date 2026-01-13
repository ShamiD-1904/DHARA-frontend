import React from 'react';
import { Users, DollarSign, AlertTriangle } from 'lucide-react';
import './KPICards.css';

interface KPICardsProps {
  summary: {
    totalFamiliesAffected: number;
    totalDamages: number;
    criticalDSDivisions: number;
  };
}

const KPICards: React.FC<KPICardsProps> = ({ summary }) => {
  return (
    <div className="kpi-grid grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="kpi-card bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-blue-500 mr-3 kpi-icon" />
          <div>
            <p className="text-sm text-gray-600 kpi-label">Total Families Affected</p>
            <p className="text-2xl font-bold text-gray-900 kpi-value">{summary.totalFamiliesAffected.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="kpi-card bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <DollarSign className="w-8 h-8 text-blue-500 mr-3 kpi-icon" />
          <div>
            <p className="text-sm text-gray-600 kpi-label">Total Damages (LKR)</p>
            <p className="text-2xl font-bold text-gray-900 kpi-value">{summary.totalDamages.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="kpi-card bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mr-3 kpi-icon-critical" />
          <div>
            <p className="text-sm text-gray-600 kpi-label">Critical DS Divisions</p>
            <p className="text-2xl font-bold text-red-600 kpi-value-critical">{summary.criticalDSDivisions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICards;