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
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]" />;
      case 'cad':
        return <FileCode className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]" />;
    }
  };

  return (
    <div className="bg-slate-950/80 border border-cyan-500/40 rounded p-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] flex flex-col justify-between transition-all duration-300">
      <div>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-cyan-500/20 bg-slate-950/20 px-0.5">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] flex items-center">
            ACTIVE UPLOADS
          </span>
          
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenUploadModal();
            }}
            className="p-1 rounded bg-cyan-950/40 hover:bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:text-cyan-200 transition-all duration-200 text-[10px] font-mono flex items-center space-x-1 outline-none shadow-[0_0_8px_rgba(6,182,212,0.1)]"
            title="Upload New Blueprint / Image"
          >
            <Upload className="w-3 h-3 text-cyan-400" />
            <span className="font-bold tracking-wide">+ UPLOAD</span>
          </button>
        </div>

        {/* List matching reference image */}
        <div className="space-y-3 font-mono text-[11px]">
          {uploads.map(file => (
            <div key={file.id} className="space-y-1 py-0.5 px-0.5 transition-colors duration-200 rounded-sm hover:bg-cyan-950/10">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-1.5 truncate">
                  {getFileIcon(file.fileType)}
                  <span className="text-slate-200 truncate font-semibold">{file.filename}</span>
                </div>
                <span className="text-cyan-300 font-bold drop-shadow-[0_0_4px_rgba(34,211,238,0.25)]">{file.progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#010a15] rounded-full overflow-hidden border border-cyan-500/20 p-[1px] shadow-[inset_0_0_4px_rgba(6,182,212,0.1)]">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${file.progress}%`,
                    boxShadow: '0 0 8px rgba(6,182,212,0.5)'
                  }}
                />
              </div>
              
              <div className="flex justify-between items-center text-[9px] text-slate-500 px-0.5">
                <span className="uppercase text-cyan-400/70 font-bold tracking-wide">{file.status}</span>
                <span className="font-medium tracking-wide">{file.size}</span>
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
        className="w-full mt-3 pt-2 border-t border-cyan-500/20 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-between group cursor-pointer bg-transparent border-none outline-none"
      >
        <span className="tracking-widest uppercase font-bold text-[10px]">VIEW ALL UPLOADS</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-cyan-400 group-hover:drop-shadow-[0_0_3px_rgba(6,182,212,0.6)]" />
      </button>
      
    </div>
  );
};
