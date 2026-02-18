import React from 'react';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';
import './KPICards.css';

interface KPICardsProps {
  summary: {
    totalFamiliesAffected: number;
    totalDamages: number;
    criticalDSDivisions: number;
  };
}

const KPICards: React.FC<KPICardsProps> = ({ summary }) => {
  const cards = [
    {
      icon: Users,
      label: 'Total Families Affected',
      value: summary.totalFamiliesAffected.toLocaleString(),
      color: 'blue',
      trend: '+12.5%',
    },
    {
      icon: TrendingUp,
      label: 'Total Damages (LKR)',
      value: summary.totalDamages.toLocaleString(),
      color: 'violet',
      trend: null,
    },
    {
      icon: AlertTriangle,
      label: 'Critical DS Divisions',
      value: summary.criticalDSDivisions.toString(),
      color: 'red',
      trend: null,
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className={`kpi-card kpi-card--${card.color}`}>
            <div className="kpi-card-inner">
              <div className="kpi-icon-wrap">
                <Icon size={20} strokeWidth={2} />
              </div>
              <div className="kpi-info">
                <p className="kpi-label">{card.label}</p>
                <p className="kpi-value">{card.value}</p>
              </div>
            </div>
            <div className="kpi-card-glow" />
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;