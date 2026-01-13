import React, { useState } from 'react';
import Header from './Header';
import UploadSection from './UploadSection';
import KPICards from './KPICards';
import ChartsSection from './ChartsSection';
import MapSection from './MapSection';
import DataTable from './DataTable';


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

// District risk mapping for map coloring
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

// District centers and radii (in meters) for circular patches
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
  Anuradhapura: { center: [8.3114, 80.4037], radius: 22000 }
};

const DharaDashboard: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel') {
        setSelectedFile(file);
        setUploadError('');
        setUploadSuccess('');
      } else {
        setUploadError('Please select a valid Excel file (.xlsx or .xls)');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('excelFile', selectedFile);

      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadSuccess('File uploaded successfully! Data has been processed.');
        setSelectedFile(null);
        
        const fileInput = document.getElementById('excel-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error('Upload failed');
      }
    } catch {
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };


  const pieData = [
    { name: 'Critical', value: MOCK_API_RESPONSE.detailedData.filter(d => d.risk_level === 'Critical').length },
    { name: 'Moderate', value: MOCK_API_RESPONSE.detailedData.filter(d => d.risk_level === 'Moderate').length },
    { name: 'Low', value: MOCK_API_RESPONSE.detailedData.filter(d => d.risk_level === 'Low').length }
  ];

  // Prepare district data for map
  const districtData = Object.entries(districtCircles).map(([district, { center }]) => {
    const risk = districtRiskMap[district];
    const chartItem = MOCK_API_RESPONSE.chartData.find(d => d.district === district);
    return {
      district,
      riskLevel: risk as 'Low' | 'Medium' | 'High' | 'Critical',
      affectedPopulation: chartItem?.impact || 0,
      estimatedDamage: (chartItem?.impact || 0) * 20000, // Mock damage calculation
      latitude: center[0],
      longitude: center[1]
    };
  });

  // Prepare data for table
  const tableData = MOCK_API_RESPONSE.detailedData.map(item => ({
    district: item.district,
    riskLevel: item.risk_level as 'Low' | 'Medium' | 'High' | 'Critical',
    affectedPopulation: item.families_affected,
    estimatedDamage: item.families_affected * 20000, // Mock damage calculation
    infrastructureDamage: item.risk_level === 'Critical' ? 'Severe' : item.risk_level === 'Moderate' ? 'Moderate' : 'Minor',
    evacuationStatus: item.risk_level === 'Critical' ? 'In Progress' : item.risk_level === 'Moderate' ? 'Completed' : 'Not Started'
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-8">
          <UploadSection
            selectedFile={selectedFile}
            isUploading={isUploading}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            onFileSelect={handleFileSelect}
            onUpload={handleUpload}
          />

          <KPICards summary={MOCK_API_RESPONSE.summary} />

          <ChartsSection
            chartData={MOCK_API_RESPONSE.chartData}
            pieData={pieData}
          />

          <MapSection districtData={districtData} />

          <DataTable data={tableData} />
        </div>
      </div>
    </div>
  );
};

export default DharaDashboard;