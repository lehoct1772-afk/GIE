import React from 'react';

export const SynchronizationBox: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center rounded border border-cyan-500/40 bg-slate-950/92 px-6 py-3 text-center shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md transition-all duration-300">
      <span className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]">
        ENGINE SYNCHRONIZATION
      </span>
      
      <span className="mb-2 font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-cyan-300/90 drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]">
        GLOBAL GEOMETRIC HARMONICS ALIGNMENT
      </span>
      
      <div className="flex w-full items-center justify-center space-x-6 border-t border-cyan-500/20 pt-2 font-mono text-[11px] text-slate-300">
        <div className="hover:bg-cyan-950/20 px-1.5 py-0.5 rounded transition-colors duration-200">
          <span className="text-slate-500 font-bold">ANGLE: </span>
          <span className="font-bold text-cyan-300 drop-shadow-[0_0_4px_rgba(34,211,238,0.25)]">137.507°</span>
        </div>
        
        <div className="hover:bg-cyan-950/20 px-1.5 py-0.5 rounded transition-colors duration-200">
          <span className="text-slate-500 font-bold">RATIO (φ): </span>
          <span className="font-bold text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.25)]">1.61803</span>
        </div>
        
        <div className="hover:bg-cyan-950/20 px-1.5 py-0.5 rounded transition-colors duration-200">
          <span className="text-slate-500 font-bold">DISTANCE: </span>
          <span className="font-bold text-cyan-300 drop-shadow-[0_0_4px_rgba(34,211,238,0.25)]">2,847.391 km</span>
        </div>
        
        <div className="hover:bg-cyan-950/20 px-1.5 py-0.5 rounded transition-colors duration-200">
          <span className="text-slate-500 font-bold">SYMMETRY: </span>
          <span className="font-bold text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.25)]">82.7%</span>
        </div>
      </div>
    </div>
  );
};
