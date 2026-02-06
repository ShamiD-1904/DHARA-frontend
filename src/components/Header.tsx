import React from 'react';
import './Header.css';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-content">
          <h1 className="header-title">Dhara</h1>
          <div className="header-divider"></div>
          <p className="header-subtitle">National Cyclone Impact Analysis System</p>
        </div>
        <p className="header-org">Disaster Management Centre</p>
      </div>
    </header>
  );
};

export default Header;