import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapSection.css';

interface DistrictData {
  district: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  affectedPopulation: number;
  estimatedDamage: number;
  latitude: number;
  longitude: number;
}

interface MapSectionProps {
  districtData: DistrictData[];
}

const MapSection: React.FC<MapSectionProps> = ({ districtData }) => {
  // Sri Lanka center coordinates
  const center: [number, number] = [7.8731, 80.7718];
  const zoom = 7;

  const getColorForRisk = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return '#10b981'; // emerald-500
      case 'Medium': return '#f59e0b'; // amber-500
      case 'High': return '#f97316'; // orange-500
      case 'Critical': return '#dc2626'; // red-600
      default: return '#6b7280'; // gray-500
    }
  };

  const getBorderColorForRisk = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return '#059669'; // emerald-600
      case 'Medium': return '#d97706'; // amber-600
      case 'High': return '#ea580c'; // orange-600
      case 'Critical': return '#b91c1c'; // red-700
      default: return '#4b5563'; // gray-600
    }
  };

  const getOpacityForRisk = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 0.4;
      case 'Medium': return 0.6;
      case 'High': return 0.7;
      case 'Critical': return 0.8;
      default: return 0.5;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="map-section">
      <div className="map-card">
        <h3 className="map-title">Impact Map - Sri Lanka</h3>
        <div className="map-container">
          <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {districtData.map((district, index) => {
              const baseRadius = 20000; // 20km base radius

              return (
                <Circle
                  key={index}
                  center={[district.latitude, district.longitude]}
                  radius={baseRadius}
                  pathOptions={{
                    color: getBorderColorForRisk(district.riskLevel),
                    fillColor: getColorForRisk(district.riskLevel),
                    fillOpacity: getOpacityForRisk(district.riskLevel),
                    weight: district.riskLevel === 'Critical' ? 3 : 2,
                    opacity: 0.9,
                    dashArray: district.riskLevel === 'Critical' ? '5, 5' : undefined,
                    className: district.riskLevel === 'Critical' ? 'critical-pulse' : 'radial-blur',
                  }}
                >
                  <Popup>
                    <div className="popup-content">
                      <h4 className="popup-title">{district.district}</h4>
                      <div className="popup-info">
                        <p><strong>Risk Level:</strong> <span className={`risk-badge risk-${district.riskLevel.toLowerCase()}`}>{district.riskLevel}</span></p>
                        <p><strong>Affected Population:</strong> {district.affectedPopulation.toLocaleString()}</p>
                        <p><strong>Estimated Damage:</strong> {formatCurrency(district.estimatedDamage)}</p>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              );
            })}
          </MapContainer>
        </div>
        <div className="legend">
          <h4 className="legend-title">Risk Levels</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#10b981', borderColor: '#059669' }}></div>
              <span>Low Risk</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f59e0b', borderColor: '#d97706' }}></div>
              <span>Medium Risk</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f97316', borderColor: '#ea580c' }}></div>
              <span>High Risk</span>
            </div>
            <div className="legend-item">
              <div className="legend-color critical-legend" style={{ backgroundColor: '#dc2626', borderColor: '#b91c1c' }}></div>
              <span>Critical Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;