import React, { useState } from 'react';
import { ActiveUpload } from '../../types';
import { INITIAL_UPLOADS } from '../../data/mockData';
import { soundManager } from '../../utils/audio';
import { Upload, FileCode, Image as ImageIcon, FileText, ArrowRight } from 'lucide-react';

interface ActiveUploadsPanelProps {
  onOpenUploadModal: () => void;
}

export const ActiveUploadsPanel: React.FC<ActiveUploadsPanelProps> = ({ onOpenUploadModal }) => {
  const [uploads] = useState<ActiveUpload[]>(INITIAL_UPLOADS);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />;
      case 'cad': return <FileCode className="w-3.5 h-3.5 text-amber-400" />;
      default: return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="bg-slate-950/80 border border-cyan-500/30 rounded p-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.08)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-cyan-500/20">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center">
            ACTIVE UPLOADS
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenUploadModal();
            }}
            className="p-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 transition-colors text-[10px] font-mono flex items-center space-x-1"
            title="Upload New Blueprint / Image"
          >
            <Upload className="w-3 h-3 text-cyan-400" />
            <span>+ UPLOAD</span>
          </button>
        </div>

        {/* List matching reference image */}
        <div className="space-y-3 font-mono text-[11px]">
          {uploads.map(file => (
            <div key={file.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-1.5 truncate">
                  {getFileIcon(file.fileType)}
                  <span className="text-slate-200 truncate font-medium">{file.filename}</span>
                </div>
                <span className="text-cyan-300 font-semibold">{file.progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[9px] text-slate-500">
                <span className="uppercase text-cyan-400/80">{file.status}</span>
                <span>{file.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <button
        onClick={() => {
          soundManager.playClick();
          onOpenUploadModal();
        }}
        className="w-full mt-3 pt-2 border-t border-cyan-500/20 text-xs font-mono text-cyan-400 hover:text-cyan-200 flex items-center justify-between group cursor-pointer"
      >
        <span className="tracking-wider uppercase">VIEW ALL UPLOADS</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
