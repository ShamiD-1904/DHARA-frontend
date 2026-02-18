import React, { useMemo, useState } from 'react';
import './DataTable.css';

interface DataTableProps {
  data: Record<string, any>[];
  rowsDisplayed?: number;
  onShowMore?: () => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, rowsDisplayed = 15, onShowMore }) => {
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const allKeys = useMemo(() => {
    const keys = new Set<string>();
    (data || []).forEach(row => Object.keys(row || {}).forEach(k => keys.add(k)));
    // exclude date-like columns from the table
    return Array.from(keys).filter(k => !/\bdate\b/i.test(k));
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(item => (filterRisk === 'all' || item.riskLevel === filterRisk));
  }, [data, filterRisk]);

  const filteredAndSortedData = useMemo(() => {
    const arr = [...filteredData];
    if (!sortField) return arr;
    arr.sort((a: any, b: any) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const aNum = typeof aValue === 'number';
      const bNum = typeof bValue === 'number';
      if (aNum && bNum) return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      const aStr = aValue == null ? '' : String(aValue);
      const bStr = bValue == null ? '' : String(bValue);
      return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
    return arr;
  }, [filteredData, sortField, sortDirection]);

  // Slice data for pagination
  const paginatedData = useMemo(() => {
    return filteredAndSortedData.slice(0, rowsDisplayed);
  }, [filteredAndSortedData, rowsDisplayed]);

  const hasMoreRows = filteredAndSortedData.length > rowsDisplayed;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="data-table-section">
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Detailed Impact Data</h3>
          <div className="table-controls">
            {allKeys.includes('riskLevel') && (
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
            )}
          </div>
        </div>

        <div className="table-container">
          <table className="impact-table">
            <thead>
              <tr>
                {allKeys.map((k) => (
                  <th key={k} onClick={() => handleSort(k)} className="sortable">
                    {k}
                    {sortField === k && (
                      <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  {allKeys.map((k) => {
                    const v = item[k];
                    const isNumber = typeof v === 'number';
                    // render badges for known semantic keys
                    if (k === 'riskLevel') {
                      return (
                        <td key={k}><span className={`risk-badge risk-${String(v).toLowerCase()}`}>{String(v)}</span></td>
                      );
                    }
                    if (k === 'evacuationStatus') {
                      return (
                        <td key={k}><span className={`status-badge status-${String(v).toLowerCase().replace(/\s+/g,'-')}`}>{String(v)}</span></td>
                      );
                    }
                    if (isNumber) {
                      // format damage-like fields as currency
                      const lower = k.toLowerCase();
                      return (
                        <td key={k} className="number-cell">{lower.includes('damage') || lower.includes('estimated') ? formatCurrency(v) : Number(v).toLocaleString()}</td>
                      );
                    }
                    return <td key={k}>{v == null ? '' : String(v)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {/*
              <tr>
                {allKeys.map((k) => {
                  const allVals = filteredAndSortedData.map(r => r[k]).filter(v => typeof v === 'number');
                  if (allVals.length === 0) return <td key={k}></td>;
                  const sum = allVals.reduce((s: number, n: number) => s + n, 0);
                  const lower = k.toLowerCase();
                  return <td key={k} className="number-cell" style={{ fontWeight: 700 }}>{lower.includes('damage') || lower.includes('estimated') ? formatCurrency(sum) : sum.toLocaleString()}</td>;
                })}
              </tr>
*/}
            </tfoot>
          </table>
        </div>

        <div className="table-footer">
          <p className="table-summary">
            Showing {paginatedData.length} of {filteredAndSortedData.length} rows
          </p>
          {hasMoreRows && onShowMore && (
            <button 
              onClick={onShowMore}
              className="show-more-btn"
            >
              Show More ({filteredAndSortedData.length - rowsDisplayed} remaining)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;