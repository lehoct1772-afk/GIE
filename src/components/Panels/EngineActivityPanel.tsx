import React, { useState, useEffect } from 'react';

export const EngineActivityPanel: React.FC = () => {
  const [points, setPoints] = useState<number[]>([
    40, 55, 30, 65, 50, 80, 45, 75, 90, 60, 85, 95, 70, 88, 62, 78, 92, 84
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        const nextVal = Math.floor(60 + Math.random() * 38);
        return [...prev.slice(1), nextVal];
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const svgPath = points.map((p, i) => `${(i / (points.length - 1)) * 100},${100 - p}`).join(' L ');

  return (
    <div className="bg-slate-950/80 border border-cyan-500/40 rounded p-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-cyan-500/20 bg-slate-950/20 px-0.5">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
          ENGINE ACTIVITY
        </span>
      </div>

      {/* Metric Display */}
      <div className="flex justify-between items-baseline mb-2 px-0.5">
        <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400">REAL-TIME THROUGHPUT</div>
        <div className="text-right">
          <span className="text-xl font-mono font-black text-cyan-300 tracking-wider drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">8.652M</span>
          <span className="text-[9px] font-mono font-bold text-cyan-400/70 block tracking-wider mt-0.5">CALCULATIONS / SEC</span>
        </div>
      </div>

      {/* Sparkline Waveform SVG */}
      <div className="w-full h-12 relative border border-cyan-500/30 bg-[#010a15] rounded overflow-hidden p-1 shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="#06b6d4" strokeWidth="0.25" strokeDasharray="1 3" opacity="0.15" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#06b6d4" strokeWidth="0.25" strokeDasharray="1 3" opacity="0.15" />
          
          {/* Animated Line */}
          <path
            d={`M ${svgPath}`}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_4px_rgba(6,182,212,0.8)]"
          />
        </svg>
      </div>

    </div>
  );
};
