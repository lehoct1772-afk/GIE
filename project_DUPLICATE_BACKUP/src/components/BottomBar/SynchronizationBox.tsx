import React from 'react';

export const SynchronizationBox: React.FC = () => {
  return (
    <div className="bg-slate-950/90 border border-cyan-500/40 rounded px-6 py-2.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.15)] text-center flex flex-col items-center">
      <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-widest uppercase mb-1">
        ENGINE SYNCHRONIZATION
      </span>

      <span className="text-[10px] font-mono text-cyan-300 tracking-widest uppercase mb-2 font-semibold">
        GLOBAL GEOMETRIC HARMONICS ALIGNMENT
      </span>

      {/* Real-time Harmonic Alignment Metrics */}
      <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-300 pt-1.5 border-t border-cyan-500/20 w-full justify-center">
        <div>
          <span className="text-slate-500">ANGLE: </span>
          <span className="text-cyan-300 font-semibold">137.507°</span>
        </div>
        <div>
          <span className="text-slate-500">RATIO (&phi;): </span>
          <span className="text-amber-300 font-semibold">1.61803</span>
        </div>
        <div>
          <span className="text-slate-500">DISTANCE: </span>
          <span className="text-cyan-300 font-semibold">2,847.391 km</span>
        </div>
        <div>
          <span className="text-slate-500">SYMMETRY: </span>
          <span className="text-emerald-300 font-semibold">82.7%</span>
        </div>
      </div>
    </div>
  );
};
