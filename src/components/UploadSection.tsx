import React from 'react';
import { Loader2, FileUp, RefreshCw } from 'lucide-react';
import './UploadSection.css';

interface UploadSectionProps {
  selectedFile: File | null;
  isUploading: boolean;
  uploadError: string;
  uploadSuccess: string;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  selectedFile,
  isUploading,
  uploadError,
  uploadSuccess,
  onFileSelect,
  onUpload
}) => {
  return (
    <div className="upload-section">
      <div className="upload-card">
        <div className="upload-header">
          <h2 className="upload-title">Upload New Data</h2>
          <RefreshCw className="refresh-icon" />
        </div>
        <div className="upload-grid">
          <div className="file-input-container">
            <input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={onFileSelect}
              className="file-input"
            />
            {selectedFile && (
              <div className="file-selected">
                Selected: {selectedFile.name}
              </div>
            )}
          </div>
          <div className="upload-button-container">
            <button
              onClick={onUpload}
              disabled={!selectedFile || isUploading}
              className="upload-button"
            >
              {isUploading ? (
                <>
                  <Loader2 className="loading-icon" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileUp className="upload-icon" />
                  Upload & Process
                </>
              )}
            </button>
          </div>
        </div>
        {uploadError && (
          <div className="error-message">
            {uploadError}
          </div>
        )}
        {uploadSuccess && (
          <div className="success-message">
            {uploadSuccess}
          </div>
        )}
        <p className="upload-description">
          Upload Excel files containing Cyclone Ditwah impact data. The system will process and update the analysis automatically.
        </p>
      </div>
    </div>
  );
};

export default UploadSection;