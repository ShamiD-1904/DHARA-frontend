import React, { useMemo, useState } from 'react';
import Header from './Header';
import ChartsSection from './ChartsSection';
import MapSection from './MapSection';
import DataTable from './DataTable';
import FileUploader from './FileUploader';
import SmartSidebar from './SmartSidebar';
import { detectColumns } from '../lib/parser';

import L from 'leaflet';
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MOCK_API_RESPONSE = {
  summary: {
    totalFamiliesAffected: 15234,
    totalDamages: 45678000,
    criticalDSDivisions: 7
  },
  chartData: [
    { district: 'Colombo', impact: 2345 },
    { district: 'Gampaha', impact: 1890 },
    { district: 'Kalutara', impact: 1456 },
    { district: 'Kandy', impact: 12340 },
    { district: 'Galle', impact: 40 },
    { district: 'Matara', impact: 76 },
    { district: 'Jaffna', impact: 654 },
    { district: 'Batticaloa', impact: 543 },
    { district: 'Kurunegala', impact: 432 },
    { district: 'Anuradhapura', impact: 321 }
  ],
  detailedData: [
    { id: 1, district: 'Colombo', ds_division: 'Colombo', gn_division: 'Fort', families_affected: 150, risk_level: 'Critical' },
    { id: 2, district: 'Colombo', ds_division: 'Colombo', gn_division: 'Pettah', families_affected: 120, risk_level: 'Moderate' },
    { id: 3, district: 'Gampaha', ds_division: 'Kelaniya', gn_division: 'Pilapitiya', families_affected: 200, risk_level: 'Critical' },
    { id: 4, district: 'Gampaha', ds_division: 'Kelaniya', gn_division: 'Mahabage', families_affected: 180, risk_level: 'Moderate' },
    { id: 5, district: 'Kalutara', ds_division: 'Beruwala', gn_division: 'Aluthgama', families_affected: 90, risk_level: 'Low' },
    { id: 6, district: 'Kandy', ds_division: 'Kandy', gn_division: 'Peradeniya', families_affected: 250, risk_level: 'Critical' },
    { id: 7, district: 'Galle', ds_division: 'Galle', gn_division: 'Hiniduma', families_affected: 110, risk_level: 'Moderate' },
    { id: 8, district: 'Matara', ds_division: 'Matara', gn_division: 'Urubokka', families_affected: 19, risk_level: 'Low' },
    { id: 9, district: 'Jaffna', ds_division: 'Jaffna', gn_division: 'Nallur', families_affected: 300, risk_level: 'Critical' },
    { id: 10, district: 'Batticaloa', ds_division: 'Batticaloa', gn_division: 'Kattankudy', families_affected: 140, risk_level: 'Moderate' }
  ]
};

const districtRiskMap: { [key: string]: string } = {
  Colombo: 'Critical',
  Gampaha: 'Critical',
  Kalutara: 'Low',
  Kandy: 'Critical',
  Galle: 'Moderate',
  Matara: 'Low',
  Jaffna: 'Critical',
  Batticaloa: 'Moderate',
  Kurunegala: 'Low',
  Anuradhapura: 'Low'
};

const districtCircles: { [key: string]: { center: [number, number], radius: number } } = {
  Colombo: { center: [6.9271, 79.8612], radius: 15000 },
  Gampaha: { center: [7.0840, 79.9500], radius: 12000 },
  Kalutara: { center: [6.5831, 79.9608], radius: 10000 },
  Kandy: { center: [7.2906, 80.6350], radius: 18000 },
  Galle: { center: [6.0535, 80.2100], radius: 14000 },
  Matara: { center: [5.9480, 80.5350], radius: 11000 },
  Jaffna: { center: [9.6615, 80.0250], radius: 20000 },
  Batticaloa: { center: [7.7102, 81.7000], radius: 16000 },
  Kurunegala: { center: [7.4863, 80.3600], radius: 19000 },
  Anuradhapura: { center: [8.3114, 80.4037], radius: 22000 },
  Ratnapura: { center: [6.6950, 80.3955], radius: 15000 },
  NuwaraEliya: { center: [6.9497, 80.7895], radius: 15000 },
  Nuwara_Eliya: { center: [6.9497, 80.7895], radius: 15000 },
  "Nuwara Eliya": { center: [6.9497, 80.7895], radius: 15000 },
  Kegalle: { center: [7.2596, 80.3380], radius: 12000 },
  Matale: { center: [7.4680, 80.6190], radius: 12000 },
  Polonnaruwa: { center: [7.9405, 81.0228], radius: 12000 },
  Trincomalee: { center: [8.5670, 81.2330], radius: 12000 },
  Ampara: { center: [7.2910, 81.6750], radius: 12000 },
  Hambantota: { center: [6.1214, 81.1160], radius: 12000 },
  Puttalam: { center: [8.0340, 79.8290], radius: 12000 },
  Kilinochchi: { center: [9.3928, 79.4069], radius: 12000 },
  Mannar: { center: [8.9892, 79.9098], radius: 12000 },
  Mullaitivu: { center: [9.2667, 80.7833], radius: 12000 },
  Vavuniya: { center: [8.7586, 80.5050], radius: 12000 },
  Moneragala: { center: [6.8772, 81.3431], radius: 12000 },
  Badulla: { center: [6.9898, 81.0550], radius: 12000 },
  Kalmunai: { center: [7.4340, 81.4800], radius: 12000 },
  Kurunegala_District: { center: [7.4863, 80.3600], radius: 12000 }
};

const DharaDashboard: React.FC = () => {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'pie'>('bar');
  const [tableRowsDisplayed, setTableRowsDisplayed] = useState<number>(15); // Pagination

  const handleParsed = async (parsedRows: Record<string, any>[]) => {
    setRows(parsedRows || []);
    const { dimensions: d, metrics: m } = detectColumns(parsedRows || []);
    setDimensions(d);
    setMetrics(m);
    setTableRowsDisplayed(15); // Reset pagination on new file
    // defaults: prefer RDHS_AREA or MOH_AREA-like columns when available
    const areaCandidates = ['RDHS_AREA', 'MOH_AREA', 'RDHS', 'MOH', 'AREA', 'DS_DIVISION', 'GN_DIVISION', 'DISTRICT'];
    const pickArea = () => {
      const available = d || [];
      for (const cand of areaCandidates) {
        const found = available.find(k => k.toUpperCase() === cand || k.toUpperCase().includes(cand));
        if (found) return found;
      }
      return available[0];
    };
    setSelectedGroup(pickArea());
    setSelectedValue(m[0]);
  };


  // Helper function to detect if a dimension is location-based
  const isLocationDimension = (dimensionName?: string): boolean => {
    if (!dimensionName) return false;
    const lowerDim = dimensionName.toLowerCase();
    // Check if it's a known location dimension
    const locationKeywords = ['area', 'district', 'division', 'location', 'place', 'region', 'rdhs', 'moh'];
    const nonLocationKeywords = ['date', 'time', 'year', 'month', 'day', 'hour', 'minute', 'no_of_', 'count_', 'total_', 'sum_', 'percentage', 'rate', 'persons', 'families', 'population', 'damage', 'affected', 'risk'];
    
    // If it contains non-location keywords, it's likely not location-based
    for (const keyword of nonLocationKeywords) {
      if (lowerDim.includes(keyword)) return false;
    }
    
    // If it contains location keywords, it's likely location-based
    for (const keyword of locationKeywords) {
      if (lowerDim.includes(keyword)) return true;
    }
    
    // Check if values in first few rows look like dates
    if (rows && rows.length > 0) {
      const sampleValues = rows.slice(0, 5).map(r => String(r[dimensionName] || '').trim());
      const datePattern = /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}|^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}|^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;
      if (sampleValues.some(v => datePattern.test(v))) return false;
    }
    
    // Default to false if uncertain (non-location)
    return false;
  };

  const pieData = [
    { name: 'Critical', value: MOCK_API_RESPONSE.detailedData.filter(d => d.risk_level === 'Critical').length },
    { name: 'Moderate', value: MOCK_API_RESPONSE.detailedData.filter(d => d.risk_level === 'Moderate').length },
    { name: 'Low', value: MOCK_API_RESPONSE.detailedData.filter(d => d.risk_level === 'Low').length }
  ];

  // existing mock district data (fallback)
  const districtData = Object.entries(districtCircles).map(([district, { center }]) => {
    const risk = districtRiskMap[district];
    const chartItem = MOCK_API_RESPONSE.chartData.find(d => d.district === district);
    return {
      district,
      riskLevel: risk as 'Low' | 'Medium' | 'High' | 'Critical',
      affectedPopulation: chartItem?.impact || 0,
      estimatedDamage: (chartItem?.impact || 0) * 20000,
      latitude: center[0],
      longitude: center[1]
    };
  });
  

  const tableData = MOCK_API_RESPONSE.detailedData.map(item => ({
    district: item.district,
    riskLevel: item.risk_level as 'Low' | 'Medium' | 'High' | 'Critical',
    affectedPopulation: item.families_affected,
    estimatedDamage: item.families_affected * 20000,
    infrastructureDamage: item.risk_level === 'Critical' ? 'Severe' : item.risk_level === 'Moderate' ? 'Moderate' : 'Minor',
    evacuationStatus: item.risk_level === 'Critical' ? 'In Progress' : item.risk_level === 'Moderate' ? 'Completed' : 'Not Started'
  }));

  // aggregated summary rows: group by selectedGroup and sum ALL numeric metrics
  const aggregatedSummaryRows = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    const areaKey = selectedGroup || dimensions[0];
    if (!areaKey) return [];

    const parseNum = (v: any) => {
      if (v === null || v === undefined || v === '') return 0;
      const s = String(v).replace(/[ ,\s\-]+/g, '');
      const n = Number(s);
      return Number.isNaN(n) ? 0 : n;
    };

    // Get all numeric column keys (metrics)
    const numericKeys = metrics && metrics.length > 0 ? metrics : [];

    const map = new Map<string, { [k: string]: any }>();

    for (const r of rows) {
      const rawName = String(r[areaKey] ?? 'Unknown');
      // For area-like keys, normalize to collapse variants
      const isAreaKey = String(areaKey).toUpperCase().includes('AREA') || 
                       String(areaKey).toUpperCase().includes('DISTRICT') || 
                       String(areaKey).toUpperCase().includes('DIVISION');
      const groupKey = isAreaKey
        ? (rawName || 'Unknown').trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
        : rawName;

      const mapKey = groupKey || 'Unknown';

      if (!map.has(mapKey)) {
        const base: any = { [areaKey]: rawName };
        // Initialize all numeric columns with 0
        for (const mk of numericKeys) {
          base[mk] = 0;
        }
        map.set(mapKey, base);
      }
      const acc = map.get(mapKey)!;

      // Sum all numeric metrics
      for (const mk of numericKeys) {
        acc[mk] = (acc[mk] || 0) + parseNum(r[mk]);
      }
    }

    const out = Array.from(map.values());
    
    // Sort by area first, then by metrics
    const sortKey = selectedValue || (numericKeys.length > 0 ? numericKeys[0] : areaKey);
    out.sort((a: any, b: any) => {
      const aArea = String(a[areaKey]);
      const bArea = String(b[areaKey]);
      if (aArea !== bArea) {
        return String(aArea).localeCompare(String(bArea));
      }
      return (Number(b[sortKey]) || 0) - (Number(a[sortKey]) || 0);
    });
    return out;
  }, [rows, selectedGroup, dimensions, metrics, selectedValue]);

  // derive map data from parsed rows if possible (computed after aggregatedSummaryRows)
  const derivedDistrictData = useMemo(() => {
    if (!aggregatedSummaryRows || aggregatedSummaryRows.length === 0) return districtData;
    // determine key used for area names
    const areaKey = selectedGroup || dimensions[0];
    if (!areaKey) return districtData;

    // Get the value key from metrics or selectedValue
    const valueKey = selectedValue || (metrics && metrics.length > 0 ? metrics[0] : 'value');

    // normalization helper: remove diacritics, punctuation and whitespace, lowercase
    const normalize = (s?: string) => {
      if (!s) return '';
      try {
        return String(s)
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');
      } catch {
        return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
      }
    };

    // simple Levenshtein distance for fuzzy matching
    const levenshtein = (a: string, b: string) => {
      const m = a.length, n = b.length;
      if (m === 0) return n;
      if (n === 0) return m;
      const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
      }
      return dp[m][n];
    };

    const candidates = Object.keys(districtCircles || {});

    const findCircle = (name: string) => {
      if (!name) return undefined;
      const nName = normalize(name);
      if (!nName) return undefined;
      
      // exact normalized match
      for (const c of candidates) if (normalize(c) === nName) return districtCircles[c];
      
      // substring match (more lenient)
      for (const c of candidates) {
        const nc = normalize(c);
        if (nc.includes(nName) || nName.includes(nc)) return districtCircles[c];
      }
      
      // startsWith match
      for (const c of candidates) {
        const nc = normalize(c);
        if (nc.startsWith(nName) || nName.startsWith(nc)) return districtCircles[c];
      }
      
      // fuzzy: allow 30% tolerance instead of 25%
      let best: { key?: string; dist: number } = { dist: Infinity };
      for (const c of candidates) {
        const d = levenshtein(normalize(c), nName);
        if (d < best.dist) best = { key: c, dist: d };
      }
      const maxDist = Math.max(2, Math.floor(nName.length * 0.3));
      if (best.key && best.dist <= maxDist) return districtCircles[best.key];
      
      return undefined;
    };

    // use top 10 most affected (need to re-sort by metric value, as aggregatedSummaryRows is sorted alphabetically)
    const sortedByMetric = [...aggregatedSummaryRows].sort((a: any, b: any) => 
      Number(b[valueKey] ?? 0) - Number(a[valueKey] ?? 0)
    );
    const top = sortedByMetric.slice(0, 10);

    // map only matched entries to avoid dumping unmatched ones at center
    const mapped = top.map(item => {
      const name = item[areaKey];
      const circle = findCircle(String(name));
      if (!circle) return null;
      const risk = districtRiskMap[String(name)] || 'Low';
      return {
        district: String(name),
        riskLevel: risk as 'Low' | 'Medium' | 'High' | 'Critical',
        affectedPopulation: Number(item[valueKey] ?? 0),
        estimatedDamage: (Number(item[valueKey] ?? 0)) * 20000,
        latitude: circle.center[0],
        longitude: circle.center[1],
      };
    }).filter(Boolean) as any[];
    // Return mapped entries (may be empty) — do NOT fall back to mock data when a file is uploaded
    return mapped;
  }, [aggregatedSummaryRows, selectedGroup, selectedValue, dimensions, districtData, metrics]);

  const computedSummary = useMemo(() => {
    if (!rows || rows.length === 0) return MOCK_API_RESPONSE.summary;
    // Use the first metric column, or the selectedValue if set
    const valueKey = selectedValue || (metrics && metrics.length > 0 ? metrics[0] : undefined);
    if (!valueKey) return MOCK_API_RESPONSE.summary;
    
    // Sum from aggregatedSummaryRows (already aggregated)
    const total = aggregatedSummaryRows.reduce((s: number, r: any) => s + (Number(r[valueKey]) || 0), 0);
    const damages = total * 20000;
    const areaKey = selectedGroup || dimensions[0];
    const criticalCount = aggregatedSummaryRows.filter((r: any) => districtRiskMap[String(r[areaKey])] === 'Critical').length;
    return {
      totalFamiliesAffected: total,
      totalDamages: damages,
      criticalDSDivisions: criticalCount
    };
  }, [rows, aggregatedSummaryRows, selectedGroup, selectedValue, metrics, dimensions]);

  const unmatchedNames = useMemo(() => {
    if (!aggregatedSummaryRows || aggregatedSummaryRows.length === 0) return [];
    const areaKey = selectedGroup || dimensions[0];
    const top = aggregatedSummaryRows.slice(0, 10).map((t: any) => String(t[areaKey] ?? ''));
    const mappedNames = (derivedDistrictData || []).map((d: any) => String(d.district));
    return top.filter((n: string) => n && !mappedNames.includes(n));
  }, [aggregatedSummaryRows, selectedGroup, dimensions, derivedDistrictData]);

  return (
    <div>
      <Header />

      <div className="dashboard-content">
        {/* Upload + Sidebar Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FileUploader onParsed={handleParsed} />
            {rows && rows.length > 0 && unmatchedNames.length > 0 && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                borderRadius: '10px',
                fontSize: '0.8125rem',
              }}>
                <div style={{ fontWeight: 600, color: '#FBBF24', marginBottom: '0.25rem' }}>Unmatched locations</div>
                <div style={{ color: 'var(--text-tertiary)' }}>{unmatchedNames.join(', ')}</div>
              </div>
            )}
          </div>
          <SmartSidebar
            dimensions={dimensions}
            metrics={metrics}
            selectedGroup={selectedGroup}
            selectedValue={selectedValue}
            onSelectGroup={(k) => setSelectedGroup(k)}
            onSelectValue={(k) => setSelectedValue(k)}
            chartType={chartType}
            onChartTypeChange={(t) => setChartType(t)}
          />
        </div>

        {/* KPI Cards */}
        

        {/* Charts */}
        <ChartsSection
          aggregatedData={rows && rows.length > 0 ? aggregatedSummaryRows : []}
          xKey={selectedGroup}
          yKey={selectedValue}
          chartType={chartType}
          chartData={rows && rows.length > 0 ? undefined : MOCK_API_RESPONSE.chartData}
          pieData={rows && rows.length > 0 ? undefined : pieData}
        />

        {/* Map */}
        <MapSection 
          districtData={rows && rows.length > 0 ? derivedDistrictData : districtData} 
          topList={rows && rows.length > 0 && isLocationDimension(selectedGroup) ? 
            (() => {
              const valueKey = selectedValue || (metrics && metrics.length > 0 ? metrics[0] : Object.keys(aggregatedSummaryRows[0] || {})[1]);
              return [...aggregatedSummaryRows].sort((a: any, b: any) => Number(b[valueKey] ?? 0) - Number(a[valueKey] ?? 0)).slice(0, 10).map((it: any) => ({ 
                name: it[selectedGroup || dimensions[0]] ?? '', 
                value: Number(it[valueKey] ?? 0) 
              }));
            })()
            : undefined} 
          isLocationDimension={rows && rows.length > 0 ? isLocationDimension(selectedGroup) : true}
          selectedDimensionName={selectedGroup}
        />

        {/* Data Table */}
        <DataTable 
          data={rows && rows.length > 0 ? aggregatedSummaryRows : tableData} 
          rowsDisplayed={tableRowsDisplayed}
          onShowMore={() => setTableRowsDisplayed(tableRowsDisplayed + 15)}
        />
      </div>
    </div>
  );
};

export default DharaDashboard;