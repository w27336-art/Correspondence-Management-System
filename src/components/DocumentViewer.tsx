import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Maximize2, 
  ShieldCheck, 
  FileText, 
  Hash,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { DocumentAttachment } from '../types/correspondence';

interface DocumentViewerProps {
  attachment: DocumentAttachment;
  onReplaceFile?: (file: File) => void;
  readOnly?: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  attachment,
  onReplaceFile,
  readOnly = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 1;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 20, 60));
  const handleResetZoom = () => setZoomLevel(100);
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    if (!attachment.dataUrl) return;
    const link = document.createElement('a');
    link.href = attachment.dataUrl;
    link.download = attachment.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Viewer Header / Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800 text-slate-300 text-xs">
        {/* Document Info */}
        <div className="flex items-center gap-2 truncate max-w-[50%]">
          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-medium text-slate-200 truncate" title={attachment.fileName}>
            {attachment.fileName}
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono shrink-0">
            {formatFileSize(attachment.fileSize)}
          </span>
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1 text-[11px] font-mono text-slate-400 w-10 text-center">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white text-[10px]"
            title="Fit to Container"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleRotate}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Rotate 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3.5 bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600/80 hover:bg-blue-600 text-white rounded text-[11px] font-medium"
            title="Download Original"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Main Canvas / Image Area */}
      <div className="relative flex-1 bg-slate-950/70 overflow-auto p-4 flex items-center justify-center min-h-[420px]">
        {attachment.dataUrl ? (
          <div
            className="transition-transform duration-150 origin-center bg-white shadow-2xl rounded-sm p-1"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              maxWidth: zoomLevel <= 100 ? '100%' : 'none',
            }}
          >
            {attachment.dataUrl.startsWith('data:application/pdf') || (attachment.fileName.toLowerCase().endsWith('.pdf') && !attachment.dataUrl.startsWith('data:image/')) ? (
              <div className="w-[680px] h-[750px] bg-white rounded shadow-md overflow-hidden flex flex-col">
                <iframe
                  src={attachment.dataUrl}
                  title="PDF Preview"
                  className="w-full flex-1 border-0"
                />
              </div>
            ) : (
              <img
                src={attachment.dataUrl}
                alt="Document Letter Preview"
                className="w-full max-w-[680px] h-auto object-contain border border-slate-200 shadow-sm"
                style={{ minHeight: '520px' }}
              />
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-slate-400">
            <FileText className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium">No document preview available</p>
            <p className="text-xs text-slate-500">File attached without direct raster rendering</p>
          </div>
        )}
      </div>

      {/* Document Integrity Footer */}
      <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-slate-500">SHA-256:</span>
          <span className="truncate text-slate-300" title={attachment.sha256Hash}>
            {attachment.sha256Hash ? `${attachment.sha256Hash.substring(0, 16)}...` : 'Pending Generation'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {attachment.cloudSynced ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Cloud Secured
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Local Vault
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
