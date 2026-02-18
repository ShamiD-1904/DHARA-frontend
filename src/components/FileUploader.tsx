import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { parseFile } from '../lib/parser';
import './FileUploader.css';

interface FileUploaderProps {
  onParsed: (rows: Record<string, any>[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onParsed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFiles = useCallback(async (file: File) => {
    setError(null);
    setFileName(file.name);
    try {
      const result = await parseFile(file);
      if (!result.rows || result.rows.length === 0) {
        setError('Data Not Recognized');
        onParsed([]);
        return;
      }
      onParsed(result.rows);
    } catch (e) {
      setError('Failed to parse file');
      onParsed([]);
    }
  }, [onParsed]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFiles(file);
  }, [handleFiles]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFiles(file);
  }, [handleFiles]);

  return (
    <div className="file-uploader">
      <label
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`upload-zone ${dragActive ? 'upload-zone--active' : ''} ${fileName && !error ? 'upload-zone--success' : ''}`}
      >
        <input type="file" accept=".csv,.txt" onChange={onChange} className="upload-input" />
        <div className="upload-zone-content">
          {fileName && !error ? (
            <>
              <div className="upload-icon-wrap upload-icon-wrap--success">
                <FileText size={20} />
              </div>
              <div className="upload-text">
                <span className="upload-filename">{fileName}</span>
                <span className="upload-hint">Click or drop to replace</span>
              </div>
            </>
          ) : (
            <>
              <div className={`upload-icon-wrap ${dragActive ? 'upload-icon-wrap--active' : ''}`}>
                <Upload size={20} />
              </div>
              <div className="upload-text">
                <span className="upload-label">Drop CSV file here</span>
                <span className="upload-hint">or click to browse</span>
              </div>
            </>
          )}
        </div>
      </label>
      {error && (
        <div className="upload-error">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
