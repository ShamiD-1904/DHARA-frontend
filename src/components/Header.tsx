import React from 'react';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-blue-950 text-white py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Dhara | National Cyclone Impact Analysis System</h1>
        <p className="text-blue-200 mt-2">Disaster Management Centre</p>
      </div>
    </header>
  );
};

export default Header;