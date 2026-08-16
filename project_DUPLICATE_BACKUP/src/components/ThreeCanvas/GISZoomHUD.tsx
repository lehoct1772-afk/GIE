import React from 'react';
import { GISZoomLevel } from '../../types';
import { Maximize2, Minimize2, Radio, Compass } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface GISZoomHUDProps {
  zoomLevel: GISZoomLevel;
  cameraDistance: number;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

const ZOOM_INFO: Record<GISZoomLevel, { title: string; subtitle: string; items: string[] }> = {
  GLOBAL: {
    title: 'GLOBAL VIEW',
    subtitle: 'ORBITAL CONTINENTAL SCALE',
    items: ['Earth Sphere', 'Continents Outline', 'Lat/Long Meridian Grid', 'Primary GIE Origin Nodes']
  },
  REGIONAL: {
    title: 'REGIONAL VIEW',
    subtitle: 'SUB-CONTINENTAL MAPPING',
    items: ['Country Borders', 'Mountain Ridges', 'Major River Basins', 'Coastline Vector Details']
  },
  GEOLOGICAL: {
    title: 'GEOLOGICAL VIEW',
    subtitle: 'TECTONIC & BATHYMETRIC CRUST',
    items: ['Bathymetric Depth Gradients', 'Ocean Trench System', 'Ring of Fire Volcanoes', 'Fault Lines & Plates']
  },
  RESEARCH: {
    title: 'RESEARCH VIEW',
    subtitle: 'SACRED & HARMONIC OVERLAYS',
    items: ['Ley Lines Grid', 'Crop Circle Coordinates', 'Ancient Monument Vectors', 'Mathematical Golden Spirals']
  },
  LOCAL: {
    title: 'LOCAL VIEW',
    subtitle: 'PRECISION GEODESIC TRIANGULATION',
    items: ['Sub-millimeter Coordinates', 'Spherical Trigonometry', 'AI Resonance Analysis', 'Linked Research Docs']
  }
};

export const GISZoomHUD: React.FC<GISZoomHUDProps> = ({
  zoomLevel,
  cameraDistance,
  isFocusMode,
  onToggleFocusMode
}) => {
  const info = ZOOM_INFO[zoomLevel];
  const altitudeKm = Math.round(cameraDistance * 420);

  return (
    <div className="absolute bottom-4 left-4 z-20 font-mono select-none pointer-events-auto">
      <div className="bg-slate-950/90 border border-cyan-500/40 rounded p-3 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.2)] flex flex-col space-y-2 min-w-[220px]">
        {/* Altitude & Level Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
          <div className="flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold text-cyan-300 tracking-wider">
              {info.title}
            </span>
          </div>
          <span className="text-[9px] text-amber-300 font-semibold bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded">
            ALT: {altitudeKm.toLocaleString()} KM
          </span>
        </div>

        {/* Subtitle & Progressive Info */}
        <div className="text-[8px] text-cyan-500/80 uppercase font-semibold">
          {info.subtitle}
        </div>

        {/* Progressive Active Features Pills */}
        <div className="flex flex-wrap gap-1 pt-0.5">
          {info.items.map((item, idx) => (
            <span
              key={idx}
              className="text-[8px] bg-cyan-950/80 border border-cyan-500/30 text-cyan-200 px-1.5 py-0.5 rounded"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Focus Mode CTA Button */}
        <div className="pt-1 border-t border-cyan-500/20 flex items-center justify-between">
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleFocusMode();
            }}
            className={`w-full py-1 px-2 rounded border text-[9px] font-bold tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              isFocusMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_10px_rgba(255,183,0,0.3)]'
                : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/80'
            }`}
          >
            {isFocusMode ? (
              <>
                <Minimize2 className="w-3 h-3 text-amber-300" />
                <span>EXIT FOCUS MODE</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3 text-cyan-400" />
                <span>ENTER FOCUS MODE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
