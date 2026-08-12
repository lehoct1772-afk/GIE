import React from 'react';
import { GeoNode } from '../../types';

interface IntelligenceTickerProps {
  selectedNode: GeoNode | null;
}

export const IntelligenceTicker: React.FC<IntelligenceTickerProps> = ({ selectedNode }) => {
  const lat = selectedNode ? selectedNode.latLabel : '39.7392° N';
  const lng = selectedNode ? selectedNode.lngLabel : '104.9903° W';

  return (
    <div className="bg-slate-950/90 border border-cyan-500/30 rounded px-4 py-2 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.08)]">
      <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest text-center mb-1">
        GEOMETRIC INTELLIGENCE TICKER
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-center font-mono text-xs">
        <div>
          <span className="text-[9px] text-slate-400 uppercase block">LATITUDE</span>
          <span className="text-cyan-300 font-semibold">{lat}</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase block">LONGITUDE</span>
          <span className="text-cyan-300 font-semibold">{lng}</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase block">RADIUS</span>
          <span className="text-cyan-300 font-semibold">6,371.008 km</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase block">DIAMETER</span>
          <span className="text-cyan-300 font-semibold">12,742.016 km</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase block">CIRCUMFERENCE</span>
          <span className="text-cyan-300 font-semibold">40,075.017 km</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase block">SURFACE AREA</span>
          <span className="text-cyan-300 font-semibold">510,072,000 km²</span>
        </div>
      </div>
    </div>
  );
};
