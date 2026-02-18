import React, { useEffect, useRef } from 'react';
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
  topList?: { name: string; value: number }[];
  isLocationDimension?: boolean;
  selectedDimensionName?: string;
}

const MapSection: React.FC<MapSectionProps> = ({ districtData, topList, isLocationDimension = true, selectedDimensionName }) => {
  // Sri Lanka center coordinates
  const defaultCenter: [number, number] = [7.8731, 80.7718];
  // center on points if available
  const points = (districtData || []).filter(d => typeof d.latitude === 'number' && typeof d.longitude === 'number');
  const center: [number, number] = points.length > 0
    ? [points.reduce((s, p) => s + p.latitude, 0) / points.length, points.reduce((s, p) => s + p.longitude, 0) / points.length]
    : defaultCenter;
  const zoom = 7;

  const getColorForRisk = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return '#10b981'; // green
      case 'Medium': return '#f59e0b'; // yellow
      case 'High': return '#f97316'; // orange
      case 'Critical': return '#dc2626'; // red
      default: return '#6b7280'; // gray
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

  // only include items with valid coordinates
  // `points` already computed above

  // compute radius scale based on affectedPopulation
  const maxAffected = points.reduce((m, p) => Math.max(m, p.affectedPopulation || 0), 0) || 1;

  const radiusFor = (affected: number) => {
    // scale between 8000 and 50000
    const min = 8000;
    const max = 50000;
    const ratio = Math.min(1, Math.max(0, (affected || 0) / maxAffected));
    return Math.round(min + (max - min) * ratio);
  };

  const mapRef = useRef<any>(null);

  useEffect(() => {
    // when points or layout change, ensure Leaflet recalculates size
    if (mapRef.current && typeof mapRef.current.invalidateSize === 'function') {
      // small delay to allow layout to settle
      setTimeout(() => {
        try { mapRef.current.invalidateSize(); } catch { /* ignore */ }
      }, 100);
    }
    // debug logging to help diagnose missing tiles
    try {
      // eslint-disable-next-line no-console
      console.debug('MapSection debug:', { pointsCount: points.length, center });
      // eslint-disable-next-line no-console
      console.debug('mapRef present:', !!mapRef.current);
    } catch {}
  }, [points.length, center[0], center[1]]);

  return (
    <div className="map-section">
      <div className="map-card">
        <h3 className="map-title">Impact Map - Top Affected Areas</h3>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="map-container flex-1 relative" style={{ height: 500 }}>
            <MapContainer key={`${points.length}-${center[0].toFixed(3)}-${center[1].toFixed(3)}`} center={center} zoom={zoom} style={{ height: 500, width: '100%' }} ref={mapRef}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {points.map((district, index) => {
              const affected = Number(district.affectedPopulation || 0);
              const r = radiusFor(affected);
              const riskLevel = district.riskLevel || 'Low';
              const color = getColorForRisk(riskLevel);

              return (
                <Circle
                  key={`${district.district}-${index}`}
                  center={[district.latitude, district.longitude]}
                  radius={r}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.35,
                    weight: district.riskLevel === 'Critical' ? 3 : 2,
                    opacity: 0.9,
                  }}
                >
                  <Popup>
                    <div className="popup-content">
                      <h4 className="popup-title">{district.district ?? 'Unknown'}</h4>
                      <div className="popup-info">
                        <p><strong>Risk Level:</strong> <span className={`risk-badge risk-${riskLevel.toLowerCase()}`}>{riskLevel}</span></p>
                        <p><strong>Affected Population:</strong> {affected.toLocaleString()}</p>
                        <p><strong>Estimated Damage:</strong> {formatCurrency(Number(district.estimatedDamage || affected * 20000))}</p>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              );
            })}
            </MapContainer>
            {points.length === 0 || !isLocationDimension ? (
              <div className="map-empty-overlay">
                <div className="map-empty-inner">
                  {!isLocationDimension ? (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No Locations Found</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Selected dimension "{selectedDimensionName}" cannot be mapped.</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Please select a location-based dimension to view the map.</p>
                    </div>
                  ) : (
                    <div>No mapped coordinates found — map is empty</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="map-debug-badge">{`Points: ${points.length} • Center: ${center[0].toFixed(3)}, ${center[1].toFixed(3)}`}</div>
            )}
          </div>
          {isLocationDimension && topList && topList.length > 0 && (
            <aside className="top-list-sidebar" style={{ width: '100%', maxWidth: 320 }}>
              <h4 className="top-list-title">Top 10 Affected</h4>
              <div className="top-list-items">
                {topList.map((t, i) => {
                  const risk = (districtData.find(d => d.district === t.name)?.riskLevel) || 'Low';
                  const color = risk === 'Critical' ? '#EF4444' : risk === 'High' ? '#F97316' : risk === 'Medium' ? '#F59E0B' : '#10B981';
                  return (
                    <div key={t.name} className="top-list-item">
                      <div className="top-list-item-left">
                        <span className="top-list-rank">{i+1}.</span>
                        <span className="top-list-name">{t.name}</span>
                      </div>
                      <div className="top-list-item-right">
                        <span className="top-list-value">{t.value.toLocaleString()}</span>
                        <span className="top-list-dot" style={{ backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}
        </div>
        <div className="legend">
          <h4 className="legend-title">Risk Levels</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
              <span>Low</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
              <span>Medium</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
              <span>High</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#dc2626' }}></div>
              <span>Critical</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;