import React from 'react';
import { GeoNode } from '../../types';

interface IntelligenceTickerProps {
  selectedNode: GeoNode | null;
}

export const IntelligenceTicker: React.FC<IntelligenceTickerProps> = ({
  selectedNode
}) => {
  const lat = selectedNode ? selectedNode.latLabel : '39.7392° N';
  const lng = selectedNode ? selectedNode.lngLabel : '104.9903° W';

  return (
    <div className="w-full rounded border border-cyan-500/35 bg-slate-950/92 px-5 py-3 shadow-[0_0_18px_rgba(0,240,255,0.12)] backdrop-blur-md">
      <div className="mb-2 text-center font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-cyan-400">
        GEOMETRIC INTELLIGENCE TICKER
      </div>

      <div className="grid grid-cols-3 gap-4 text-center font-mono md:grid-cols-6">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            LATITUDE
          </span>
          <span className="text-[13px] font-semibold text-cyan-300">
            {lat}
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            LONGITUDE
          </span>
          <span className="text-[13px] font-semibold text-cyan-300">
            {lng}
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            RADIUS
          </span>
          <span className="text-[13px] font-semibold text-cyan-300">
            6,371.008 km
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            DIAMETER
          </span>
          <span className="text-[13px] font-semibold text-cyan-300">
            12,742.016 km
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            CIRCUMFERENCE
          </span>
          <span className="text-[13px] font-semibold text-cyan-300">
            40,075.017 km
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            SURFACE AREA
          </span>
          <span className="text-[13px] font-semibold text-cyan-300">
            510,072,000 km²
          </span>
        </div>
      </div>
    </div>
  );
};