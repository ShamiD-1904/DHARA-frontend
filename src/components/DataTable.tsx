import React, { useState } from 'react';
import './DataTable.css';

interface ImpactData {
  district: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  affectedPopulation: number;
  estimatedDamage: number;
  infrastructureDamage: string;
  evacuationStatus: string;
}

interface DataTableProps {
  data: ImpactData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<keyof ImpactData>('district');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const handleSort = (field: keyof ImpactData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = data
    .filter(item => filterRisk === 'all' || item.riskLevel === filterRisk)
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskBadgeClass = (riskLevel: string) => {
    return `risk-badge risk-${riskLevel.toLowerCase()}`;
  };

  return (
    <div className="data-table-section">
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Detailed Impact Data</h3>
          <div className="table-controls">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="impact-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('district')} className="sortable">
                  District
                  {sortField === 'district' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('riskLevel')} className="sortable">
                  Risk Level
                  {sortField === 'riskLevel' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('affectedPopulation')} className="sortable">
                  Affected Population
                  {sortField === 'affectedPopulation' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('estimatedDamage')} className="sortable">
                  Estimated Damage
                  {sortField === 'estimatedDamage' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th>Infrastructure Damage</th>
                <th>Evacuation Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((item, index) => (
                <tr key={index}>
                  <td className="district-cell">{item.district}</td>
                  <td>
                    <span className={getRiskBadgeClass(item.riskLevel)}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="number-cell">{item.affectedPopulation.toLocaleString()}</td>
                  <td className="number-cell">{formatCurrency(item.estimatedDamage)}</td>
                  <td>{item.infrastructureDamage}</td>
                  <td>
                    <span className={`status-badge status-${item.evacuationStatus.toLowerCase().replace(' ', '-')}`}>
                      {item.evacuationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p className="table-summary">
            Showing {filteredAndSortedData.length} of {data.length} districts
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataTable;