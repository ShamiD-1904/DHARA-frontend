import React from 'react';
import { Activity } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onClear?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClear }) => {
  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-logo-section">
            <div className="header-logo-icon">
              <Activity size={22} strokeWidth={2.5} />
            </div>
            <div className="header-text-group">
              <h1 className="header-title">DHARA</h1>
              <p className="header-subtitle">Disaster & Hazard Analysis</p>
            </div>
          </div>
          <div className="header-badge">
            <span className="header-badge-dot"></span>
            Live Dashboard
          </div>
        </div>
        <div className="header-actions">
          {onClear && (
            <button className="header-clear-btn" onClick={onClear}>
              <span className="header-btn-icon">↻</span>
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="header-gradient-line"></div>
    </header>
  );
};

export default Header;