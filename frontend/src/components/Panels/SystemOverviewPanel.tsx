import React from 'react';

interface CircularGaugeProps {
  label: string;
  percent: number;
  color?: string;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({ label, percent, color = '#00f0ff' }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
          {/* Background track */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="#09253b"
            strokeWidth="4"
          />
          {/* Active progress ring */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute font-mono text-xs font-bold text-cyan-200">
          {percent}%
        </span>
      </div>
      <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider mt-1 font-medium">
        {label}
      </span>
    </div>
  );
};

export const SystemOverviewPanel: React.FC = () => {
  return (
    <div className="bg-slate-950/80 border border-cyan-500/30 rounded p-3.5 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.08)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-cyan-500/20">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
          SYSTEM OVERVIEW
        </span>
      </div>

      {/* 4 Gauges Grid matching reference */}
      <div className="grid grid-cols-4 gap-2">
        <CircularGauge label="CPU" percent={62} color="#00f0ff" />
        <CircularGauge label="MEMORY" percent={71} color="#00ff9d" />
        <CircularGauge label="STORAGE" percent={58} color="#ffb700" />
        <CircularGauge label="NETWORK" percent={91} color="#00a8ff" />
      </div>
    </div>
  );
};
