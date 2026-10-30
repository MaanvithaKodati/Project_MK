import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet,
  FileCode,
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';

export interface ProcessedReportFile {
  id: string;
  name: string;
  size: number;
  type: 'pdf' | 'csv' | 'txt' | 'json';
  periodLabel: string;
  rawText: string;
  uploadedAt: string;
}

interface ReportFileDropzoneProps {
  moduleTitle: string;
  acceptedFormatsText?: string;
  maxFiles?: number;
  files: ProcessedReportFile[];
  onFilesChange: (files: ProcessedReportFile[]) => void;
  onParseSuccess?: (extractedText: string, file: ProcessedReportFile) => void;
}

export const ReportFileDropzone: React.FC<ReportFileDropzoneProps> = ({
  moduleTitle,
  acceptedFormatsText = 'PDF, CSV, TXT, or JSON (Up to 3 files)',
  maxFiles = 3,
  files,
  onFilesChange,
  onParseSuccess,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract text from a PDF buffer (client-side extraction of stream strings)
  const extractPdfText = (buffer: ArrayBuffer): string => {
    try {
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const raw = decoder.decode(buffer);
      
      // Look for text operators in PDF: (string) Tj or [(string)] TJ or stream text
      const textMatches: string[] = [];
      const regex = /\(([^)]+)\)\s*(?:Tj|TJ)/g;
      let match;
      while ((match = regex.exec(raw)) !== null) {
        if (match[1] && match[1].trim().length > 0) {
          textMatches.push(match[1]);
        }
      }

      if (textMatches.length > 5) {
        return textMatches.join(' ');
      }

      // Fallback: extract printable ASCII words of 3+ letters
      const words = raw.match(/[A-Za-z0-9$,.%-]{3,}/g);
      if (words && words.length > 20) {
        return words.slice(0, 500).join(' ');
      }

      return raw.slice(0, 1500).replace(/[^\x20-\x7E\n]/g, ' ');
    } catch (e) {
      console.warn('PDF text extraction error:', e);
      return 'PDF Document content ingested for enterprise intelligence analysis.';
    }
  };

  const processUploadedFiles = async (newFileList: FileList | File[]) => {
    const incoming = Array.from(newFileList);
    if (incoming.length === 0) return;

    if (files.length + incoming.length > maxFiles) {
      setStatusMessage(`Notice: Maximum of ${maxFiles} reports allowed. Truncating to 3 files.`);
      setTimeout(() => setStatusMessage(null), 4000);
    }

    const availableSlots = maxFiles - files.length;
    const toProcess = incoming.slice(0, Math.max(0, availableSlots));
    if (toProcess.length === 0) return;

    setIsProcessing(true);
    const addedFiles: ProcessedReportFile[] = [];

    for (let i = 0; i < toProcess.length; i++) {
      const file = toProcess[i];
      const ext = file.name.split('.').pop()?.toLowerCase();
      let fileType: ProcessedReportFile['type'] = 'txt';
      if (ext === 'pdf') fileType = 'pdf';
      else if (ext === 'csv') fileType = 'csv';
      else if (ext === 'json') fileType = 'json';

      const fileIndex = files.length + addedFiles.length + 1;
      const defaultPeriod = `Report Period ${fileIndex}`;

      try {
        let textContent = '';
        if (fileType === 'pdf') {
          const buffer = await file.arrayBuffer();
          textContent = extractPdfText(buffer);
        } else {
          textContent = await file.text();
        }

        const processed: ProcessedReportFile = {
          id: `file-${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: fileType,
          periodLabel: defaultPeriod,
          rawText: textContent,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        addedFiles.push(processed);
        if (onParseSuccess) {
          onParseSuccess(textContent, processed);
        }
      } catch (err) {
        console.error('File parsing failed:', err);
      }
    }

    const updated = [...files, ...addedFiles];
    onFilesChange(updated);
    setIsProcessing(false);
    setStatusMessage(`Successfully processed ${addedFiles.length} file(s).`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveFile = (id: string) => {
    const filtered = files.filter(f => f.id !== id);
    onFilesChange(filtered);
  };

  const handleUpdatePeriodLabel = (id: string, newLabel: string) => {
    const updated = files.map(f => f.id === id ? { ...f, periodLabel: newLabel } : f);
    onFilesChange(updated);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      {/* Dropzone container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#1A73E8] bg-blue-50/70 scale-[1.005]'
            : 'border-gray-300 hover:border-[#1A73E8] hover:bg-gray-50/70 bg-white'
        } ${files.length >= maxFiles ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.csv,.txt,.json"
          onChange={(e) => {
            if (e.target.files) {
              processUploadedFiles(e.target.files);
              e.target.value = '';
            }
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8] shadow-xs">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Drag &amp; drop {moduleTitle} or <span className="text-[#1A73E8] underline font-semibold">Browse Files</span>
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {acceptedFormatsText} &bull; Up to {maxFiles} files simultaneously
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[#1A73E8] text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1A73E8]" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Uploaded File List with Custom Period Naming */}
      {files.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
            <span className="font-bold text-gray-900 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Attached Departmental Reports ({files.length}/{maxFiles})</span>
            </span>
            <span className="text-[11px] text-gray-500">
              Set custom period labels for comparative trend modeling
            </span>
          </div>

          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={file.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 gap-2 text-xs"
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                    {file.type === 'pdf' ? (
                      <span className="text-[10px] font-bold font-mono text-rose-600">PDF</span>
                    ) : file.type === 'csv' ? (
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#1A73E8]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 truncate">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {formatFileSize(file.size)} &bull; Uploaded {file.uploadedAt}
                    </div>
                  </div>
                </div>

                {/* Custom Period Naming Input */}
                <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
                  <div className="flex items-center space-x-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      title="Custom Period Label"
                      value={file.periodLabel}
                      onChange={(e) => handleUpdatePeriodLabel(file.id, e.target.value)}
                      placeholder="e.g. FY 2024 / Q1"
                      className="bg-transparent border-none text-gray-800 focus:outline-none text-xs w-28 sm:w-36 font-medium"
                    />
                  </div>

                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
