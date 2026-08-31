import React, { useState, useEffect } from 'react';

export const EngineStatusPanel: React.FC = () => {
  const [seconds, setSeconds] = useState(15234);
  const [imagesDecoded, setImagesDecoded] = useState(12847);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
      if (Math.random() > 0.4) {
        setImagesDecoded(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (totalSec: number) => {
    const days = 128;
    const hrs = 17;
    const mins = 42;
    const secs = totalSec % 60;
    return `${days}d ${hrs}h ${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="bg-slate-950/80 border border-cyan-500/40 rounded p-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-cyan-500/20 bg-slate-950/20 px-0.5">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
          ENGINE STATUS
        </span>
        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse shadow-[0_0_8px_#34d399]"></span> ONLINE
        </span>
      </div>

      {/* Metrics List matching reference image */}
      <div className="space-y-1.5 font-mono text-[11px]">
        <div className="flex justify-between items-center transition-colors hover:bg-cyan-950/20 py-0.5 px-1 rounded-sm">
          <span className="text-slate-400">ACTIVE PROJECTS</span>
          <span className="text-cyan-300 font-bold">128</span>
        </div>
        
        <div className="flex justify-between items-center transition-colors hover:bg-cyan-950/20 py-0.5 px-1 rounded-sm">
          <span className="text-slate-400">IMAGES DECODED</span>
          <span className="text-cyan-300 font-bold">{imagesDecoded.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center transition-colors hover:bg-cyan-950/20 py-0.5 px-1 rounded-sm">
          <span className="text-slate-400">RELATIONSHIPS FOUND</span>
          <span className="text-cyan-300 font-bold">3,982,741</span>
        </div>
        
        <div className="flex justify-between items-center transition-colors hover:bg-cyan-950/20 py-0.5 px-1 rounded-sm">
          <span className="text-slate-400">CALCULATIONS / SEC</span>
          <span className="text-amber-400 font-black drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]">8.652M</span>
        </div>
        
        <div className="flex justify-between items-center transition-colors hover:bg-cyan-950/20 py-0.5 px-1 rounded-sm">
          <span className="text-slate-400">ENGINE ACCURACY</span>
          <span className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]">99.9987%</span>
        </div>
        
        <div className="flex justify-between items-center transition-colors hover:bg-cyan-950/20 py-0.5 px-1 rounded-sm">
          <span className="text-slate-400">UPTIME</span>
          <span className="text-cyan-400 font-bold">{formatUptime(seconds)}</span>
        </div>
        
        <div className="flex justify-between items-center pt-1 border-t border-cyan-500/10 transition-colors hover:bg-cyan-950/20 px-1 rounded-sm">
          <span className="text-slate-400">ACTIVE RESEARCHERS</span>
          <span className="text-cyan-300 font-bold">247</span>
        </div>
      </div>

    </div>
  );
};
