import React from 'react';

export const SynchronizationBox: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center rounded border border-cyan-500/40 bg-slate-950/92 px-6 py-3 text-center shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md">
      <span className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
        ENGINE SYNCHRONIZATION
      </span>

      <span className="mb-2 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
        GLOBAL GEOMETRIC HARMONICS ALIGNMENT
      </span>

      <div className="flex w-full items-center justify-center space-x-6 border-t border-cyan-500/20 pt-2 font-mono text-[11px] text-slate-300">
        <div>
          <span className="text-slate-500">ANGLE: </span>
          <span className="font-semibold text-cyan-300">
            137.507°
          </span>
        </div>

        <div>
          <span className="text-slate-500">
            RATIO (φ):{' '}
          </span>
          <span className="font-semibold text-amber-300">
            1.61803
          </span>
        </div>

        <div>
          <span className="text-slate-500">
            DISTANCE:{' '}
          </span>
          <span className="font-semibold text-cyan-300">
            2,847.391 km
          </span>
        </div>

        <div>
          <span className="text-slate-500">
            SYMMETRY:{' '}
          </span>
          <span className="font-semibold text-emerald-300">
            82.7%
          </span>
        </div>
      </div>
    </div>
  );
};